import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  company?: string | null;
  message: string;
  website?: string | null;
}

export interface PublicStats {
  viewsThisWeek: number;
  viewsToday: number;
  resumeDownloads: number;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  pushedAt: string | null;
  topics: string[];
}

interface PublicGitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
  topics?: string[];
  fork: boolean;
  archived?: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  message: string;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface PathCount {
  path: string;
  count: number;
}

export interface ReferrerCount {
  referrer: string;
  count: number;
}

export interface CountryCount {
  country: string;
  count: number;
}

export interface AdminAnalytics {
  totalPageViews: number;
  uniqueVisitorsApprox: number;
  contactMessages: number;
  resumeDownloads: number;
  viewsByDay: DailyCount[];
  topPaths: PathCount[];
  topReferrers: ReferrerCount[];
  topCountries: CountryCount[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  healthLive(): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/health/live`).pipe(catchError(() => of(null)));
  }

  submitContact(payload: ContactPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/contact`, payload);
  }

  getPublicStats(): Observable<PublicStats | null> {
    return this.http.get<PublicStats>(`${this.baseUrl}/api/stats/public`).pipe(
      timeout(4000),
      catchError(() => of(null)),
    );
  }

  getGitHubRepos(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.baseUrl}/api/github/repos`).pipe(
      timeout(4000),
      catchError(() => this.fetchPublicGitHubRepos()),
    );
  }

  private fetchPublicGitHubRepos(): Observable<GitHubRepo[]> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };
    if (!isPlatformBrowser(this.platformId)) {
      headers['User-Agent'] = 'm1dabo-portfolio';
    }

    return this.http
      .get<PublicGitHubRepo[]>('https://api.github.com/users/m1dabo/repos?sort=updated&per_page=6', {
        headers: new HttpHeaders(headers),
      })
      .pipe(
        timeout(8000),
        map((repos) =>
          repos
            .filter((repo) => !repo.fork && !repo.archived)
            .slice(0, 6)
            .map((repo) => ({
              name: repo.name,
              description: repo.description,
              htmlUrl: repo.html_url,
              language: repo.language,
              stars: repo.stargazers_count,
              pushedAt: repo.pushed_at,
              topics: repo.topics ?? [],
            })),
        ),
        catchError(() => of([])),
      );
  }

  resumeUrl(): string {
    return `${this.baseUrl}/api/resume`;
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, payload);
  }

  getAdminAnalytics(token: string, days = 30): Observable<AdminAnalytics> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<AdminAnalytics>(`${this.baseUrl}/api/admin/analytics`, {
      headers,
      params: { days },
    });
  }

  trackAnalyticsBeacon(body: {
    path: string;
    referrer?: string | null;
    screenSize?: string | null;
    dwellMs?: number | null;
    eventType?: string | null;
  }): boolean {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
      return false;
    }
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    return navigator.sendBeacon(`${this.baseUrl}/api/analytics/events`, blob);
  }
}
