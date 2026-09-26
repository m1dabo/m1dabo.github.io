import {
  Component,
  HostListener,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PROFILE } from './core/content/profile';
import { AnalyticsService } from './core/services/analytics.service';
import { ThemeService } from './core/services/theme.service';
import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';
import { TerminalComponent } from './shared/components/terminal/terminal.component';

const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'case-studies', label: 'Work' },
  { id: 'contact', label: 'Contact' },
] as const;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommandPaletteComponent, TerminalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly theme = inject(ThemeService);
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly palette = viewChild(CommandPaletteComponent);

  readonly profile = PROFILE;
  readonly sections = NAV_SECTIONS;
  readonly activeSection = signal<string>('hero');
  readonly terminalOpen = signal(false);
  readonly menuOpen = signal(false);
  readonly isHome = signal(true);

  ngOnInit(): void {
    this.theme.init();
    this.analytics.init();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isHome.set(e.urlAfterRedirects === '/' || e.urlAfterRedirects === '');
        this.menuOpen.set(false);
      });

    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollSpy();
    }
  }

  themeLabel(): string {
    const mode = this.theme.mode();
    if (mode === 'system') {
      return 'System';
    }
    return mode === 'dark' ? 'Dark' : 'Light';
  }

  cycleTheme(): void {
    this.theme.cycle();
  }

  openPalette(): void {
    this.palette()?.show();
  }

  openTerminal(): void {
    this.terminalOpen.set(true);
  }

  closeTerminal(): void {
    this.terminalOpen.set(false);
  }

  scrollTo(id: string): void {
    this.menuOpen.set(false);
    if (!this.isHome()) {
      void this.router.navigateByUrl('/').then(() => {
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
      });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isHome()) {
      return;
    }
    this.updateActiveSection();
  }

  private setupScrollSpy(): void {
    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    const ids = ['hero', ...NAV_SECTIONS.map((s) => s.id)];
    let current = 'hero';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) {
        continue;
      }
      const top = el.getBoundingClientRect().top;
      if (top <= 120) {
        current = id;
      }
    }
    this.activeSection.set(current);
  }
}
