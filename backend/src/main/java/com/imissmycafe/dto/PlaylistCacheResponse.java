package com.imissmycafe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/** Response trả về client khi lấy playlist (dù từ cache hay API mới) */
@Getter @AllArgsConstructor
public class PlaylistCacheResponse {

    private String provider;
    private String playlistId;

    // JSON data của playlist — client parse theo cấu trúc YouTube/Spotify
    private String dataJson;

    // Thời điểm cache được lấy — client dùng để hiển thị "Last updated"
    private LocalDateTime fetchedAt;

    // true nếu dữ liệu lấy từ cache DB, false nếu gọi API mới
    private boolean fromCache;
}
