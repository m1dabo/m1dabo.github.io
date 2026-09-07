import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';
import { AdminAnalytics, ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

const TOKEN_KEY = 'portfolio_admin_jwt';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  readonly token = signal<string | null>(null);
  readonly analytics = signal<AdminAnalytics | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  private chart?: Chart;

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Admin',
      description: 'Private analytics dashboard',
      path: '/admin',
      jsonLd: null,
    });

    if (isPlatformBrowser(this.platformId)) {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (stored) {
        this.token.set(stored);
        this.loadAnalytics(stored);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.analytics()) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { username, password } = this.loginForm.getRawValue();
    this.api.login({ username, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.token.set(res.token);
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem(TOKEN_KEY, res.token);
        }
        this.loadAnalytics(res.token);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Login failed');
      },
    });
  }

  logout(): void {
    this.token.set(null);
    this.analytics.set(null);
    this.chart?.destroy();
    this.chart = undefined;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }

  private loadAnalytics(token: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAdminAnalytics(token, 30).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.analytics.set(data);
        queueMicrotask(() => this.renderChart());
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load analytics. Please sign in again.');
        this.logout();
      },
    });
  }

  private renderChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const canvas = this.chartCanvas()?.nativeElement;
    const data = this.analytics();
    if (!canvas || !data) {
      return;
    }

    this.chart?.destroy();

    const labels = data.viewsByDay.map((d) => d.date);
    const values = data.viewsByDay.map((d) => d.count);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2dd4bf';

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Page views',
            data: values,
            borderColor: accent,
            backgroundColor: 'rgba(45, 212, 191, 0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
            grid: { color: 'rgba(127,127,127,0.15)' },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(127,127,127,0.15)' },
          },
        },
      },
    });
  }
}
