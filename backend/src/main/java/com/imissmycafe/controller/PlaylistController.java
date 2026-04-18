package com.imissmycafe.controller;

import com.imissmycafe.dto.PlaylistCacheResponse;
import com.imissmycafe.model.PlaylistCache.Provider;
import com.imissmycafe.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller proxy cho YouTube/Spotify playlist.
 * Ẩn API key khỏi frontend — mọi request đến API bên ngoài đi qua đây.
 */
@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    /**
     * GET /api/playlists/{provider}/{playlistId}
     * Trả playlist data (từ cache DB hoặc API mới tùy TTL).
     *
     * @param provider   "youtube" hoặc "spotify"
     * @param playlistId ID playlist
     */
    @GetMapping("/{provider}/{playlistId}")
    public ResponseEntity<PlaylistCacheResponse> getPlaylist(
            @PathVariable String provider,
            @PathVariable String playlistId) {

        return ResponseEntity.ok(playlistService.getPlaylist(parseProvider(provider), playlistId));
    }

    @DeleteMapping("/{provider}/{playlistId}/cache")
    public ResponseEntity<Void> evictCache(
            @PathVariable String provider,
            @PathVariable String playlistId) {

        playlistService.evictCache(parseProvider(provider), playlistId);
        return ResponseEntity.noContent().build();
    }

    private Provider parseProvider(String raw) {
        try {
            return Provider.valueOf(raw.toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Provider không hợp lệ: '" + raw + "'. Dùng 'youtube' hoặc 'spotify'.");
        }
    }
}
