# AI Smart Wellbeing School

A static React + TypeScript + Vite exhibition website. It has no backend, database, or authentication; the project content is bundled with the app and optional build notes stay in page memory only.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

## Publish with GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` tests and builds the site on pushes to `main`, then publishes it to GitHub Pages. In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions**. The workflow supports the repository's project-site URL and direct links to app routes.

## Verify

```powershell
npm.cmd test
npm.cmd run build
```

The five routes are `/`, `/buildings`, `/3d-model`, `/wellbeing`, and `/build-guide`. The 3D model has detailed facades, framed windows, rooftop equipment, and a large side-mounted LCD; orbit and zoom with mouse/touch or accessible camera buttons, select zones, update the LCD prompts, simulate sensors and lights, move the servo, spin the windmill, and test the buzzer. It does not connect to a physical Arduino and is not a fabrication-ready CAD drawing. In development, the corner state switcher previews data, loading, empty, and error states; `?previewState=loading`, `empty`, or `error` also selects a state. Theme preference, preview controls, and the optional build note are kept only in page memory; the app does not persist user data. The site footer credits Ayaan Dongre.
