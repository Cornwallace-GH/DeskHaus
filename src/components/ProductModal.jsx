import { useState, useEffect } from "react";
import { useCart, useToast } from "../context";
import { avg, Stars } from "../utils";
import ReviewForm from "./ReviewForm";

export default function ProductModal({ product, onClose }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const toast = useToast();
  const [variant, setVariant] = useState(product.variants[0].label);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState(product.reviews);
  const avgRating = avg(reviews.map(r => r.rating));
  const wished = wishlist.includes(product.id);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = () => {
    addToCart(product, variant, qty);
    toast(`${product.name} (${variant}) added to cart`, "success");
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="product-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {/* Images */}
          <div style={{ position: "relative" }}>
            <img src={product.imgs[activeImg]} alt={product.name}
              style={{ width: "100%", height: 460, objectFit: "cover", display: "block" }} />
            {product.imgs.length > 1 && (
              <div style={{ display: "flex", gap: 6, padding: "10px 16px", background: "#f8f7f4" }}>
                {product.imgs.map((src, i) => (
                  <img key={i} src={src} className={`product-img-thumb ${i === activeImg ? "active" : ""}`}
                    onClick={() => setActiveImg(i)} alt="" />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "36px 32px", overflowY: "auto", maxHeight: 560 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span className="tag">{product.category}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn-icon" onClick={() => { toggleWishlist(product.id); toast(wished ? "Removed from wishlist" : "Added to wishlist ♡", "wish"); }}>{wished ? "♥" : "♡"}</button>
                <button className="btn-icon" onClick={onClose}>✕</button>
              </div>
            </div>

            <h2 className="serif" style={{ fontSize: 28, marginBottom: 4 }}>{product.name}</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>{product.tagline}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Stars rating={parseFloat(avgRating)} />
              <span style={{ fontSize: 12, color: "#888" }}>{avgRating} ({reviews.length} reviews)</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 28, fontWeight: 600 }}>${product.price}</span>
              {product.compareAt && <span style={{ fontSize: 15, color: "#aaa", textDecoration: "line-through" }}>${product.compareAt}</span>}
              {product.compareAt && <span className="pill pill-gold">Save ${(product.compareAt - product.price).toFixed(0)}</span>}
            </div>

            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, marginBottom: 20 }}>{product.description}</p>

            <div style={{ marginBottom: 20 }}>
              <span className="tag" style={{ display: "block", marginBottom: 8 }}>Color / Finish</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.variants.map(v => (
                  <button key={v.label} className={`variant-btn ${variant === v.label ? "active" : ""}`} onClick={() => setVariant(v.label)}>{v.label}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <span className="tag" style={{ display: "block", marginBottom: 8 }}>Quantity</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={{ width: 44, textAlign: "center", fontSize: 14, fontWeight: 500 }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button className="btn btn-dark" style={{ flex: 1 }} onClick={handleAdd}>Add to Cart</button>
              <button className="btn btn-outline" onClick={() => { toggleWishlist(product.id); toast(wished ? "Removed" : "Saved ♡", "wish"); }}>{wished ? "♥" : "♡"}</button>
            </div>

            <div className="divider" style={{ marginBottom: 16 }} />
            <div className="tag" style={{ marginBottom: 10 }}>Specifications</div>
            {product.specs.map(s => (
              <div key={s} style={{ display: "flex", gap: 8, fontSize: 13, color: "#555", padding: "5px 0", borderBottom: "1px solid #f4f4f4" }}>
                <span style={{ color: "#bbb" }}>—</span>{s}
              </div>
            ))}
            <div style={{ marginTop: 14, display: "flex", gap: 16, fontSize: 11, color: "#aaa" }}>
              <span>SKU: {product.sku}</span>
              <span>Weight: {product.weight}</span>
              <span style={{ color: product.inventory > 20 ? "#388E3C" : "#E65100" }}>
                {product.inventory > 20 ? `${product.inventory} in stock` : `Only ${product.inventory} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ padding: "32px 36px", borderTop: "1px solid #eee" }}>
          <h3 className="serif" style={{ fontSize: 22, marginBottom: 6 }}>Customer Reviews</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
            <Stars rating={parseFloat(avgRating)} size={16} />
            <span style={{ fontSize: 13, color: "#888" }}>{avgRating} out of 5 · {reviews.length} reviews</span>
          </div>
          {reviews.map((r, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{r.author}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{r.date}</span>
              </div>
              <Stars rating={r.rating} size={13} />
              <p style={{ fontSize: 13, color: "#555", marginTop: 6, lineHeight: 1.65 }}>{r.body}</p>
            </div>
          ))}
          <ReviewForm onSubmit={r => setReviews(p => [r, ...p])} />
        </div>
      </div>
    </div>
  );
}
