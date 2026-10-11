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
        This site does not send analytics beacons, set advertising cookies, or embed third-party
        marketing trackers. Pages are static.
      </p>

      <section class="mt-10 space-y-4 text-[var(--fg-muted)]">
        <h2 class="text-lg font-semibold text-[var(--fg)]">Contact</h2>
        <p>
          There is no contact form and no message is submitted to a server from this site. Reach
          Mohammed by email, phone, or LinkedIn. Questions about this note:
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
      description:
        'Privacy note for m1dabo.github.io. Contact is by email, phone, or LinkedIn. This site does not send analytics beacons.',
      path: '/privacy',
      jsonLd: null,
    });
  }
}
