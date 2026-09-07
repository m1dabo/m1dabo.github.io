# Frontend setup checklist

## 1. GitHub repo

Recommended names (pick one):

- `m1dabo.github.io` — cleanest public URL (`https://m1dabo.github.io`)
- `portfolio-frontend` — then enable Pages on that repo (URL includes the repo name unless you use a custom domain)

```powershell
cd C:\Portfolio\frontend
git remote add origin https://github.com/m1dabo/m1dabo.github.io.git
# or: https://github.com/m1dabo/portfolio-frontend.git
git push -u origin main
```

GitHub → Settings → Pages → Source: **GitHub Actions**.

## 2. API URL

Production builds call `https://api.m1dabo.is-a.dev` from `src/environments/environment.prod.ts`.  
Until the API custom domain exists, temporarily point that file at your Azure Container Apps FQDN.

## 3. Free domain `m1dabo.is-a.dev`

1. Wait until Pages is live
2. Fork https://github.com/is-a-dev/register
3. Add `domains/m1dabo.json` from [is-a-dev/m1dabo.json](is-a-dev/m1dabo.json)
4. Open a PR using [is-a-dev/PR-DESCRIPTION.md](is-a-dev/PR-DESCRIPTION.md)
5. After merge: Pages → **Enforce HTTPS**

## 4. Share

- LinkedIn Website → `https://m1dabo.is-a.dev` (or github.io meanwhile)
- GitHub profile README → same URL

Backend setup: see the `portfolio-api` repo `docs/SETUP-CHECKLIST.md`.
