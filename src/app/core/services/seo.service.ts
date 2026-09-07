import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { PROFILE } from '../content/profile';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  setPage(opts: {
    title?: string;
    description?: string;
    path?: string;
    jsonLd?: Record<string, unknown> | null;
  }): void {
    const pageTitle = opts.title
      ? `${opts.title} | ${PROFILE.name}`
      : `${PROFILE.name} | ${PROFILE.title}`;
    const description =
      opts.description ??
      'Senior Software Engineer in Riyadh specializing in high-availability architecture, distributed microservices, and full-stack delivery.';
    const url = `https://m1dabo.is-a.dev${opts.path ?? '/'}`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (opts.jsonLd !== undefined) {
      this.setJsonLd(opts.jsonLd);
    }
  }

  setPersonSchema(): void {
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: PROFILE.name,
      jobTitle: PROFILE.title,
      email: PROFILE.email,
      telephone: PROFILE.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Riyadh',
        addressCountry: 'SA',
      },
      url: 'https://m1dabo.is-a.dev/',
      sameAs: [PROFILE.links.github, PROFILE.links.linkedin],
    });
  }

  private setJsonLd(data: Record<string, unknown> | null): void {
    if (!isPlatformBrowser(this.platformId) && !this.document?.head) {
      return;
    }
    const id = 'ld-json-person';
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
