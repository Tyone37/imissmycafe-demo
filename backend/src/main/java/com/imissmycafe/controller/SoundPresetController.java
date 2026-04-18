package com.imissmycafe.controller;

import com.imissmycafe.dto.SoundPresetRequest;
import com.imissmycafe.dto.SoundPresetResponse;
import com.imissmycafe.service.SoundPresetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý CRUD sound preset.
 * Không chứa business logic — ủy quyền hoàn toàn cho SoundPresetService.
 */
@RestController
@RequestMapping("/api/presets")
@RequiredArgsConstructor
public class SoundPresetController {

    private final SoundPresetService presetService;

    /** GET /api/presets — lấy tất cả preset */
    @GetMapping
    public ResponseEntity<List<SoundPresetResponse>> getAll() {
        return ResponseEntity.ok(presetService.findAll());
    }

    /** GET /api/presets/{id} — lấy một preset theo ID */
    @GetMapping("/{id}")
    public ResponseEntity<SoundPresetResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(presetService.findById(id));
    }

    /** POST /api/presets — tạo preset mới */
    @PostMapping
    public ResponseEntity<SoundPresetResponse> create(@Valid @RequestBody SoundPresetRequest request) {
        SoundPresetResponse saved = presetService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** DELETE /api/presets/{id} — xóa preset */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        presetService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
