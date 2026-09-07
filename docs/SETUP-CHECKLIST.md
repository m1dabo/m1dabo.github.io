# Frontend setup checklist

Repo: https://github.com/m1dabo/m1dabo.github.io

## 1. GitHub Pages

Pages source should be **GitHub Actions** (configured automatically on first workflow run).

Site URL: https://m1dabo.github.io

## 2. API URL

Production builds call `https://api.m1dabo.is-a.dev` from `src/environments/environment.prod.ts`.  
Until the API custom domain exists, temporarily point that file at your Azure Container Apps FQDN and push.

## 3. Free domain `m1dabo.is-a.dev`

1. Wait until Pages is live
2. Fork https://github.com/is-a-dev/register
3. Add `domains/m1dabo.json` from [is-a-dev/m1dabo.json](is-a-dev/m1dabo.json)
4. Open a PR using [is-a-dev/PR-DESCRIPTION.md](is-a-dev/PR-DESCRIPTION.md)
5. After merge: Pages → **Enforce HTTPS**

## 4. Share

- LinkedIn Website → `https://m1dabo.is-a.dev` (or github.io meanwhile)
- GitHub profile README → same URL

Backend setup: https://github.com/m1dabo/portfolio-api/blob/main/docs/SETUP-CHECKLIST.md
