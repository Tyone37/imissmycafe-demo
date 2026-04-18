package com.imissmycafe.service.impl;

import com.imissmycafe.dto.PlaylistCacheResponse;
import com.imissmycafe.model.PlaylistCache;
import com.imissmycafe.model.PlaylistCache.Provider;
import com.imissmycafe.repository.PlaylistCacheRepository;
import com.imissmycafe.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistCacheRepository cacheRepository;
    private final WebClient webClient;

    // TTL cache: 1 giờ — giữ quota YouTube API (10,000 units/ngày)
    private static final int CACHE_TTL_HOURS = 1;

    @Value("${youtube.api-key}")
    private String youtubeApiKey;

    @Override
    @Transactional
    public PlaylistCacheResponse getPlaylist(Provider provider, String playlistId) {
        Optional<PlaylistCache> cached = cacheRepository.findByProviderAndPlaylistId(provider, playlistId);

        // Trả cache nếu còn trong TTL
        if (cached.isPresent() && isCacheValid(cached.get())) {
            PlaylistCache hit = cached.get();
            return new PlaylistCacheResponse(
                    hit.getProvider().name(), hit.getPlaylistId(),
                    hit.getDataJson(), hit.getFetchedAt(), true
            );
        }

        // Cache hết hạn hoặc chưa có — gọi API rồi lưu lại
        String freshData = fetchFromApi(provider, playlistId);

        PlaylistCache entry = cached.orElse(new PlaylistCache());
        entry.setProvider(provider);
        entry.setPlaylistId(playlistId);
        entry.setDataJson(freshData);
        // fetchedAt tự cập nhật qua @CreationTimestamp / set thủ công khi update
        PlaylistCache saved = cacheRepository.save(entry);

        return new PlaylistCacheResponse(
                saved.getProvider().name(), saved.getPlaylistId(),
                saved.getDataJson(), saved.getFetchedAt(), false
        );
    }

    @Override
    @Transactional
    public void evictCache(Provider provider, String playlistId) {
        cacheRepository.findByProviderAndPlaylistId(provider, playlistId)
                .ifPresent(cacheRepository::delete);
    }

    /** Cache hợp lệ khi fetchedAt chưa quá CACHE_TTL_HOURS */
    private boolean isCacheValid(PlaylistCache cache) {
        return cache.getFetchedAt() != null
                && cache.getFetchedAt().isAfter(LocalDateTime.now().minusHours(CACHE_TTL_HOURS));
    }

    /**
     * Gọi YouTube Data API v3 để lấy playlist items.
     * Chỉ gọi khi cache hết hạn — mỗi lần tốn ~50 quota units.
     */
    private String fetchFromApi(Provider provider, String playlistId) {
        if (provider == Provider.youtube) {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("www.googleapis.com")
                            .path("/youtube/v3/playlistItems")
                            .queryParam("part", "snippet")
                            .queryParam("maxResults", "50")
                            .queryParam("playlistId", playlistId)
                            .queryParam("key", youtubeApiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        }

        // Spotify không cần API key ở backend (dùng embed ở frontend)
        throw new UnsupportedOperationException("Spotify playlist fetch chưa được hỗ trợ ở backend");
    }
}
