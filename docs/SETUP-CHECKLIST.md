# Frontend setup checklist

Repo: https://github.com/m1dabo/m1dabo.github.io

## 1. GitHub Pages

Pages source should be **GitHub Actions** (configured automatically on first workflow run).

Site URL: https://m1dabo.github.io

## 2. API URL

Production builds call `https://api.m1dabo.is-a.dev` from `src/environments/environment.prod.ts`.  
That host is not live. The site already falls back: the contact form opens email, stats stay hidden, and repositories load from the public GitHub API. Do not point canonical or resume links at the API domain.

## 3. Free domain `m1dabo.is-a.dev`

Not registered. Do not add a `CNAME` file until the domain resolves to GitHub Pages. Canonical URL is https://m1dabo.github.io.

When you are ready to register it:

1. Fork https://github.com/is-a-dev/register
2. Add `domains/m1dabo.json` from [is-a-dev/m1dabo.json](is-a-dev/m1dabo.json)
3. Open a PR using [is-a-dev/PR-DESCRIPTION.md](is-a-dev/PR-DESCRIPTION.md)
4. After merge and DNS: add `public/CNAME` with `m1dabo.is-a.dev`, then Pages → **Enforce HTTPS**

## 4. Share

- LinkedIn Website → `https://m1dabo.github.io`
- GitHub profile README → `https://m1dabo.github.io`

Backend setup: https://github.com/m1dabo/portfolio-api/blob/main/docs/SETUP-CHECKLIST.md
