// ── PRODUCT DATA ─────────────────────────────────────────────────────────────
// NOTE: This mirrors _data/products.yml — single source of truth is the YML.
// When migrating to Shopify, replace this with Storefront API fetch.

const PRODUCTS = window.PRODUCTS_DATA || [];
const BUNDLES = [
  { id:"b1", name:"The Clean Setup", tagline:"Monitor arm + desk mat + cable clips.", productIds:[1,2,4], savings:18, img:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80" },
  { id:"b2", name:"The Laptop Station", tagline:"Vertical stand + riser + cable tray.", productIds:[3,7,6], savings:14, img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80" },
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let cart = [];
let wishlist = [];
let activeCategory = "All";
let sortBy = "featured";
let searchQuery = "";
let checkoutStep = 1;
let checkoutData = { email:"", name:"", phone:"", line1:"", city:"", state:"", zip:"", ship:"standard", cardNum:"", cardName:"", expiry:"", cvv:"" };

// ── CART ──────────────────────────────────────────────────────────────────────
function addToCart(productId, variant) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const key = `${productId}-${variant}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty++; } else { cart.push({ ...product, variant, qty: 1, key }); }
  renderCart();
  toast(`${product.name} added to cart`, "success");
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  renderCart();
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) removeFromCart(key);
  else renderCart();
}

function addBundle(bundleId) {
  const bundle = BUNDLES.find(b => b.id === bundleId);
  if (!bundle) return;
  bundle.productIds.forEach(id => {
    const p = PRODUCTS.find(p => p.id === id);
    if (p) addToCart(p.id, p.variants[0]);
  });
  toast(`${bundle.name} added to cart!`, "success");
}

function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartSavings() { return cart.reduce((s, i) => s + (i.compare_at ? (i.compare_at - i.price) * i.qty : 0), 0); }
function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

// ── WISHLIST ──────────────────────────────────────────────────────────────────
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx === -1) { wishlist.push(productId); toast("Saved to wishlist ♡", "wish"); }
  else { wishlist.splice(idx, 1); toast("Removed from wishlist"); }
  document.querySelectorAll(`[data-wish="${productId}"]`).forEach(el => {
    el.textContent = wishlist.includes(productId) ? "♥" : "♡";
  });
}

// ── RENDER CART ───────────────────────────────────────────────────────────────
function renderCart() {
  const count = cartCount();
  const total = cartTotal();
  const savings = cartSavings();
  const FREE_SHIP = 75;
  const progress = Math.min((total / FREE_SHIP) * 100, 100);
  const remaining = Math.max(FREE_SHIP - total, 0);

  // Count badge
  const countEl = document.getElementById("cart-count");
  if (countEl) { countEl.textContent = count; countEl.style.display = count > 0 ? "flex" : "none"; }

  // Ship bar
  const progressEl = document.getElementById("ship-progress");
  const labelEl = document.getElementById("ship-label");
  if (progressEl) progressEl.style.width = progress + "%";
  if (labelEl) labelEl.textContent = remaining > 0 ? `Add $${remaining.toFixed(2)} more for free shipping` : "✓ You qualify for free shipping";

  // Items
  const itemsEl = document.getElementById("cart-items");
  if (!itemsEl) return;
  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.</p></div>`;
    document.getElementById("cart-footer").style.display = "none";
    return;
  }
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant}</div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty('${item.key}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.key}',1)">+</button>
          </div>
          <div class="cart-item-price">
            <strong>$${(item.price * item.qty).toFixed(2)}</strong>
            <button class="remove-btn" onclick="removeFromCart('${item.key}')">Remove</button>
          </div>
        </div>
      </div>
    </div>`).join("");

  // Footer
  const footer = document.getElementById("cart-footer");
  footer.style.display = "block";

  const savingsRow = document.getElementById("savings-row");
  if (savings > 0) { savingsRow.style.display = "flex"; document.getElementById("savings-amt").textContent = `−$${savings.toFixed(2)}`; }
  else { savingsRow.style.display = "none"; }

  const shipCostEl = document.getElementById("ship-cost");
  shipCostEl.textContent = total >= FREE_SHIP ? "Free" : "Calculated at checkout";

  document.getElementById("cart-total-amt").textContent = `$${total.toFixed(2)}`;
}

// ── DRAWER & MODAL CONTROLS ───────────────────────────────────────────────────
function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("overlay");
  const isOpen = drawer.classList.contains("open");
  if (isOpen) { closeAll(); } else { drawer.classList.add("open"); overlay.classList.add("open"); document.getElementById("checkout-drawer").classList.remove("open"); }
}

function openCheckout() {
  document.getElementById("cart-drawer").classList.remove("open");
  const co = document.getElementById("checkout-drawer");
  co.classList.add("open");
  checkoutStep = 1;
  renderCheckout();
}

function closeAll() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("checkout-drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  renderProductModal(product);
  document.getElementById("product-modal").classList.add("open");
}

function closeModal(e) {
  if (e.target === document.getElementById("product-modal")) {
    document.getElementById("product-modal").classList.remove("open");
  }
}

function closeSuccess() {
  document.getElementById("success-modal").classList.remove("open");
  cart = [];
  renderCart();
}

// ── PRODUCT MODAL ─────────────────────────────────────────────────────────────
let modalVariant = "";
let modalQty = 1;
let modalActiveImg = 0;

function renderProductModal(product) {
  modalVariant = product.variants[0];
  modalQty = 1;
  modalActiveImg = 0;
  const avgRating = (product.reviews.reduce((s,r) => s+r.rating,0) / product.reviews.length).toFixed(1);
  const imgs = product.imgs || [product.img];

  document.getElementById("modal-box").innerHTML = `
    <div class="modal-grid">
      <div class="modal-images">
        <img class="modal-main-img" id="modal-main-img" src="${imgs[0]}" alt="${product.name}" />
        ${imgs.length > 1 ? `<div class="modal-thumbs">${imgs.map((src,i) => `<img class="modal-thumb ${i===0?"active":""}" src="${src}" onclick="setModalImg(${i},'${src}')" />`).join("")}</div>` : ""}
      </div>
      <div class="modal-info">
        <div class="modal-meta">
          <span class="tag">${product.category}</span>
          <div class="modal-actions-top">
            <button class="btn-icon" data-wish="${product.id}" onclick="toggleWishlist(${product.id})">${wishlist.includes(product.id)?"♥":"♡"}</button>
            <button class="btn-icon" onclick="document.getElementById('product-modal').classList.remove('open')">✕</button>
          </div>
        </div>
        <h2 class="modal-name serif">${product.name}</h2>
        <p class="modal-tagline">${product.tagline}</p>
        <div class="modal-rating">
          <span class="stars">${"★".repeat(Math.round(avgRating))}${"☆".repeat(5-Math.round(avgRating))}</span>
          <span>${avgRating} (${product.reviews.length} reviews)</span>
        </div>
        <div class="modal-price">
          <span class="modal-price-main">$${product.price}</span>
          ${product.compare_at ? `<span class="modal-price-compare">$${product.compare_at}</span><span class="pill pill-gold">Save $${(product.compare_at-product.price).toFixed(0)}</span>` : ""}
        </div>
        <p class="modal-desc">${product.description}</p>
        <span class="variants-label">Color / Finish</span>
        <div class="variants" id="modal-variants">
          ${product.variants.map((v,i) => `<button class="variant-btn ${i===0?"active":""}" onclick="setModalVariant('${v}',this)">${v}</button>`).join("")}
        </div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
          <span class="qty-num" id="modal-qty">1</span>
          <button class="qty-btn" onclick="changeModalQty(1)">+</button>
        </div>
        <div class="add-row">
          <button class="btn btn-dark" style="flex:1" onclick="modalAddToCart(${product.id})">Add to Cart</button>
          <button class="btn btn-outline" data-wish="${product.id}" onclick="toggleWishlist(${product.id})">${wishlist.includes(product.id)?"♥":"♡"}</button>
        </div>
        <div class="divider" style="margin-bottom:16px"></div>
        <div class="tag" style="margin-bottom:10px">Specifications</div>
        <div class="specs-list">
          ${product.specs.map(s => `<div class="spec-item"><span class="spec-dash">—</span>${s}</div>`).join("")}
        </div>
        <div class="modal-sku">
          <span>SKU: ${product.sku}</span>
          <span class="${product.inventory > 20 ? "stock-ok" : "stock-low"}">${product.inventory > 20 ? product.inventory+" in stock" : "Only "+product.inventory+" left"}</span>
        </div>
      </div>
    </div>
    <div class="reviews-section">
      <div class="reviews-header">
        <h3 class="serif">Customer Reviews</h3>
        <div class="modal-rating">
          <span class="stars">${"★".repeat(Math.round(avgRating))}${"☆".repeat(5-Math.round(avgRating))}</span>
          <span>${avgRating} out of 5 · ${product.reviews.length} reviews</span>
        </div>
      </div>
      <div id="reviews-list">
        ${product.reviews.map(r => `
          <div class="review-item">
            <div class="review-top"><span class="review-author">${r.author}</span><span class="review-date">${r.date}</span></div>
            <span class="stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</span>
            <p class="review-body">${r.body}</p>
          </div>`).join("")}
      </div>
      <div class="review-form">
        <div class="review-form-title">Write a Review</div>
        <div class="star-input" id="star-input">
          ${[1,2,3,4,5].map(n => `<span data-val="${n}" onclick="setReviewStar(${n})" onmouseover="hoverStar(${n})" onmouseout="resetStarHover()">★</span>`).join("")}
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <input class="field-input" id="review-author" placeholder="Your name" />
          <textarea class="field-input" id="review-body" placeholder="Share your experience..." rows="3" style="resize:vertical"></textarea>
          <div id="review-error" class="form-error" style="display:none"></div>
          <button class="btn btn-dark" style="align-self:flex-start" onclick="submitReview(${product.id})">Submit Review</button>
        </div>
      </div>
    </div>`;

  window._modalProduct = product;
  window._reviewRating = 0;
}

function setModalImg(idx, src) {
  modalActiveImg = idx;
  document.getElementById("modal-main-img").src = src;
  document.querySelectorAll(".modal-thumb").forEach((el, i) => el.classList.toggle("active", i === idx));
}

function setModalVariant(v, btn) {
  modalVariant = v;
  document.querySelectorAll(".variant-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function changeModalQty(delta) {
  modalQty = Math.max(1, Math.min(10, modalQty + delta));
  document.getElementById("modal-qty").textContent = modalQty;
}

function modalAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const key = `${productId}-${modalVariant}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty += modalQty; } else { cart.push({ ...product, variant: modalVariant, qty: modalQty, key }); }
  renderCart();
  toast(`${product.name} (${modalVariant}) added to cart`, "success");
  document.getElementById("product-modal").classList.remove("open");
}

