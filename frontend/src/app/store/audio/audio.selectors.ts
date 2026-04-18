import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioState } from './audio.reducer';

export const selectAudioState = createFeatureSelector<AudioState>('audio');

export const selectAllSounds = createSelector(
  selectAudioState,
  (state) => state.sounds
);

export const selectSound = (soundId: string) => createSelector(
  selectAllSounds,
  (sounds) => sounds[soundId]
);

export const selectPlayingSounds = createSelector(
  selectAllSounds,
  (sounds) => Object.entries(sounds)
    .filter(([, s]) => s.playing)
    .map(([id]) => id)
);
