import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { PROFILE, SITE_URL } from '../content/profile';

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
      'Senior Software Engineer in Riyadh. .NET and microservices at ZATCA since October 2021, with REST, MSSQL, Angular, React, Azure DevOps, and production delivery.';
    const path = opts.path ?? '/';
    const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.setCanonical(url);

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
      description: PROFILE.headline,
      email: PROFILE.email,
      telephone: PROFILE.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Riyadh',
        addressCountry: 'SA',
      },
      url: `${SITE_URL}/`,
      sameAs: [PROFILE.links.github, PROFILE.links.linkedin],
      worksFor: {
        '@type': 'Organization',
        name: 'Zakat, Tax and Customs Authority (ZATCA)',
      },
      knowsAbout: [
        'C#',
        '.NET',
        'Entity Framework',
        'Microservices',
        'REST',
        'Microsoft SQL Server',
        'Azure DevOps',
        'Redis',
        'Angular',
        'React',
        'TypeScript',
        'Docker',
        'Git',
        'Python',
        'Java',
        'Kubernetes',
        'AI agents',
        'Large language models',
        'Retrieval-augmented generation',
        'DevOps',
        'Site reliability engineering',
        'Data engineering',
        'ETL',
      ],
    });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
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