// ── REVIEW ────────────────────────────────────────────────────────────────────
function setReviewStar(n) { window._reviewRating = n; updateStarDisplay(n); }
function hoverStar(n) { updateStarDisplay(n); }
function resetStarHover() { updateStarDisplay(window._reviewRating); }
function updateStarDisplay(n) {
  document.querySelectorAll("#star-input span").forEach((el, i) => el.classList.toggle("lit", i < n));
}

function submitReview(productId) {
  const author = document.getElementById("review-author").value.trim();
  const body = document.getElementById("review-body").value.trim();
  const rating = window._reviewRating;
  const errEl = document.getElementById("review-error");
  if (!rating) { errEl.textContent = "Please select a star rating."; errEl.style.display = "block"; return; }
  if (!author) { errEl.textContent = "Please enter your name."; errEl.style.display = "block"; return; }
  if (body.length < 10) { errEl.textContent = "Review must be at least 10 characters."; errEl.style.display = "block"; return; }
  errEl.style.display = "none";
  const reviewHTML = `
    <div class="review-item">
      <div class="review-top"><span class="review-author">${author}</span><span class="review-date">Jun 2026</span></div>
      <span class="stars">${"★".repeat(rating)}${"☆".repeat(5-rating)}</span>
      <p class="review-body">${body}</p>
    </div>`;
  document.getElementById("reviews-list").insertAdjacentHTML("afterbegin", reviewHTML);
  document.getElementById("review-author").value = "";
  document.getElementById("review-body").value = "";
  window._reviewRating = 0;
  updateStarDisplay(0);
  toast("Review submitted — thanks!", "success");
}

