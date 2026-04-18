import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AudioActions = createActionGroup({
  source: 'Audio',
  events: {
    'Toggle Sound':  props<{ soundId: string }>(),
    'Set Volume':    props<{ soundId: string; volume: number }>(),
    'Set Pan':       props<{ soundId: string; pan: number }>(),
    'Stop All':      emptyProps(),
    'Load Presets':  props<{ presets: Record<string, { volume: number; pan: number; playing: boolean }> }>(),
  },
});
