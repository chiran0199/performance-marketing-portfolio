# Install the animated portfolio update

This update is for `chiran0199/performance-marketing-portfolio`.
The website address stays https://chiran0199.github.io/performance-marketing-portfolio/.

## Which ZIP to use

Use **chirantan-portfolio-motion-update.zip** to update your existing React repository. It contains the source code, dependency files, deployment workflow and verification files. It does not include the unchanged images. Keep your current `public/assets` folder.

**chirantan-portfolio-motion-source.zip** is a complete backup, including all original local images. Use this if `public/assets` is missing from your repository or if you want to run the whole project on your computer.

These are React source packages. GitHub Actions builds the website from them.

## Upload to your existing GitHub repository

1. Open https://github.com/chiran0199/performance-marketing-portfolio.
2. Choose **Code > Download ZIP** to keep a backup of the current repository.
3. Download and extract **chirantan-portfolio-motion-update.zip** on your computer.
4. Open the extracted folder. You should see `src`, `scripts`, `reference`, `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, README and this guide.
5. On GitHub, stay on the repository's main file page. Select **Add file > Upload files**.
6. Drag the extracted folder's CONTENTS into the upload area. Do not drag the ZIP or its outer folder. The `src` folder must sit beside `package.json` at the top of the repository.
7. Keep the existing `public/assets` folder. The update references the same image paths and does not need replacement images.
8. Enter the commit message `Add animated portfolio experience`, then select **Commit changes**.
9. Confirm `.github/workflows/deploy.yml` exists in the repository. Dot-prefixed folders can be skipped by file pickers. If it is missing, select **Add file > Create new file**, name it `.github/workflows/deploy.yml`, paste the supplied file's contents and commit. The workflow is included in both ZIPs; enable hidden-file display in your extracted folder to see it.
10. Open **Settings > Pages** and set **Source** to **GitHub Actions**.
11. Open **Actions** and select **Deploy React portfolio**. Wait for a green check. If no run starts, choose **Run workflow > main > Run workflow**.
12. Visit the website and refresh with **Ctrl + Shift + R**.

Do not upload `node_modules`. Do not replace the source `index.html` with the older compiled package's `index.html`.

## What to try

- Reload at the top to see the title typing and staggered achievement cards.
- Scroll through the hero to see the grid and orbital layers move at different speeds.
- Hover over desktop buttons, achievement cards, projects and gold skills panels.
- Watch the active navigation underline move between sections.
- Scroll to campaign snapshots to see the original comparison bars animate.
- Use the career timeline's arrows, milestone dots or horizontal scrolling. On a phone, swipe the cards.
- Select a dashboard or certificate thumbnail for the full-screen viewer. Use its arrows or your keyboard's left/right arrows. Escape closes the viewer and restores focus.
- Use the bottom-right pause button to stop motion. Your device's reduced-motion setting is also respected.

## Monthly content updates

Continue editing the existing React components. No content schema changed.

| Content | File |
| --- | --- |
| Hero metrics | `src/components/Hero.jsx` |
| Krutanic campaign | `src/components/KrutanicCase.jsx` |
| Escape Plan campaign | `src/components/EscapePlanCase.jsx` |
| IPL plan | `src/components/IplCase.jsx` |
| Comparison charts | `src/components/CampaignCharts.jsx` |
| Career achievements | `src/components/Experience.jsx` |
| Certificates | `src/components/Certifications.jsx` |
| Skills | `src/data/skills.json` |
| New motion styling | `src/styles/motion.css` |

Keep the reporting periods, sources, metric badges and charts consistent when you update campaign results.

## Run locally

Install Node.js 24, open a terminal in the extracted complete project and run:

```sh
npm ci
npm run dev
```

Open the local address printed in your terminal. Double-clicking `index.html` does not run a React app.

```sh
npm run verify
```

This command builds the site, compares text and image references against the captured original, verifies local image hashes and tests key interactions. Update the content baseline deliberately when you make future copy changes.

## Preservation and checks

- Exact text comparison against the captured original portfolio passes.
- All 44 image references are retained.
- All 31 local image files match their original SHA-256 hashes.
- All 32 skill labels and 10 certificate cards are retained.
- The production build and keyboard/mouse interaction checks pass.
- Browser layout checks cover 1440px, 768px, 390px and 320px widths.
- Gallery navigation, Escape dismissal, focus return, timeline controls, pause and reduced-motion behavior are checked.

Original externally hosted photographs and fonts retain their original URLs and still depend on those hosts being available.

The prepared files do not change the live website until you upload and deploy them.
