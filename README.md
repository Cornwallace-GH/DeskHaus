# DeskHaus

Premium home office gear e-commerce storefront built with Vite + React.

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Stack

- **Frontend:** React 19 + Vite
- **Styling:** Inline styles + global CSS (Shopify-compatible)
- **Fonts:** DM Serif Display + Inter (Google Fonts)

## Structure

```
src/
  App.jsx          # Main app + page layout
  data.js          # Products, bundles, categories
  styles.js        # Global CSS string
  context.jsx      # Cart + Toast context providers
  utils.jsx        # Stars, avg helpers
  components/
    ProductCard.jsx
    ProductModal.jsx
    CartDrawer.jsx
    CheckoutDrawer.jsx
    ReviewForm.jsx
```

## Shopify Migration

When moving to Shopify:
1. Replace `PRODUCTS` array in `data.js` with Shopify Storefront API calls
2. Replace `CheckoutDrawer` with redirect to Shopify's native checkout
3. Deploy as a headless Shopify storefront or convert to a custom theme using Liquid
