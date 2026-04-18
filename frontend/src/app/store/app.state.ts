import { AudioState } from './audio/audio.reducer';
import { MusicState } from './music/music.reducer';

/** Root state của toàn bộ NgRx store */
export interface AppState {
  audio: AudioState;
  music: MusicState;
}
