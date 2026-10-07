# second project

A self-contained static page containing **second project** and, when present, links to regular files already under `dist/line-1/`. The supplied repository had no `dist/line-1/`, so the delivered page contains only the heading. No runtime JavaScript, external fonts, network services or framework are needed.

## Install, rebuild and preview

Use Node.js 24 or newer, npm, and Python 3 for the optional preview server.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/` and stop the preview with Ctrl+C. You can also open `dist/index.html` directly without installing anything.

`src/page.ts` contains the HTML template, inline styles and filename escaping. `scripts/build.mjs` generates `dist/index.html`, discovers regular files recursively inside `dist/line-1/`, and sorts their relative paths. It never clears `dist/` or rewrites the listed files. Symlinks are not followed. Add files under `dist/line-1/` and rebuild to update the list. Filenames become text labels and URL-encoded relative links, without reading or executing their contents.

TypeScript checks the typed page renderer. The Node build script is JavaScript and is exercised by the integration test. Build and tests need only Node; the locked TypeScript development dependency is needed for typechecking.

## Publish

Publish the **contents of `dist/`** using the static host's existing upload or repository publication flow. Preserve any `line-1/` directory beside `index.html`. The page works at a root or gateway subpath because all file links are relative. The publisher must include this finished export alongside the source, manifest and lockfile; it does not need to rebuild. No deployment endpoint was supplied, and no live deployment was performed.

For this assignment no Git command was run, because writing `.git/` is expressly prohibited. The completed files are ready for the submission system to commit. Keep dependency/cache directories out of the submission. The explicit path budget for `.gitignore` is **256 bytes** (implemented: 108 bytes); its recursive rules exclude dependencies, caches, coverage and compiler output, and exclude `test/scratch/`. `dist/` remains included.

## Actual validation

On 2026-10-07, with Node 24.21.0 and TypeScript 5.9.3:

- `npm install --package-lock-only --ignore-scripts --cache /tmp/second-project-npm-cache`: passed; lockfile generated, npm reported zero vulnerabilities.
- `npm run typecheck`: passed using the locked compiler extracted under `/tmp` and added to `PATH`. This avoided creating or touching `node_modules/` in this worker session. The normal `npm ci` workflow above was not run here.
- `npm run build`: passed after the final source change; zero existing files listed, all page styling embedded.
- `npm test`: both tests passed. Checked missing directory, nested files, escaped labels, special-character URLs, preservation and deterministic rebuilds.
- Browser: final export loaded at `/dist/index.html` with HTTP 200, zero console errors and no additional asset requests. Inspected desktop and narrow screenshots, reflow at 320/768/1280 CSS pixels, 200% text enlargement, and keyboard/mouse navigation with a separate scratch fixture.

The browser tool has no viewport-resize method. Narrow and intermediate checks used actual exported documents inside same-origin iframes of the stated widths. These are CSS viewport checks, not physical-device tests. Browser-native zoom, screen readers, an automated accessibility scanner and other browser engines were not tested. See [validation](artifacts/validation.md) for all six Better Interface domains, findings and evidence; [DESIGN.md](DESIGN.md) records the implemented design.
