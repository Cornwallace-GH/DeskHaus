import { useCart, useToast } from "../context";
import { avg, Stars } from "../utils";

export default function ProductCard({ product, onOpen }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const toast = useToast();
  const wished = wishlist.includes(product.id);
  const avgRating = avg(product.reviews.map(r => r.rating));

  return (
    <div className="card">
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", cursor: "pointer" }} onClick={() => onOpen(product)}>
        <img src={product.img} alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexDirection: "column", alignItems: "flex-start" }}>
          {product.badge && (
            <span className={`pill ${product.badge === "High Margin" ? "pill-gold" : product.badge === "New" ? "pill-blue" : "pill-dark"}`}>
              {product.badge}
            </span>
          )}
          {product.compareAt && <span className="pill pill-green">Sale</span>}
        </div>
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); toast(wished ? "Removed from wishlist" : "Saved ♡", "wish"); }}
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", border: "none", width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {wished ? "♥" : "♡"}
        </button>
        {product.inventory <= 15 && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(230,81,0,0.88)", color: "#fff", fontSize: 10, letterSpacing: "0.08em", textAlign: "center", padding: "5px 0" }}>
            ONLY {product.inventory} LEFT
          </div>
        )}
      </div>
      <div style={{ padding: "18px 18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <span className="tag">{product.category}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Stars rating={parseFloat(avgRating)} size={11} />
            <span style={{ fontSize: 10, color: "#aaa" }}>({product.reviews.length})</span>
          </div>
        </div>
        <h3 className="serif" style={{ fontSize: 19, marginBottom: 3, cursor: "pointer" }} onClick={() => onOpen(product)}>{product.name}</h3>
        <p style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>{product.tagline}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ fontSize: 19, fontWeight: 600 }}>${product.price}</span>
            {product.compareAt && <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>${product.compareAt}</span>}
          </div>
          <button className="btn btn-dark" style={{ padding: "9px 16px", fontSize: 11 }}
            onClick={() => { addToCart(product, product.variants[0].label); toast(`${product.name} added to cart`, "success"); }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
