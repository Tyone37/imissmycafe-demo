import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, take, tap, withLatestFrom } from 'rxjs';
import { AudioActions } from './audio.actions';
import { AudioService } from '../../core/services/audio.service';
import { selectAllSounds, selectSound } from './audio.selectors';

@Injectable()
export class AudioEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private audio    = inject(AudioService);

  toggleSound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.toggleSound),
      concatMap(({ soundId }) =>
        this.store.select(selectSound(soundId)).pipe(
          take(1),
          tap(sound => sound?.playing ? this.audio.play(soundId) : this.audio.stop(soundId))
        )
      )
    ),
    { dispatch: false }
  );

  setVolume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.setVolume),
      tap(({ soundId, volume }) => this.audio.setVolume(soundId, volume))
    ),
    { dispatch: false }
  );

  setPan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.setPan),
      tap(({ soundId, pan }) => this.audio.setPan(soundId, pan))
    ),
    { dispatch: false }
  );

  stopAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.stopAll),
      withLatestFrom(this.store.select(selectAllSounds)),
      tap(([, sounds]) => Object.keys(sounds).forEach(id => this.audio.stop(id)))
    ),
    { dispatch: false }
  );
}
