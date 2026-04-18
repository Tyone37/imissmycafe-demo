-- Initial schema for imissmycafe-Demo
-- Chạy tự động khi MySQL container khởi động lần đầu

CREATE DATABASE IF NOT EXISTS imissmycafe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE imissmycafe_db;

-- Bảng lưu preset âm thanh của người dùng (theo session/device)
CREATE TABLE IF NOT EXISTS sound_presets (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    preset_name VARCHAR(100)  NOT NULL,
    sounds_json TEXT          NOT NULL, -- JSON: [{soundId, volume, pan, enabled}]
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng lưu cấu hình playlist (Spotify / YouTube)
CREATE TABLE IF NOT EXISTS playlist_cache (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider     ENUM('spotify', 'youtube') NOT NULL,
    playlist_id  VARCHAR(200) NOT NULL,
    data_json    LONGTEXT     NOT NULL, -- Dữ liệu playlist cache từ API
    fetched_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_provider_playlist (provider, playlist_id)
);