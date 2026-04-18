import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {

  isDarkMode = false;

  ngOnInit(): void {
    // Đọc preference đã lưu từ localStorage
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.applyTheme();
  }

  /** Thêm/xóa class .dark trên <html> để Tailwind và CSS vars tự xử lý */
  private applyTheme(): void {
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }
}
