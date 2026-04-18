import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PlaylistCacheResponse {
  provider: string;
  playlistId: string;
  dataJson: string;
  fetchedAt: string;
  fromCache: boolean;
}

/**
 * Gọi backend proxy để lấy dữ liệu playlist.
 * Frontend không bao giờ gọi trực tiếp YouTube API — API key được giữ ở backend.
 */
@Injectable({ providedIn: 'root' })
export class PlaylistService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  /** Lấy playlist YouTube (có cache TTL 1h ở backend) */
  getYouTubePlaylist(playlistId: string): Observable<PlaylistCacheResponse> {
    return this.http.get<PlaylistCacheResponse>(
      `${this.base}/playlists/youtube/${playlistId}`
    );
  }

  /** Force xóa cache — dùng khi cần refresh ngay */
  evictCache(provider: 'youtube' | 'spotify', playlistId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/playlists/${provider}/${playlistId}/cache`
    );
  }
}
