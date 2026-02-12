// Update your theme.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkTheme = 'darkMode';
  private lightTheme = 'light';
  private themeKey = 'theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const isDark = this.getTheme() === this.darkTheme;
    this.setTheme(isDark ? this.lightTheme : this.darkTheme);
  }

  getTheme(): string {
    return localStorage.getItem(this.themeKey) || this.darkTheme;
  }

  setTheme(theme: string): void {
    localStorage.setItem(this.themeKey, theme);
    
    // Remove both theme classes
    document.body.classList.remove(this.darkTheme);
    document.body.classList.remove(this.lightTheme);
    
    // Add current theme class
    document.body.classList.add(theme);
  }

  loadTheme(): void {
    const theme = this.getTheme();
    document.body.classList.add(theme);
  }
}