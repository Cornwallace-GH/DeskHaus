# DeskHaus — Jekyll POC

Premium home office gear storefront. Built with Jekyll for GitHub Pages as a proof of concept.
Structured for straightforward migration to Shopify (see `_shopify_reference/SHOPIFY_MIGRATION.md`).

## Local Development

```bash
bundle install
bundle exec jekyll serve
# → http://localhost:4000/DeskHaus/
```

## Structure

```
_data/
  products.yml          # Single source of truth for all product data
_layouts/
  default.html          # Main HTML shell (nav, drawers, footer)
_shopify_reference/
  SHOPIFY_MIGRATION.md  # Full migration guide to Shopify theme
  *.jsx                 # React source files preserved for reference
assets/
  css/main.css          # All styles
  js/store.js           # Cart, checkout, modal, search, filter logic
index.html              # Page content (Liquid + HTML)
```

## Stack

- **Jekyll 4.3** — static site generator, runs natively on GitHub Pages
- **Liquid** — Shopify's own templating language (maps 1:1 on migration)
- **Vanilla JS** — zero dependencies, full cart/checkout/modal/review functionality
- **DM Serif Display + Inter** — Google Fonts

## Live Site

`https://cornwallace-gh.github.io/DeskHaus/`

## Shopify Migration

See `_shopify_reference/SHOPIFY_MIGRATION.md` for the complete migration guide,
including file mapping, Liquid syntax differences, Storefront API integration,
AJAX cart replacement, and metafield setup.

Estimated migration time: ~1 day.
