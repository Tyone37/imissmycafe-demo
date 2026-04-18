package com.imissmycafe.service;

import com.imissmycafe.dto.SoundPresetRequest;
import com.imissmycafe.dto.SoundPresetResponse;

import java.util.List;

public interface SoundPresetService {

    /** Lưu một preset mới vào DB */
    SoundPresetResponse save(SoundPresetRequest request);

    /** Lấy preset theo ID, ném ResourceNotFoundException nếu không tồn tại */
    SoundPresetResponse findById(Long id);

    /** Lấy toàn bộ preset (dùng cho trang quản lý) */
    List<SoundPresetResponse> findAll();

    /** Xóa preset theo ID */
    void deleteById(Long id);
}
