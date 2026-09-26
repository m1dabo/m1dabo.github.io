# m1dabo.github.io

Angular 20 + Tailwind CSS 4 portfolio site for **Mohammed Dabo** (Senior Software Engineer).

Static prerender → **GitHub Pages** (user site). Backend lives in [`portfolio-api`](https://github.com/m1dabo/portfolio-api).

## Live URLs

| Surface | URL |
| --- | --- |
| Site | https://m1dabo.github.io |
| LinkedIn | https://www.linkedin.com/in/m1dabo |
| Email | mohammed.dabo@hotmail.com |
| GitHub | https://github.com/m1dabo |

`m1dabo.is-a.dev` is not registered. Canonical links, the sitemap, and the resume download use `https://m1dabo.github.io`. The contact form falls back to email when `https://api.m1dabo.is-a.dev` is unreachable, and public repos are read from the GitHub API in that case.

## Quick start

```powershell
npm ci
npm start
```

Open http://localhost:4200. API defaults to `http://localhost:5080` (run portfolio-api locally).

Production API URL is set in `src/environments/environment.prod.ts`.

## Build

```powershell
npm run build -- --configuration=production
```

Output: `dist/frontend/browser` (deployed by GitHub Actions Pages).

## Docs

- [Setup checklist](docs/SETUP-CHECKLIST.md)
- [is-a.dev domain](docs/is-a-dev/PR-DESCRIPTION.md)

## Related repo

- Backend API: https://github.com/m1dabo/portfolio-api
- This site repo: https://github.com/m1dabo/m1dabo.github.io
