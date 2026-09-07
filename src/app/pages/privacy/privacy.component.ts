import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <a routerLink="/" class="text-sm text-[var(--accent)] hover:underline">← Home</a>
      <h1 class="mt-8 text-3xl font-bold tracking-tight">Privacy</h1>
      <p class="mt-4 leading-relaxed text-[var(--fg-muted)]">
        This site uses lightweight, cookie-less analytics. No advertising cookies are set, and no
        third-party trackers are embedded for marketing purposes.
      </p>

      <section class="mt-10 space-y-4 text-[var(--fg-muted)]">
        <h2 class="text-lg font-semibold text-[var(--fg)]">What is collected</h2>
        <p>
          Page path, approximate referrer, screen size, optional dwell time, and a coarse country
          hint supplied by the edge network when available. Visitor identifiers are derived from a
          daily-rotating hash of IP metadata — not stored as raw IP addresses in the analytics
          stream.
        </p>

        <h2 class="text-lg font-semibold text-[var(--fg)]">Do Not Track</h2>
        <p>
          If your browser sends a Do Not Track (DNT) or Global Privacy Control signal, pageview
          beacons are not sent from this frontend.
        </p>

        <h2 class="text-lg font-semibold text-[var(--fg)]">Contact form</h2>
        <p>
          Messages you submit (name, email, optional company, and message body) are processed to
          respond to your inquiry. A honeypot field is used to reduce spam.
        </p>

        <h2 class="text-lg font-semibold text-[var(--fg)]">Contact</h2>
        <p>
          Questions about this policy:
          <a class="text-[var(--accent)] hover:underline" href="mailto:mohammed.dabo@hotmail.com"
            >mohammed.dabo&#64;hotmail.com</a
          >.
        </p>
      </section>
    </div>
  `,
})
export class PrivacyComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Privacy',
      description: 'Cookie-less hashed analytics and contact form privacy notes for m1dabo.is-a.dev.',
      path: '/privacy',
      jsonLd: null,
    });
  }
}
