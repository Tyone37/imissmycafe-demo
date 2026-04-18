package com.imissmycafe.repository;

import com.imissmycafe.model.SoundPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoundPresetRepository extends JpaRepository<SoundPreset, Long> {

    /** Tìm tất cả preset theo tên (không phân biệt hoa thường) */
    List<SoundPreset> findByPresetNameContainingIgnoreCase(String name);
}