// ── CHECKOUT ──────────────────────────────────────────────────────────────────
function renderCheckout() {
  const steps = [["1","Contact",checkoutStep>1],["2","Shipping",checkoutStep>2],["3","Payment",checkoutStep>3]];
  document.getElementById("checkout-steps").innerHTML = steps.map(([n,label,done]) => `
    <div class="step-row">
      <div class="step-num ${done?"done":""}">${done?"✓":n}</div>
      <span class="step-label ${checkoutStep===parseInt(n)?"active":""}">${label}</span>
    </div>`).join("");

  const shippingCost = cartTotal() >= 75 ? 0 : checkoutData.ship === "express" ? 14.99 : 5.99;
  const tax = cartTotal() * 0.08;
  const orderTotal = cartTotal() + shippingCost + tax;

  const summary = `
    <div class="order-summary">
      <div class="tag" style="margin-bottom:12px">Order Summary</div>
      ${cart.map(i => `<div class="cart-row"><span>${i.name} × ${i.qty}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join("")}
      <div class="divider" style="margin:10px 0"></div>
      <div class="cart-row muted"><span>Shipping</span><span>${shippingCost===0?"Free":"$"+shippingCost.toFixed(2)}</span></div>
      <div class="cart-row muted"><span>Tax (est.)</span><span>$${tax.toFixed(2)}</span></div>
      <div class="cart-row total"><span>Total</span><span>$${orderTotal.toFixed(2)}</span></div>
    </div>`;

  let body = "";
  if (checkoutStep === 1) body = `
    <div class="checkout-fields">
      ${field("email","Email","email","you@email.com")}
      ${field("coName","Full Name","text","John Smith")}
      ${field("phone","Phone (optional)","tel","+1 (555) 000-0000")}
      ${summary}
    </div>`;
  else if (checkoutStep === 2) body = `
    <div class="checkout-fields">
      ${field("line1","Street Address","text","123 Main St")}
      ${field("city","City","text","Atlanta")}
      <div class="two-col">${field("state","State","text","GA")}${field("zip","ZIP","text","30301")}</div>
      <div class="ship-options">
        <div class="field-label">Shipping Method</div>
        ${shipOption("standard","Standard (5–7 days)", cartTotal()>=75?"Free":"$5.99")}
        ${shipOption("express","Express (2–3 days)","$14.99")}
      </div>
      ${summary}
    </div>`;
  else if (checkoutStep === 3) body = `
    <div class="checkout-fields">
      <div class="ssl-badge">🔒 Secured by 256-bit SSL encryption</div>
      ${field("cardNum","Card Number","text","1234 5678 9012 3456")}
      ${field("cardName","Name on Card","text","John Smith")}
      <div class="two-col">${field("expiry","Expiry","text","MM/YY")}${field("cvv","CVV","text","123")}</div>
      ${summary}
    </div>`;

  document.getElementById("checkout-body").innerHTML = body;

  // Restore values
  ["email","coName","phone","line1","city","state","zip","cardNum","cardName","expiry","cvv"].forEach(id => {
    const el = document.getElementById(id);
    const key = id === "coName" ? "name" : id;
    if (el && checkoutData[key]) el.value = checkoutData[key];
  });

  // Ship option selected state
  document.querySelectorAll(".ship-option").forEach(el => {
    el.classList.toggle("selected", el.dataset.ship === checkoutData.ship);
  });

  document.getElementById("checkout-nav").innerHTML = `
    ${checkoutStep < 3
      ? `<button class="btn btn-dark w-full" style="margin-bottom:8px" onclick="checkoutNext()">Continue →</button>`
      : `<button class="btn btn-dark w-full" style="margin-bottom:8px" id="place-btn" onclick="placeOrder()">Place Order · $${orderTotal.toFixed(2)}</button>`}
    ${checkoutStep > 1 ? `<button class="btn btn-ghost w-full" onclick="checkoutBack()">← Back</button>` : ""}`;
}

function field(id, label, type, placeholder) {
  return `<div class="field-group">
    <label class="field-label" for="${id}">${label}</label>
    <input class="field-input" id="${id}" type="${type}" placeholder="${placeholder}" />
    <div class="field-error" id="${id}-err" style="display:none"></div>
  </div>`;
}

function shipOption(val, label, cost) {
  return `<label class="ship-option" data-ship="${val}" onclick="selectShip('${val}',this)">
    <input type="radio" name="ship" value="${val}" ${checkoutData.ship===val?"checked":""} />
    <span>${label}</span><span style="font-weight:600">${cost}</span>
  </label>`;
}

function selectShip(val) {
  checkoutData.ship = val;
  document.querySelectorAll(".ship-option").forEach(el => el.classList.toggle("selected", el.dataset.ship === val));
}

function saveCheckoutFields() {
  const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  checkoutData.email = get("email");
  checkoutData.name = get("coName");
  checkoutData.phone = get("phone");
  checkoutData.line1 = get("line1");
  checkoutData.city = get("city");
  checkoutData.state = get("state");
  checkoutData.zip = get("zip");
  checkoutData.cardNum = get("cardNum");
  checkoutData.cardName = get("cardName");
  checkoutData.expiry = get("expiry");
  checkoutData.cvv = get("cvv");
}

function validateStep() {
  let valid = true;
  const err = (id, msg) => { const el = document.getElementById(id+"-err"); if(el){el.textContent=msg;el.style.display="block";} valid=false; };
  const clr = (id) => { const el = document.getElementById(id+"-err"); if(el)el.style.display="none"; };
  if (checkoutStep === 1) {
    clr("email"); clr("coName");
    if (!checkoutData.email.includes("@")) err("email","Valid email required");
    if (!checkoutData.name) err("coName","Name required");
  }
  if (checkoutStep === 2) {
    clr("line1"); clr("city"); clr("zip");
    if (!checkoutData.line1) err("line1","Address required");
    if (!checkoutData.city) err("city","City required");
    if (!checkoutData.zip.match(/^\d{5}/)) err("zip","Valid ZIP required");
  }
  if (checkoutStep === 3) {
    clr("cardNum"); clr("cardName"); clr("expiry"); clr("cvv");
    if (!checkoutData.cardNum.replace(/\s/g,"").match(/^\d{16}$/)) err("cardNum","16-digit card number required");
    if (!checkoutData.cardName) err("cardName","Name on card required");
    if (!checkoutData.expiry.match(/^\d{2}\/\d{2}$/)) err("expiry","Format MM/YY");
    if (!checkoutData.cvv.match(/^\d{3,4}$/)) err("cvv","3–4 digits");
  }
  return valid;
}

function checkoutNext() {
  saveCheckoutFields();
  if (!validateStep()) return;
  checkoutStep++;
  renderCheckout();
}

function checkoutBack() {
  saveCheckoutFields();
  checkoutStep--;
  renderCheckout();
}

function placeOrder() {
  saveCheckoutFields();
  if (!validateStep()) return;
  const btn = document.getElementById("place-btn");
  if (btn) { btn.textContent = "Processing..."; btn.disabled = true; }
  setTimeout(() => {
    closeAll();
    document.getElementById("success-modal").classList.add("open");
  }, 2000);
}

// ── PRODUCT GRID ──────────────────────────────────────────────────────────────
function renderProducts() {
  let products = [...PRODUCTS];
  if (activeCategory !== "All") products = products.filter(p => p.category === activeCategory);
  if (searchQuery) products = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery) ||
    p.category.toLowerCase().includes(searchQuery) ||
    p.tagline.toLowerCase().includes(searchQuery));
  if (sortBy === "price-asc") products.sort((a,b) => a.price-b.price);
  else if (sortBy === "price-desc") products.sort((a,b) => b.price-a.price);
  else if (sortBy === "margin") products.sort((a,b) => b.margin-a.margin);
  else if (sortBy === "rating") products.sort((a,b) => avgRating(b)-avgRating(a));

  const grid = document.getElementById("products-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>No products match your search.</p><button class="btn btn-ghost" onclick="clearFilters()">Clear filters</button></div>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const avg = avgRating(p);
    const badgeClass = p.badge === "High Margin" ? "pill-gold" : p.badge === "New" ? "pill-blue" : "pill-dark";
    return `
      <div class="product-card">
        <div class="card-img-wrap" onclick="openProductModal(${p.id})">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          <div class="card-badges">
            ${p.badge ? `<span class="pill ${badgeClass}">${p.badge}</span>` : ""}
            ${p.compare_at ? `<span class="pill pill-green">Sale</span>` : ""}
          </div>
          <button class="wish-btn" data-wish="${p.id}" onclick="event.stopPropagation();toggleWishlist(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
          ${p.inventory <= 15 ? `<div class="low-stock">Only ${p.inventory} left</div>` : ""}
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="tag">${p.category}</span>
            <div class="card-rating"><span class="stars" style="font-size:11px">${"★".repeat(Math.round(avg))}${"☆".repeat(5-Math.round(avg))}</span><span>(${p.reviews.length})</span></div>
          </div>
          <h3 class="card-name serif" onclick="openProductModal(${p.id})">${p.name}</h3>
          <p class="card-tagline">${p.tagline}</p>
          <div class="card-footer">
            <div class="card-price">
              <span class="price-main">$${p.price}</span>
              ${p.compare_at ? `<span class="price-compare">$${p.compare_at}</span>` : ""}
            </div>
            <button class="btn btn-dark btn-sm" onclick="addToCart(${p.id},'${p.variants[0]}')">Add to Cart</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function avgRating(p) { return p.reviews.length ? p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length : 0; }

