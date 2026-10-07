# Implemented design

## Overview

This publication test is one plain, left-aligned page. Its entire visible content is the lowercase heading `second project`, followed by an optional file list. There is no navigation chrome or empty-state copy. `src/page.ts` is the source of truth; `dist/index.html` is its generated, self-contained export.

## Colors

The inline `:root` block in `src/page.ts:21` defines a single light palette:

| Token | Value | Role |
| --- | --- | --- |
| `--color-background` | `#fff` | Page background |
| `--color-text` | `#171717` | Heading and list text |
| `--color-link` | `#0645ad` | Unvisited file links |
| `--color-visited` | `#551a8b` | Visited file links |

Links retain underlines and the browser's native focus indicator. There are no status colors, dark theme or custom focus token. Measured computed text/background contrast was 17.93:1; unvisited links on white measured 8.53:1. The declared visited token computes to 11.01:1 against white; this is a token calculation, not a measurement of browser-protected visited styling.

## Typography

The stack is `system-ui, sans-serif`, with no font downloads. Body text uses `100%` of the browser's root size, weight 400 and unitless line-height 1.5 (16px/24px in the inspected browser). The only heading uses `1.5rem`, weight 600 and line-height 1.3 (24px/31.2px at default size). Letter spacing stays at the platform default. Exact font faces depend on the operating system.

File paths remain selectable and are not truncated. `overflow-wrap: anywhere` permits long filenames to wrap, and `<bdi>` isolates mixed-direction names. Link underline offset is `0.15em`.

## Layout

`--space-page: 1.5rem` controls body padding, the list's top margin and list indentation. `--space-small: 0.5rem` separates consecutive file rows. The body has no default margin; the main region has `max-inline-size: 65ch`. All sizing uses border-box.

The page uses ordinary document flow with no breakpoints or fixed text heights. The heading precedes the optional list. File links are inline blocks with a minimum 44×44px target, `0.625rem` vertical padding and a maximum width of 100%. Layout adapts naturally at narrow widths and allows vertical growth. Logical properties govern list indentation, margins and content width.

The final export was inspected at a 1280×720 top-level viewport and in 320px/768px/1280px iframe viewports. Neither the actual page nor a long-filename fixture overflowed horizontally at 320px, including 200% root text enlargement. Native browser zoom and physical devices were not verified.

## Elevation and shapes

The interface is flat: no cards, shadows, radius tokens, overlays, decorative borders or clipping. Native list bullets distinguish entries; native browser focus outlines identify keyboard targets.

## Components

`renderPage(files: readonly string[])` in `src/page.ts:7` emits the complete document. It accepts paths relative to `line-1/`, supplied in sorted order by `scripts/build.mjs`.

- Page: English language, viewport metadata, a descriptive title, one `main` and one `h1`.
- File list: rendered only when files exist, using native `ul`/`li` elements.
- File link: escaped filename as its accessible name and an encoded relative URL. Native Tab/Enter navigation, pointer activation, context menus and visited behavior remain available.

There are no forms, custom controls, loading states, animations or runtime errors to design. A missing directory produces just the heading. An actual filesystem build error fails the build instead of publishing a misleading list.

## Reuse rules

Keep the exact requested heading and restrict visible additions to existing filenames. Reuse `renderPage`, its role tokens and native links; preserve escaping, relative URLs and full wrapping. Rebuild instead of hand-editing `dist/index.html`. Do not add page decoration, extra copy or a second page to this bounded publication test.
