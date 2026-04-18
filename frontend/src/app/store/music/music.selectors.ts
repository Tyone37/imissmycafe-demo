import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MusicState } from './music.reducer';

export const selectMusicState  = createFeatureSelector<MusicState>('music');
export const selectProvider    = createSelector(selectMusicState, s => s.provider);
export const selectSpotifyType = createSelector(selectMusicState, s => s.spotifyType);
export const selectSpotifyId   = createSelector(selectMusicState, s => s.spotifyId);
export const selectYouTubeType = createSelector(selectMusicState, s => s.youtubeType);
export const selectYouTubeId   = createSelector(selectMusicState, s => s.youtubeId);
