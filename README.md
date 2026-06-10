# DeskHaus

Premium home office gear e-commerce storefront.

**Live site:** https://cornwallace-gh.github.io/DeskHaus/

## Stack

- **Jekyll** — static site generator (GitHub Pages native)
- **Vanilla JS** — cart, checkout, product modal, reviews
- **`_data/products.yml`** — single source of truth for all product data

## Local Development

```bash
gem install jekyll bundler
bundle install
bundle exec jekyll serve
# → http://localhost:4000/DeskHaus/
```

## Structure

```
_data/
  products.yml          ← All product data (name, price, specs, reviews, etc.)
_layouts/
  default.html          ← HTML shell: nav, cart drawer, checkout, modals
_shopify_reference/     ← React components preserved for Shopify migration
  App.jsx
  CartDrawer.jsx
  CheckoutDrawer.jsx
  ProductModal.jsx
  context.jsx
  products-data.js      ← JS equivalent of products.yml
assets/
  css/main.css          ← All styles
  js/store.js           ← Cart, checkout, filters, product modal, reviews
index.html              ← Main page (Jekyll + Liquid templates)
_config.yml             ← Jekyll config
```

## Adding / Editing Products

Edit `_data/products.yml` — the page and JS both pull from it automatically.

## Shopify Migration Path

See `_shopify_reference/` for the full React component set built for Shopify:

1. Replace `window.PRODUCTS_DATA` in `store.js` with a Shopify Storefront API fetch
2. Replace the checkout drawer with a redirect to Shopify's native checkout
3. Port `_layouts/default.html` to a Shopify Liquid theme layout
4. Use the React components in `_shopify_reference/` as the headless frontend
