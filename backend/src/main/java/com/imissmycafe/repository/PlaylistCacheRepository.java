package com.imissmycafe.repository;

import com.imissmycafe.model.PlaylistCache;
import com.imissmycafe.model.PlaylistCache.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlaylistCacheRepository extends JpaRepository<PlaylistCache, Long> {

    /** Tìm cache theo provider + playlistId để kiểm tra TTL trước khi gọi API */
    Optional<PlaylistCache> findByProviderAndPlaylistId(Provider provider, String playlistId);
}
