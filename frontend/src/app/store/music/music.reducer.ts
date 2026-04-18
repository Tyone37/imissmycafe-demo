import { createReducer, on } from '@ngrx/store';
import { MusicActions, MusicProvider, SpotifyType, YouTubeType } from './music.actions';

export interface MusicState {
  provider:    MusicProvider;
  spotifyType: SpotifyType;
  spotifyId:   string;
  youtubeType: YouTubeType;
  youtubeId:   string;
}

export const initialMusicState: MusicState = {
  provider:    'spotify',
  spotifyType: 'playlist',
  spotifyId:   '42lVtzJzGUCZ5AsMeetaaS',
  youtubeType: 'video',
  youtubeId:   'CWVUkdllAWk',
};

export const musicReducer = createReducer(
  initialMusicState,
  on(MusicActions.setProvider,       (state, { provider })                     => ({ ...state, provider })),
  on(MusicActions.setSpotifyContent, (state, { spotifyType, spotifyId })        => ({ ...state, spotifyType, spotifyId })),
  on(MusicActions.setYouTubeContent, (state, { youtubeType, youtubeId })        => ({ ...state, youtubeType, youtubeId })),
);
