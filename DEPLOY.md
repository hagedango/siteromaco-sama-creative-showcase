# Romaco-sama Creative Showcase - Deployment Guide

## Project

- Site: Romaco-sama Creative Showcase | Produced by Hagedango
- Source directory: `C:\Users\kome\Documents\Codex\2026-09-05\ai-lp-web-1-ai-4\site`
- Framework: Astro static site
- Node.js: 22.18.0
- Build command: `npm run build`
- Output directory: `dist`

## Local validation

```powershell
npm install
npm run validate
npm run build
```

## Recommended: Cloudflare Pages

1. Push this repository to GitHub.
2. Open Cloudflare Dashboard > Workers & Pages > Create application > Pages.
3. Choose “Import an existing Git repository”.
4. Select the GitHub repository.
5. Set:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `22.18.0`
6. Save and deploy.

Cloudflare Pages will publish a `*.pages.dev` URL and redeploy automatically when `main` is pushed.

## GitHub creation and first push

If GitHub CLI is authenticated:

```powershell
gh repo create hagedango/romaco-sama-creative-showcase --public --source . --remote origin --push
```

If creating the repository manually:

```powershell
git remote add origin https://github.com/hagedango/romaco-sama-creative-showcase.git
git push -u origin main
```

## Alternative: Netlify

The repository includes `netlify.toml`.

1. Import the GitHub repository in Netlify.
2. Netlify should read:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy.

## Alternative: direct Cloudflare upload

```powershell
npm run build
npx wrangler pages deploy dist --project-name romaco-sama-creative-showcase
```

## 2nd-Brain reference fields

- Local independent source: `C:\Users\kome\Documents\Codex\2026-09-05\ai-lp-web-1-ai-4\site`
- GitHub repository URL: `https://github.com/hagedango/romaco-sama-creative-showcase` after repository creation
- Public URL: Cloudflare Pages URL after deployment
- Romaco-sama links:
  - Lit.Link: `https://lit.link/Romaco`
  - Substack: `https://substack.com/@romaco`
  - Game: `https://booth.pm/ja/items/8668950`
  - Produced by はげだんご: `https://x.com/dango333`
