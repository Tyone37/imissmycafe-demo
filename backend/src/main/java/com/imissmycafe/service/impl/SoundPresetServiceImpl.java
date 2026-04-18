package com.imissmycafe.service.impl;

import com.imissmycafe.dto.SoundPresetRequest;
import com.imissmycafe.dto.SoundPresetResponse;
import com.imissmycafe.model.SoundPreset;
import com.imissmycafe.repository.SoundPresetRepository;
import com.imissmycafe.service.SoundPresetService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SoundPresetServiceImpl implements SoundPresetService {

    private final SoundPresetRepository presetRepository;

    @Override
    @Transactional
    public SoundPresetResponse save(SoundPresetRequest request) {
        SoundPreset preset = new SoundPreset();
        preset.setPresetName(request.getPresetName());
        preset.setSoundsJson(request.getSoundsJson());

        SoundPreset saved = presetRepository.save(preset);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SoundPresetResponse findById(Long id) {
        SoundPreset preset = presetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Preset không tồn tại: id=" + id));
        return toResponse(preset);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SoundPresetResponse> findAll() {
        return presetRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!presetRepository.existsById(id)) {
            throw new EntityNotFoundException("Preset không tồn tại: id=" + id);
        }
        presetRepository.deleteById(id);
    }

    /** Chuyển Entity sang DTO — không expose Entity trực tiếp ra Controller */
    private SoundPresetResponse toResponse(SoundPreset preset) {
        return new SoundPresetResponse(
                preset.getId(),
                preset.getPresetName(),
                preset.getSoundsJson(),
                preset.getCreatedAt(),
                preset.getUpdatedAt()
        );
    }
}
