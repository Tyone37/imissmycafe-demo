package com.imissmycafe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/** Request body khi tạo hoặc cập nhật một sound preset */
@Getter @Setter
public class SoundPresetRequest {

    @NotBlank(message = "Tên preset không được để trống")
    @Size(max = 100, message = "Tên preset tối đa 100 ký tự")
    private String presetName;

    // JSON string dạng [{soundId, volume, pan, enabled}] — validate format ở Service
    @NotBlank(message = "Cấu hình sounds không được để trống")
    private String soundsJson;
}
