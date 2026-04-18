package com.imissmycafe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/** Response trả về client sau khi lưu/lấy sound preset */
@Getter @AllArgsConstructor
public class SoundPresetResponse {

    private Long id;
    private String presetName;
    private String soundsJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
