import { createReducer, on } from '@ngrx/store';
import { AudioActions } from './audio.actions';
import { SOUND_LIST } from '../../core/config/sounds.config';

export interface SoundState {
  volume: number;
  pan: number;
  playing: boolean;
}

export interface AudioState {
  sounds: Record<string, SoundState>;
}

const defaultSound = (): SoundState => ({ volume: 0.5, pan: 0, playing: false });

const patchSound = (
  state: AudioState,
  soundId: string,
  patch: Partial<SoundState>
): AudioState => ({
  ...state,
  sounds: { ...state.sounds, [soundId]: { ...state.sounds[soundId], ...patch } },
});

export const initialAudioState: AudioState = {
  sounds: Object.fromEntries(SOUND_LIST.map(s => [s.id, defaultSound()])),
};

export const audioReducer = createReducer(
  initialAudioState,

  on(AudioActions.toggleSound, (state, { soundId }) =>
    patchSound(state, soundId, { playing: !state.sounds[soundId]?.playing })
  ),

  on(AudioActions.setVolume, (state, { soundId, volume }) =>
    patchSound(state, soundId, { volume })
  ),

  on(AudioActions.setPan, (state, { soundId, pan }) =>
    patchSound(state, soundId, { pan })
  ),

  on(AudioActions.stopAll, (state) => ({
    ...state,
    sounds: Object.fromEntries(
      Object.entries(state.sounds).map(([id, s]) => [id, { ...s, playing: false }])
    ),
  })),

  on(AudioActions.loadPresets, (state, { presets }) => ({
    ...state,
    sounds: { ...state.sounds, ...presets },
  })),
);
