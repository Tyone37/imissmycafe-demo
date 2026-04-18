import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MusicActions, MusicProvider, SpotifyType, YouTubeType } from '../../store/music/music.actions';
import { selectProvider, selectSpotifyId, selectSpotifyType, selectYouTubeId, selectYouTubeType } from '../../store/music/music.selectors';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-music-player',
  imports: [AsyncPipe, FormsModule, SafeUrlPipe],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent {

  private store = inject(Store);

  provider$     = this.store.select(selectProvider);
  spotifyType$  = this.store.select(selectSpotifyType);
  spotifyId$    = this.store.select(selectSpotifyId);
  youtubeType$  = this.store.select(selectYouTubeType);
  youtubeId$    = this.store.select(selectYouTubeId);

  spotifyInput    = '';
  showSpotifyInput = false;
  youtubeInput    = '';
  showYoutubeInput = false;

  switchProvider(provider: MusicProvider): void {
    this.store.dispatch(MusicActions.setProvider({ provider }));
  }

  applySpotifyUrl(): void {
    const result = this.parseSpotifyUrl(this.spotifyInput.trim());
    if (result) {
      this.store.dispatch(MusicActions.setSpotifyContent(result));
      this.spotifyInput    = '';
      this.showSpotifyInput = false;
    }
  }

  applyYouTubeUrl(): void {
    const result = this.parseYouTubeUrl(this.youtubeInput.trim());
    if (result) {
      this.store.dispatch(MusicActions.setYouTubeContent(result));
      this.youtubeInput    = '';
      this.showYoutubeInput = false;
    }
  }

  onSpotifyKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter')  this.applySpotifyUrl();
    if (e.key === 'Escape') this.showSpotifyInput = false;
  }

  onYoutubeKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter')  this.applyYouTubeUrl();
    if (e.key === 'Escape') this.showYoutubeInput = false;
  }

  spotifyEmbedUrl(type: SpotifyType, id: string): string {
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  youtubeEmbedUrl(type: YouTubeType, id: string): string {
    if (type === 'playlist') {
      return `https://www.youtube.com/embed/videoseries?list=${id}&autoplay=1`;
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  private parseSpotifyUrl(input: string): { spotifyType: SpotifyType; spotifyId: string } | null {
    if (!input) return null;

    // Spotify URI: spotify:track:ID / spotify:playlist:ID / spotify:album:ID
    const uriMatch = input.match(/^spotify:(track|playlist|album):([A-Za-z0-9]+)$/);
    if (uriMatch) return { spotifyType: uriMatch[1] as SpotifyType, spotifyId: uriMatch[2] };

    // Spotify URL: open.spotify.com/track|playlist|album/ID
    const urlMatch = input.match(/open\.spotify\.com\/(track|playlist|album)\/([A-Za-z0-9]+)/);
    if (urlMatch) return { spotifyType: urlMatch[1] as SpotifyType, spotifyId: urlMatch[2] };

    return null;
  }

  private parseYouTubeUrl(input: string): { youtubeType: YouTubeType; youtubeId: string } | null {
    if (!input) return null;

    // Playlist URL: youtube.com/playlist?list=ID
    const plMatch = input.match(/[?&]list=([A-Za-z0-9_-]+)/);
    if (plMatch && (input.includes('/playlist') || input.includes('list='))) {
      // If has both v= and list=, treat as playlist (plays full list)
      return { youtubeType: 'playlist', youtubeId: plMatch[1] };
    }

    // Individual video
    const patterns = [
      /[?&]v=([A-Za-z0-9_-]{11})/,
      /youtu\.be\/([A-Za-z0-9_-]{11})/,
      /embed\/([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = input.match(p);
      if (m) return { youtubeType: 'video', youtubeId: m[1] };
    }

    // Bare video ID (11 chars)
    if (/^[A-Za-z0-9_-]{11}$/.test(input)) return { youtubeType: 'video', youtubeId: input };

    // Bare playlist ID (starts with PL, UU, FL, etc.)
    if (/^[A-Za-z0-9_-]{24,}$/.test(input)) return { youtubeType: 'playlist', youtubeId: input };

    return null;
  }
}
