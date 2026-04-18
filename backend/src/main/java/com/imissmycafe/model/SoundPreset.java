package com.imissmycafe.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Lưu trữ preset cấu hình âm thanh ambient của người dùng.
 * soundsJson là mảng JSON: [{soundId, volume, pan, enabled}]
 */
@Entity
@Table(name = "sound_presets")
@Getter @Setter @NoArgsConstructor
public class SoundPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "preset_name", nullable = false, length = 100)
    private String presetName;

    // JSON string chứa cấu hình từng sound — parse ở tầng Service
    @Column(name = "sounds_json", nullable = false, columnDefinition = "TEXT")
    private String soundsJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
