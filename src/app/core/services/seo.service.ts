import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
  PROFILE,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_URL,
} from '../content/profile';

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
    const description = opts.description ?? SITE_DESCRIPTION;
    const path = opts.path ?? '/';
    const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: SOCIAL_IMAGE_URL });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: SOCIAL_IMAGE_ALT });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: SOCIAL_IMAGE_URL });
    this.meta.updateTag({ name: 'twitter:image:alt', content: SOCIAL_IMAGE_ALT });
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
      description:
        'Senior Software Engineer at JCCS in Riyadh. Continuous vendor-placed work for the client Zakat, Tax and Customs Authority (ZATCA) since October 2021, through PaTeXs (Oct 2021 – Nov 2024), SSIS (Dec 2024 – Nov 2025), and JCCS (Dec 2025 – Present).',
      email: PROFILE.email,
      telephone: PROFILE.phoneE164,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Riyadh',
        addressCountry: 'SA',
      },
      url: `${SITE_URL}/`,
      sameAs: [PROFILE.links.github, PROFILE.links.linkedin],
      worksFor: {
        '@type': 'Organization',
        name: 'JCCS',
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
