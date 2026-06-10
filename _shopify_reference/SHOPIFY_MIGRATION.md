# Shopify Migration Reference

This Jekyll POC is structured to map directly to a Shopify theme.
Keep this file when migrating — it's your field guide.

---

## File Mapping: Jekyll → Shopify

| Jekyll | Shopify | Notes |
|---|---|---|
| `_layouts/default.html` | `layout/theme.liquid` | Identical structure, swap `{{ content }}` for `{{ content_for_layout }}` |
| `index.html` | `templates/index.liquid` | Move sections to `sections/` for Online Store 2.0 |
| `_data/products.yml` | Shopify Admin / Storefront API | Replace `site.data.products` loops with `collection.products` |
| `_includes/` | `snippets/` | Each include becomes a `.liquid` snippet |
| `assets/js/store.js` | `assets/store.js` | Same file — update data source (see below) |
| `assets/css/main.css` | `assets/main.css` | Direct copy |

---

## Liquid Syntax: What Stays the Same

Jekyll and Shopify both use Liquid. These patterns copy over unchanged:

```liquid
{% for product in collection.products %}   {# was: site.data.products #}
  {{ product.title }}                       {# was: p.name #}
  {{ product.price | money }}               {# was: p.price #}
  {{ product.featured_image | img_url }}    {# was: p.img #}
{% endfor %}

{% if product.compare_at_price > product.price %}
  <span>Sale</span>
{% endif %}
```

---

## JavaScript: Replacing Static Data with Storefront API

In `store.js`, replace the static `window.PRODUCTS_DATA` injection with a
Storefront API fetch. Add to your theme's `layout/theme.liquid` `<head>`:

```html
<script>
// Shopify Storefront API — replace Jekyll's _data/products.yml injection
const STOREFRONT_TOKEN = '{{ shop.metafields.custom.storefront_token }}';
const SHOP_DOMAIN = '{{ shop.permanent_domain }}';
</script>
```

Then in `store.js`, replace:
```js
const PRODUCTS = window.PRODUCTS_DATA || [];
```

With:
```js
async function loadProducts() {
  const res = await fetch(`https://${SHOP_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: `{
      products(first: 20) {
        edges { node {
          id title description
          priceRange { minVariantPrice { amount } }
          compareAtPriceRange { minVariantPrice { amount } }
          featuredImage { url }
          variants(first: 10) { edges { node { title id } } }
          metafields(identifiers: [
            {namespace:"custom", key:"margin"},
            {namespace:"custom", key:"supplier"},
            {namespace:"custom", key:"badge"}
          ]) { key value }
        }}
      }
    }` })
  });
  const data = await res.json();
  return data.data.products.edges.map(e => shopifyProductToLocal(e.node));
}

function shopifyProductToLocal(node) {
  const meta = {};
  (node.metafields || []).forEach(m => m && (meta[m.key] = m.value));
  return {
    id: node.id,
    name: node.title,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    compare_at: parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount) || null,
    img: node.featuredImage?.url,
    variants: node.variants.edges.map(e => e.node.title),
    margin: parseInt(meta.margin) || 0,
    supplier: meta.supplier || '',
    badge: meta.badge || null,
  };
}
```

---

## Cart: Jekyll → Shopify AJAX API

Replace the in-memory JS cart with Shopify's Cart AJAX API:

```js
// Add to cart
async function addToCartShopify(variantId, qty = 1) {
  await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: qty })
  });
  await renderCart();
}

// Get cart
async function getCart() {
  const res = await fetch('/cart.js');
  return res.json();
}

// Update qty
async function updateCartItem(key, qty) {
  await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: qty })
  });
}

// Checkout — replace CheckoutDrawer entirely
function goToCheckout() {
  window.location.href = '/checkout';
}
```

---

## Metafields to Create in Shopify Admin

Go to **Settings → Custom Data → Products** and add:

| Namespace | Key | Type | Used For |
|---|---|---|---|
| `custom` | `margin` | Integer | Margin % display |
| `custom` | `supplier` | Single line text | Sourcing table |
| `custom` | `supplier_sku` | Single line text | Sourcing table |
| `custom` | `badge` | Single line text | Product card badge |
| `custom` | `cost` | Decimal | Sourcing table |

---

## Checkout

The Jekyll checkout drawer is a POC simulation.
On Shopify, replace `openCheckout()` with:
```js
function openCheckout() { window.location.href = '/checkout'; }
```
Shopify handles the full checkout natively, including payment, shipping, and taxes.

---

## Theme Settings (shopify.json)

Create `config/settings_schema.json` to expose brand controls in the theme editor:

```json
[{
  "name": "DeskHaus Brand",
  "settings": [
    { "type": "color", "id": "color_bg", "label": "Background", "default": "#F8F7F4" },
    { "type": "color", "id": "color_text", "label": "Text", "default": "#1C1C1C" },
    { "type": "color", "id": "color_accent", "label": "Accent (gold)", "default": "#C8963E" },
    { "type": "font_picker", "id": "font_display", "label": "Display font", "default": "dm_serif_display_n4" },
    { "type": "font_picker", "id": "font_body", "label": "Body font", "default": "inter_n4" }
  ]
}]
```

---

## Estimated Migration Time

| Task | Time |
|---|---|
| Copy layout + CSS to Shopify theme | 30 min |
| Replace product loops with Storefront API | 2–3 hrs |
| Replace cart JS with AJAX API | 1–2 hrs |
| Replace checkout drawer with Shopify native | 30 min |
| QA + polish | 2–3 hrs |
| **Total** | **~1 day** |
