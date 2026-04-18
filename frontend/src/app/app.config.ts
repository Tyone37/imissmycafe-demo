import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

import { routes } from './app.routes';
import { audioReducer } from './store/audio/audio.reducer';
import { musicReducer } from './store/music/music.reducer';
import { AudioEffects } from './store/audio/audio.effects';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // HttpClient với error interceptor toàn cục
    provideHttpClient(withInterceptors([errorInterceptor])),

    // NgRx Store — đăng ký audio và music slice
    provideStore({
      audio: audioReducer,
      music: musicReducer,
    }),

    // NgRx Effects
    provideEffects([AudioEffects]),

    // DevTools chỉ bật trong dev mode (không ảnh hưởng production bundle)
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
