import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AudioActions } from '../../store/audio/audio.actions';
import { selectAllSounds } from '../../store/audio/audio.selectors';
import { AudioService } from '../../core/services/audio.service';

@Component({
  selector: 'app-sound-controls',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './sound-controls.component.html',
  styleUrl: './sound-controls.component.scss',
})
export class SoundControlsComponent implements OnInit {

  private store = inject(Store);
  private audio = inject(AudioService);

  sounds$   = this.store.select(selectAllSounds);
  soundList = this.audio.SOUNDS;
  showPan   = false;

  async ngOnInit(): Promise<void> {
    await Promise.all(
      this.soundList.map(s => this.audio.loadSound(s.id, `assets/sounds/${s.file}`))
    );
  }

  toggle(soundId: string): void {
    this.store.dispatch(AudioActions.toggleSound({ soundId }));
  }

  onVolumeChange(soundId: string, event: Event): void {
    const volume = +(event.target as HTMLInputElement).value / 100;
    this.store.dispatch(AudioActions.setVolume({ soundId, volume }));
  }

  onPanChange(soundId: string, event: Event): void {
    const pan = +(event.target as HTMLInputElement).value / 100;
    this.store.dispatch(AudioActions.setPan({ soundId, pan }));
  }

  stopAll(): void {
    this.store.dispatch(AudioActions.stopAll());
  }
}
