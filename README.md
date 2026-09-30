# Chirantan Dutta Banik: animated React portfolio

This is the React version of https://chiran0199.github.io/performance-marketing-portfolio/ captured for this migration. All existing copy, reporting context, certificate images, campaign dashboards and evidence images are retained. The skills section has six warm black-and-gold panels, inspired by the supplied screenshot. All 32 original skill labels are retained.

## Motion edition

See [UPDATE-GUIDE.md](UPDATE-GUIDE.md) for the existing-repository upload steps.

This edition adds a GSAP motion system: a typed hero title, layered scroll parallax, staggered achievement entrances, scroll reveals, animated comparison bars, pointer-responsive cards, magnetic buttons, a sliding navigation underline and a reading-progress indicator. The career section uses a native horizontal timeline with arrows and milestone controls. Dashboards and certificate thumbnails open in a keyboard-accessible full-screen viewer. A pause button and reduced-motion support keep the page usable without animation.

The source content and original image files are unchanged. Motion styling lives in `src/styles/motion.css`; animations are coordinated in `src/hooks/usePortfolioMotion.js`.

## Project contents

- `index.html`: Vite's HTML entry point. The page content now lives in React components.
- `src/main.jsx`: mounts React and loads styles.
- `src/App.jsx`: arranges the portfolio sections.
- `src/components/`: readable JSX files for sections, including three individual campaign case studies.
- `src/data/skills.json`: edit skill names and their groups here.
- `src/hooks/usePortfolioMotion.js`: scroll reveals and pointer motion, with cleanup and reduced-motion support.
- `src/components/Background.jsx`: decorative particle canvas, paused when the page is hidden.
- `src/styles/portfolio.css`: styles from the current portfolio.
- `src/styles/skills.css`: the new tools and skills layout, including tablet and mobile rules.
- `public/assets/analytics/`: all campaign dashboards, report images and illustrative concepts.
- `public/assets/certifications/`: all 10 certificate images.
- `public/assets/brand/logo.png`: original logo.
- `.github/workflows/deploy.yml`: builds and publishes the React app to GitHub Pages.
- `reference/`: source snapshot and image checksums for the migration audit.
- `scripts/`: build, content-preservation and interaction verification.

Existing externally hosted project/blog photographs and Google Fonts retain their original URLs. Local campaign and certificate images are bundled and have not been recompressed or altered.

## Preview on your computer

Install Node.js 24 LTS, open a terminal inside the extracted project folder, then run:

```sh
npm ci
npm run dev
```

Open the local URL displayed in the terminal. Opening `index.html` by double-clicking does not start a React development server.

To check the production version:

```sh
npm run build
npm run preview
```

Run `npm run verify` to repeat the migration checks. The baseline is the captured original site; intentional future copy changes will require updating that baseline. This check is not needed for ordinary deployment.

## Publish the source project to your current GitHub repository

1. Back up the repository first with Code > Download ZIP.
2. Extract `chirantan-portfolio-motion-source.zip` and open its project folder.
3. In the `performance-marketing-portfolio` repository, upload the project contents at the repository root. Preserve the `src`, `public`, and `.github` folders and upload `package.json`, `package-lock.json`, `vite.config.js`, and `index.html` alongside them. Do not upload `node_modules`.
4. Confirm that `.github/workflows/deploy.yml` appears in GitHub. If your file picker skips the dot-prefixed folder, use Add file > Create new file, enter `.github/workflows/deploy.yml`, and paste the supplied workflow contents.
5. In Settings > Pages, change Source to **GitHub Actions**. This replaces the earlier "Deploy from a branch" setting for this source-project route.
6. Commit to `main`. Open Actions and wait for **Deploy React portfolio** to finish. You can also run it manually with Run workflow after enabling Pages.
7. Open the existing portfolio URL. Refresh with Ctrl+Shift+R.

The configured base path is `/performance-marketing-portfolio/`. Change `base` in `vite.config.js` if you rename the repository. Vite's current official Pages guide is https://vite.dev/guide/static-deploy#github-pages.

The project is prepared locally; this package does not mean the live repository has been updated.

## Monthly updates

| What to update | File |
| --- | --- |
| Krutanic campaign | `src/components/KrutanicCase.jsx` |
| Escape Plan campaign | `src/components/EscapePlanCase.jsx` |
| IPL plan | `src/components/IplCase.jsx` |
| Homepage metrics | `src/components/Hero.jsx` |
| Comparison charts | `src/components/CampaignCharts.jsx` |
| Work experience or achievements | `src/components/Experience.jsx` |
| Certificates | `src/components/Certifications.jsx` |
| Tools and skills | `src/data/skills.json` |
| Academic projects and blog cards | `src/components/Projects.jsx` |

Keep the reporting dates, source notes, case-study values, homepage badges and comparison charts consistent when updating results. Bar widths are explicit CSS percentages in the chart component. Add new image files to the matching folder under `public/assets` and reference them with `asset('assets/analytics/your-file.png')`. Preserve the original filenames and letter case when referencing existing files.

The example directory tree in the request includes WebGL scenes from a different site. This project uses React components and CSS for the requested layout; it does not contain unused shader or scene modules.

## Verification performed

The production build passes. The migration check compares all text against the captured source, matches all 44 image elements, checks the hashes of 31 local image files, and exercises the project/blog tabs with mouse and keyboard events. The layout includes desktop, tablet and mobile breakpoints. The motion edition was additionally checked in headless Chromium at desktop, tablet and phone widths. Image viewing, keyboard dismissal, timeline movement, motion pause and reduced-motion behavior were exercised. External fonts and photographs retain their original host dependencies.
