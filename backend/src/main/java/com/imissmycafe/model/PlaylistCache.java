package com.imissmycafe.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Cache kết quả playlist từ YouTube/Spotify API vào DB.
 * Tránh gọi lại API liên tục — giới hạn quota YouTube là 10,000 units/ngày.
 */
@Entity
@Table(name = "playlist_cache",
       uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "playlist_id"}))
@Getter @Setter @NoArgsConstructor
public class PlaylistCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Provider provider;

    @Column(name = "playlist_id", nullable = false, length = 200)
    private String playlistId;

    // Raw JSON trả về từ YouTube/Spotify API — không parse ở đây
    @Column(name = "data_json", nullable = false, columnDefinition = "LONGTEXT")
    private String dataJson;

    @CreationTimestamp
    @Column(name = "fetched_at", updatable = false)
    private LocalDateTime fetchedAt;

    public enum Provider {
        spotify, youtube
    }
}
