import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
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
  readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  healthLive(): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/health/live`).pipe(catchError(() => of(null)));
  }

  submitContact(payload: ContactPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/contact`, payload);
  }

  getPublicStats(): Observable<PublicStats | null> {
    return this.http
      .get<PublicStats>(`${this.baseUrl}/api/stats/public`)
      .pipe(catchError(() => of(null)));
  }

  getGitHubRepos(): Observable<GitHubRepo[]> {
    return this.http
      .get<GitHubRepo[]>(`${this.baseUrl}/api/github/repos`)
      .pipe(catchError(() => of([])));
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
