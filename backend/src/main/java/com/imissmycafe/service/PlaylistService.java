package com.imissmycafe.service;

import com.imissmycafe.dto.PlaylistCacheResponse;
import com.imissmycafe.model.PlaylistCache.Provider;

public interface PlaylistService {

    /**
     * Lấy playlist từ cache DB nếu còn hạn (TTL 1h), ngược lại gọi API rồi lưu lại.
     *
     * @param provider  spotify hoặc youtube
     * @param playlistId ID của playlist
     */
    PlaylistCacheResponse getPlaylist(Provider provider, String playlistId);

    /**
     * Xóa cache của một playlist cụ thể — dùng khi muốn force refresh
     */
    void evictCache(Provider provider, String playlistId);
}
