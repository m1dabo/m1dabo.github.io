# is-a.dev pull request template

Use this text when opening a PR against [is-a-dev/register](https://github.com/is-a-dev/register).

## Requirements

- [x] I agree to the [Terms of Service](https://is-a.dev/terms).
- [x] My file follows the [domain structure](https://docs.is-a.dev/domain-structure/).
- [x] My website is reachable and completed.
- [x] My website is software development related.
- [x] My website is not for commercial use.
- [x] I have provided contact information in the `owner` key.
- [x] I have provided a preview of my website below.

## Website Preview

Live site: https://m1dabo.github.io

This is my personal Senior Software Engineer portfolio (Angular 20 + .NET 10).

## Files to add

1. `domains/m1dabo.json` — contents from `docs/is-a-dev/m1dabo.json` in the frontend repo
2. After Azure Container Apps is live, also add `domains/api.m1dabo.json` (same folder) with the real ACA FQDN

## After merge

1. Add `public/CNAME` containing `m1dabo.is-a.dev` only after this domain resolves. It is intentionally absent while the name is unregistered, so Pages stays on https://m1dabo.github.io.
2. In GitHub Pages settings, enable **Enforce HTTPS**
3. For the API subdomain, add the custom domain + managed certificate in Azure Container Apps
