import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs';
import { PROFILE } from '../../core/content/profile';
import { ApiService, GitHubRepo } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly fb = inject(FormBuilder);

  readonly profile = PROFILE;
  readonly viewsToday = signal<number | null>(null);
  readonly repos = signal<GitHubRepo[]>([]);
  readonly submitting = signal(false);
  readonly submitMessage = signal<string | null>(null);
  readonly submitError = signal<string | null>(null);
  private healthWarmed = false;

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
    website: [''],
  });

  ngOnInit(): void {
    this.seo.setPage({ path: '/' });
    this.seo.setPersonSchema();

    this.api.getPublicStats().subscribe((stats) => {
      if (stats) {
        this.viewsToday.set(stats.viewsToday);
      }
    });

    this.api.getGitHubRepos().subscribe((repos) => {
      if (repos.length) {
        this.repos.set(repos.slice(0, 6));
      } else {
        this.repos.set(
          PROFILE.openSourceFallback.map((r) => ({
            name: r.name,
            description: r.description,
            htmlUrl: r.htmlUrl,
            language: r.language,
            stars: r.stars,
            pushedAt: null,
            topics: r.topics,
          })),
        );
      }
    });
  }

  resumeHref(): string {
    return '/Mohammed-Dabo-Resume.pdf';
  }

  warmApi(): void {
    if (this.healthWarmed) {
      return;
    }
    this.healthWarmed = true;
    this.api.healthLive().subscribe();
  }

  onSubmit(): void {
    this.submitMessage.set(null);
    this.submitError.set(null);

    if (this.contactForm.controls.website.value) {
      this.submitMessage.set('Thanks — your message was received.');
      this.contactForm.reset();
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const value = this.contactForm.getRawValue();
    this.submitting.set(true);

    this.api
      .submitContact({
        name: value.name,
        email: value.email,
        company: value.company || null,
        message: value.message,
        website: value.website || null,
      })
      .pipe(timeout(8000))
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.submitMessage.set(res.message || 'Thanks — I will get back to you soon.');
          this.contactForm.reset();
        },
        error: () => {
          this.submitting.set(false);
          const subject = encodeURIComponent(`Portfolio contact from ${value.name}`);
          const body = encodeURIComponent(
            `${value.message}\n\n— ${value.name}${value.company ? ` (${value.company})` : ''}\n${value.email}`,
          );
          window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
          this.submitMessage.set(
            `Opened your email app with this message. You can also write directly to ${PROFILE.email}.`,
          );
        },
      });
  }
}
