import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseStudy, getCaseStudy } from '../../core/content/profile';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <a routerLink="/" fragment="case-studies" class="text-sm text-[var(--accent)] hover:underline">
        ← Back to case studies
      </a>

      @if (study(); as s) {
        <article class="mt-8">
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ s.title }}</h1>
          <div class="mt-4 flex flex-wrap gap-2">
            @for (tag of s.tags; track tag) {
              <span class="text-xs font-medium text-[var(--accent)]">{{ tag }}</span>
            }
          </div>

          <section class="mt-10">
            <h2 class="text-lg font-semibold">Problem</h2>
            <p class="mt-2 leading-relaxed text-[var(--fg-muted)]">{{ s.problem }}</p>
          </section>

          <section class="mt-8">
            <h2 class="text-lg font-semibold">Architecture</h2>
            <p class="mt-2 leading-relaxed text-[var(--fg-muted)]">{{ s.architecture }}</p>
          </section>

          <section class="mt-8">
            <h2 class="text-lg font-semibold">Actions</h2>
            <ul class="mt-3 space-y-2 text-[var(--fg-muted)]">
              @for (action of s.actions; track action) {
                <li class="flex gap-2">
                  <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"></span>
                  <span>{{ action }}</span>
                </li>
              }
            </ul>
          </section>

          <section class="mt-8">
            <h2 class="text-lg font-semibold">Results</h2>
            <ul class="mt-3 space-y-2 text-[var(--fg-muted)]">
              @for (result of s.results; track result) {
                <li class="flex gap-2">
                  <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"></span>
                  <span>{{ result }}</span>
                </li>
              }
            </ul>
          </section>
        </article>
      } @else {
        <div class="mt-12">
          <h1 class="text-2xl font-semibold">Case study not found</h1>
          <p class="mt-2 text-[var(--fg-muted)]">That slug does not match a published study.</p>
          <a routerLink="/" class="mt-6 inline-block text-[var(--accent)] hover:underline">Return home</a>
        </div>
      }
    </div>
  `,
})
export class CaseStudyComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly study = signal<CaseStudy | undefined>(undefined);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = getCaseStudy(slug);
    this.study.set(found);
    if (found) {
      this.seo.setPage({
        title: found.title,
        description: found.problem,
        path: `/case-studies/${found.slug}`,
        jsonLd: null,
      });
    } else {
      this.seo.setPage({
        title: 'Not found',
        path: `/case-studies/${slug}`,
        jsonLd: null,
      });
    }
  }
}
