# Shopify Migration Reference

This folder contains the full React component set built for the eventual Shopify storefront.
All components are Shopify-ready — swap the data source and checkout, keep everything else.

## Files

| File | Purpose |
|---|---|
| `products-data.js` | JS product array — replace with Shopify Storefront API |
| `context.jsx` | Cart + Toast React context providers |
| `App.jsx` | Full page layout (nav, hero, shop, bundles, footer) |
| `CartDrawer.jsx` | Cart slide-out with free shipping progress |
| `CheckoutDrawer.jsx` | 3-step checkout (contact → shipping → payment) |
| `ProductModal.jsx` | Product detail modal with reviews |

## Migration Steps

### 1. Data Layer
Replace the static `PRODUCTS` array with a Shopify Storefront API call:

```js
// Replace products-data.js import with:
const { data } = await fetch('https://your-store.myshopify.com/api/2024-01/graphql.json', {
  method: 'POST',
  headers: {
    'X-Shopify-Storefront-Access-Token': 'YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: `{ products(first: 20) { edges { node { id title variants(first:5) { edges { node { price id } } } } } } }` })
}).then(r => r.json());
```

### 2. Cart
Replace the local cart state with Shopify Cart API:
- `POST /api/2024-01/graphql.json` with `cartCreate` mutation
- Use `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove` mutations

### 3. Checkout
Replace `CheckoutDrawer.jsx` with a redirect:
```js
// After cart is built:
window.location.href = cart.checkoutUrl; // From Shopify cartCreate response
```

### 4. Theme Setup
- Use Shopify CLI: `shopify theme init`
- Port `_layouts/default.html` → `layout/theme.liquid`
- Port `assets/css/main.css` → `assets/main.css`
- Port `assets/js/store.js` → `assets/store.js`
- Or go headless with Next.js + `@shopify/hydrogen`

## Naming Conventions (Jekyll → Shopify Liquid)

| Jekyll/JS | Shopify Liquid |
|---|---|
| `p.price` | `product.price | money` |
| `p.compare_at` | `product.compare_at_price | money` |
| `p.img` | `product.featured_image | img_url: '800x'` |
| `p.variants` | `product.variants` |
| `p.inventory` | `variant.inventory_quantity` |
| `p.sku` | `variant.sku` |
