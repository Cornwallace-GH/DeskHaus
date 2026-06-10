import { useState } from "react";
import { CartProvider, ToastProvider, useCart, useToast } from "./context";
import { PRODUCTS, BUNDLES, CATEGORIES, SORT_OPTIONS } from "./data";
import { avg, Stars } from "./utils";
import { CSS } from "./styles";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutDrawer from "./components/CheckoutDrawer";

function OrderSuccess({ onClose }) {
  return (
    <div className="modal">
      <div style={{ background: "#fff", padding: "56px 48px", maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
        <h2 className="serif" style={{ fontSize: 30, marginBottom: 8 }}>Order Placed</h2>
        <p style={{ fontSize: 14, color: "#777", marginBottom: 6, lineHeight: 1.7 }}>
          Thanks for your order. You'll receive a confirmation email shortly with tracking info.
        </p>
        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 28 }}>Estimated delivery: 5–7 business days</p>
        <button className="btn btn-dark" onClick={onClose} style={{ width: "100%" }}>Continue Shopping</button>
      </div>
    </div>
  );
}

function Store() {
  const { cartCount, addToCart } = useCart();
  const toast = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const filtered = PRODUCTS
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "margin") return b.margin - a.margin;
      if (sort === "rating") return avg(b.reviews.map(r => r.rating)) - avg(a.reviews.map(r => r.rating));
      return 0;
    });

  return (
    <div>
      <style>{CSS}</style>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ background: "#1C1C1C", color: "#fff", textAlign: "center", padding: "9px 16px", fontSize: 11, letterSpacing: "0.08em" }}>
        Free shipping on orders over $75 · 30-day returns · Secure checkout
      </div>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer" }}>
              <span className="serif" style={{ fontSize: 21 }}>DESK</span>
              <span style={{ fontSize: 21, fontWeight: 300, letterSpacing: "0.14em" }}>HAUS</span>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <button className="nav-link" onClick={() => document.getElementById("shop").scrollIntoView({ behavior: "smooth" })}>Shop</button>
              <button className="nav-link" onClick={() => document.getElementById("bundles").scrollIntoView({ behavior: "smooth" })}>Bundles</button>
              <button className="nav-link" onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>About</button>
            </div>
          </div>
          <button onClick={() => { setCartOpen(true); setCheckoutOpen(false); }}
            style={{ position: "relative", background: "none", border: "1px solid #1C1C1C", padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 500, letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif" }}>
            Cart
            {cartCount > 0 && (
              <span style={{ background: "#1C1C1C", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "#1C1C1C", color: "#fff", padding: "96px 32px 80px" }}>
        <div className="hero-grid" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div className="tag" style={{ color: "#555", marginBottom: 18 }}>Premium Home Office Gear</div>
            <h1 className="serif" style={{ fontSize: 58, lineHeight: 1.04, marginBottom: 22, fontWeight: 400 }}>
              Your desk should work as hard as you do.
            </h1>
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.75, maxWidth: 430, marginBottom: 36 }}>
              Eight hand-picked products. No fillers, no noise — just the gear that makes a real workspace.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-dark" style={{ background: "#fff", color: "#1C1C1C", padding: "14px 28px" }}
                onClick={() => document.getElementById("shop").scrollIntoView({ behavior: "smooth" })}>
                Shop the Collection
              </button>
              <button className="btn" style={{ border: "1px solid #444", color: "#888", padding: "14px 28px", background: "transparent", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}
                onClick={() => document.getElementById("bundles").scrollIntoView({ behavior: "smooth" })}>
                View Bundles
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {PRODUCTS.slice(0, 4).map(p => (
              <div key={p.id} style={{ aspectRatio: "1", overflow: "hidden", cursor: "pointer" }} onClick={() => setSelectedProduct(p)}>
                <img src={p.img} alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)", transition: "all 0.4s" }}
                  onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.85)"; e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "brightness(0.65)"; e.currentTarget.style.transform = "scale(1)"; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "#EDEAE4", borderBottom: "1px solid #ddd", padding: "13px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {["🚚 Free shipping over $75","↩ 30-day returns","🔒 Secure SSL checkout","📦 Ships in 1–2 business days"].map(t => (
            <span key={t} style={{ fontSize: 11, letterSpacing: "0.07em", color: "#666" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* SHOP */}
      <section id="shop" style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 20 }}>
          <div>
            <div className="tag" style={{ marginBottom: 8 }}>The Collection</div>
            <h2 className="serif" style={{ fontSize: 38, fontWeight: 400 }}>8 products. No filler.</h2>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 14 }}>⌕</span>
              <input className="input" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." style={{ paddingLeft: 34, maxWidth: 220 }} />
            </div>
            <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#bbb" }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>No products match your search.</p>
            <button className="btn btn-ghost" onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear filters</button>
          </div>
        ) : (
          <div className="shop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 2 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
          </div>
        )}
      </section>

      {/* BUNDLES */}
      <section id="bundles" style={{ background: "#EDEAE4", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: 8 }}>Curated Bundles</div>
          <h2 className="serif" style={{ fontSize: 38, marginBottom: 40, fontWeight: 400 }}>Built to go together.</h2>
          <div className="bundle-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 2 }}>
            {BUNDLES.map(b => {
              const bProducts = b.productIds.map(id => PRODUCTS.find(p => p.id === id));
              const totalPrice = bProducts.reduce((s, p) => s + p.price, 0);
              const bundlePrice = totalPrice - b.savings;
              return (
                <div key={b.id} className="card" style={{ overflow: "hidden" }}>
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <img src={b.img} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
                    <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff" }}>
                      <h3 className="serif" style={{ fontSize: 24, marginBottom: 4 }}>{b.name}</h3>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{b.tagline}</p>
                    </div>
                    <span className="pill pill-gold" style={{ position: "absolute", top: 16, right: 16 }}>Save ${b.savings}</span>
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    {bProducts.map(p => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", padding: "4px 0" }}>
                        <span>{p.name}</span><span>${p.price}</span>
                      </div>
                    ))}
                    <div className="divider" style={{ margin: "14px 0" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: 22, fontWeight: 600 }}>${bundlePrice.toFixed(2)}</span>
                        <span style={{ fontSize: 13, color: "#bbb", textDecoration: "line-through", marginLeft: 8 }}>${totalPrice.toFixed(2)}</span>
                      </div>
                      <button className="btn btn-dark" style={{ padding: "10px 18px", fontSize: 11 }}
                        onClick={() => { bProducts.forEach(p => addToCart(p, p.variants[0].label)); toast(`${b.name} added to cart!`, "success"); }}>
                        Add Bundle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS / SOURCING */}
      <section style={{ background: "#1C1C1C", color: "#fff", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="tag" style={{ color: "#555", marginBottom: 8 }}>By the Numbers</div>
          <h2 className="serif" style={{ fontSize: 36, marginBottom: 48, fontWeight: 400 }}>The business case.</h2>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, marginBottom: 56 }}>
            {[
              { stat: "74–83%", label: "Gross margin range" },
              { stat: "8 SKUs", label: "Tight, curated catalog" },
              { stat: "$22–$70", label: "Retail price per unit" },
              { stat: "$4–18", label: "Average supplier cost" },
            ].map(item => (
              <div key={item.stat}>
                <div className="serif" style={{ fontSize: 42, marginBottom: 8 }}>{item.stat}</div>
                <div className="tag" style={{ color: "#555" }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333" }}>
                  {["Product","Supplier","SKU","Cost","Price","Margin"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#666", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #222" }}>
                    <td style={{ padding: "11px 14px", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "11px 14px", color: "#666" }}>{p.supplier}</td>
                    <td style={{ padding: "11px 14px", color: "#555", fontFamily: "monospace", fontSize: 11 }}>{p.supplierSKU}</td>
                    <td style={{ padding: "11px 14px", color: "#888" }}>${p.cost}</td>
                    <td style={{ padding: "11px 14px" }}>${p.price}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ background: "#1B5E20", color: "#A5D6A7", padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{p.margin}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <div className="tag" style={{ marginBottom: 12 }}>About DeskHaus</div>
            <h2 className="serif" style={{ fontSize: 36, marginBottom: 20, fontWeight: 400 }}>We believe your workspace should earn its keep.</h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 16 }}>
              DeskHaus was built around one idea: most desk gear is either ugly, overpriced, or both. We cut the catalog down to 8 things that actually work, sourced from vetted suppliers, priced for the quality they deliver.
            </p>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
              Every product ships within 1–2 business days. Every order comes with a 30-day return guarantee. No questions, no hassle.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {PRODUCTS.slice(4, 8).map(p => (
              <div key={p.id} style={{ aspectRatio: "1", overflow: "hidden" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section style={{ background: "#1C1C1C", color: "#fff", padding: "64px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="tag" style={{ color: "#555", marginBottom: 10 }}>Stay in the loop</div>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 12, fontWeight: 400 }}>Get 10% off your first order.</h2>
          <p style={{ fontSize: 14, color: "#777", marginBottom: 28 }}>New drops, restocks, and deals. No spam.</p>
          {emailSent ? (
            <p style={{ fontSize: 15, color: "#A5D6A7" }}>✓ You're in. Check your inbox for your discount code.</p>
          ) : (
            <div style={{ display: "flex", gap: 0 }}>
              <input className="input" value={emailVal} onChange={e => setEmailVal(e.target.value)}
                placeholder="Your email address" type="email"
                style={{ flex: 1, borderColor: "#333", background: "#111", color: "#fff" }}
                onKeyDown={e => { if (e.key === "Enter" && emailVal.includes("@")) setEmailSent(true); }} />
              <button className="btn btn-dark" style={{ background: "#fff", color: "#1C1C1C", whiteSpace: "nowrap", padding: "12px 20px" }}
                onClick={() => { if (emailVal.includes("@")) setEmailSent(true); else toast("Enter a valid email"); }}>
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#EDEAE4", borderTop: "1px solid #ddd", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <span className="serif" style={{ fontSize: 20 }}>DESK</span>
                <span style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.14em" }}>HAUS</span>
              </div>
              <p style={{ fontSize: 12, color: "#888", lineHeight: 1.7, maxWidth: 240 }}>Premium home office accessories. Curated for people who take their workspace seriously.</p>
            </div>
            {[
              { title: "Shop", links: ["All Products","Bundles","New Arrivals","Best Sellers"] },
              { title: "Support", links: ["FAQ","Shipping Policy","Returns","Contact Us"] },
              { title: "Company", links: ["About","Supplier Info","Affiliate Program","Press"] },
            ].map(col => (
              <div key={col.title}>
                <div className="tag" style={{ marginBottom: 14 }}>{col.title}</div>
                {col.links.map(l => <div key={l} style={{ fontSize: 12, color: "#888", marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 11, color: "#aaa" }}>© 2026 DeskHaus · All rights reserved</p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy","Terms of Service","Sitemap"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "#aaa", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* OVERLAYS */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {cartOpen && !checkoutOpen && <CartDrawer onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutDrawer onClose={() => setCheckoutOpen(false)} onSuccess={() => { setCheckoutOpen(false); setOrderDone(true); }} />}
      {orderDone && <OrderSuccess onClose={() => setOrderDone(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Store />
      </CartProvider>
    </ToastProvider>
  );
}
