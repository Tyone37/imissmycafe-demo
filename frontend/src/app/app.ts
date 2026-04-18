import { Component, OnInit } from '@angular/core';
import { MusicPlayerComponent } from './features/music-player/music-player.component';
import { SoundControlsComponent } from './features/sound-controls/sound-controls.component';

@Component({
  selector: 'app-root',
  imports: [MusicPlayerComponent, SoundControlsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {

  isDarkMode = false;

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();
  }

  toggleDark(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }
}
