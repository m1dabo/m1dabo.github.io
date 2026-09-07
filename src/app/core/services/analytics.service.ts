import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private started = false;
  private enterAt = 0;
  private lastPath = '';

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.started) {
      return;
    }
    this.started = true;
    this.enterAt = Date.now();
    this.lastPath = this.router.url || '/';

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.flushDwell();
        this.lastPath = e.urlAfterRedirects || '/';
        this.enterAt = Date.now();
        this.trackPageView(this.lastPath);
      });

    this.trackPageView(this.lastPath);

    window.addEventListener('pagehide', () => this.flushDwell());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushDwell();
      } else {
        this.enterAt = Date.now();
      }
    });
  }

  private prefersNoTracking(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    return navigator.doNotTrack === '1' || nav.globalPrivacyControl === true;
  }

  private trackPageView(path: string): void {
    if (this.prefersNoTracking()) {
      return;
    }
    this.api.trackAnalyticsBeacon({
      path,
      referrer: document.referrer || null,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      eventType: 'pageview',
    });
  }

  private flushDwell(): void {
    if (this.prefersNoTracking() || !this.lastPath) {
      return;
    }
    const dwellMs = Math.max(0, Date.now() - this.enterAt);
    if (dwellMs < 500) {
      return;
    }
    this.api.trackAnalyticsBeacon({
      path: this.lastPath,
      referrer: document.referrer || null,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      dwellMs,
      eventType: 'dwell',
    });
  }
}
