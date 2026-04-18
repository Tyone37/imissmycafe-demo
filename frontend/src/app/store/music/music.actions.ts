import { createActionGroup, props } from '@ngrx/store';

export type MusicProvider    = 'spotify' | 'youtube';
export type SpotifyType      = 'track' | 'playlist' | 'album';
export type YouTubeType      = 'video' | 'playlist';

export const MusicActions = createActionGroup({
  source: 'Music',
  events: {
    'Set Provider':        props<{ provider: MusicProvider }>(),
    'Set Spotify Content': props<{ spotifyType: SpotifyType; spotifyId: string }>(),
    'Set YouTube Content': props<{ youtubeType: YouTubeType; youtubeId: string }>(),
  },
});