function clearFilters() { searchQuery = ""; activeCategory = "All"; document.getElementById("search-input").value = ""; document.querySelectorAll(".cat-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === "All")); renderProducts(); }

// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg, type = "default") {
  const wrap = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast";
  el.style.borderLeft = `3px solid ${type === "success" ? "#4CAF50" : type === "wish" ? "#C8963E" : "#555"}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, 2500);
}

// ── EMAIL SIGNUP ──────────────────────────────────────────────────────────────
function subscribeEmail() {
  const val = document.getElementById("email-signup").value.trim();
  if (!val.includes("@")) { toast("Enter a valid email address"); return; }
  document.getElementById("email-form-wrap").innerHTML = `<p class="email-success">✓ You're in. Check your inbox for your discount code.</p>`;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  // Search
  const searchEl = document.getElementById("search-input");
  if (searchEl) searchEl.addEventListener("input", e => { searchQuery = e.target.value.toLowerCase(); renderProducts(); });

  // Sort
  const sortEl = document.getElementById("sort-select");
  if (sortEl) sortEl.addEventListener("change", e => { sortBy = e.target.value; renderProducts(); });

  // Category buttons
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === activeCategory));
      renderProducts();
    });
  });

  // Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.getElementById("product-modal").classList.remove("open");
      closeAll();
    }
  });
});
