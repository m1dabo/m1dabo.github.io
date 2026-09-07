import { RenderMode, ServerRoute } from '@angular/ssr';
import { CASE_STUDY_SLUGS } from './core/content/profile';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'privacy',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'case-studies/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CASE_STUDY_SLUGS.map((slug) => ({ slug })),
  },
  {
    path: 'admin',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
