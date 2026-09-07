import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly modeSignal = signal<ThemeMode>('system');
  private media?: MediaQueryList;

  readonly mode = this.modeSignal.asReadonly();
  readonly resolved = computed(() => this.resolve(this.modeSignal()));

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      this.modeSignal.set(stored);
    }

    this.media = window.matchMedia('(prefers-color-scheme: dark)');
    this.media.addEventListener('change', () => {
      if (this.modeSignal() === 'system') {
        this.apply();
      }
    });

    this.apply();
  }

  setMode(mode: ThemeMode): void {
    this.modeSignal.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, mode);
      this.apply();
    }
  }

  cycle(): void {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const current = this.modeSignal();
    const next = order[(order.indexOf(current) + 1) % order.length];
    this.setMode(next);
  }

  toggleLightDark(): void {
    const next = this.resolve(this.modeSignal()) === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  private resolve(mode: ThemeMode): 'light' | 'dark' {
    if (mode === 'light' || mode === 'dark') {
      return mode;
    }
    if (!isPlatformBrowser(this.platformId)) {
      return 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const dark = this.resolve(this.modeSignal()) === 'dark';
    document.documentElement.classList.toggle('dark', dark);
  }
}
