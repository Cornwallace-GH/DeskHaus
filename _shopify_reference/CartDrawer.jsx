import { useCart } from "../context";

export default function CartDrawer({ onClose, onCheckout }) {
  const { cart, removeFromCart, updateQty, cartTotal, cartSavings } = useCart();
  const FREE_SHIP = 75;
  const progress = Math.min((cartTotal / FREE_SHIP) * 100, 100);
  const remaining = Math.max(FREE_SHIP - cartTotal, 0);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer" style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 className="serif" style={{ fontSize: 24 }}>Your Cart ({cart.length})</h2>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: 22 }}>✕</button>
        </div>

        <div style={{ background: "#f8f7f4", padding: "12px 14px", marginBottom: 20 }}>
          <div className="progress-bar" style={{ marginBottom: 6 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.04em" }}>
            {remaining > 0 ? `Add $${remaining.toFixed(2)} more for free shipping` : "✓ You qualify for free shipping"}
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
              <p style={{ fontSize: 14 }}>Your cart is empty.</p>
            </div>
          ) : cart.map(item => (
            <div key={item.key} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
              <img src={item.img} alt={item.name} style={{ width: 76, height: 76, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>{item.variant}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button className="qty-btn" style={{ width: 26, height: 26 }} onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                    <span style={{ width: 32, textAlign: "center", fontSize: 13 }}>{item.qty}</span>
                    <button className="qty-btn" style={{ width: 26, height: 26 }} onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>${(item.price * item.qty).toFixed(2)}</div>
                    <button onClick={() => removeFromCart(item.key)} style={{ fontSize: 10, color: "#bbb", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>REMOVE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ paddingTop: 20, borderTop: "1px solid #eee" }}>
            {cartSavings > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#388E3C", marginBottom: 6 }}>
                <span>You save</span><span>−${cartSavings.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
              <span>Shipping</span><span>{cartTotal >= FREE_SHIP ? "Free" : "Calculated at checkout"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 17, marginBottom: 18 }}>
              <span>Total</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-dark" style={{ width: "100%", padding: 15, fontSize: 13 }} onClick={onCheckout}>
              Proceed to Checkout →
            </button>
            <p style={{ fontSize: 10, color: "#bbb", textAlign: "center", marginTop: 10, letterSpacing: "0.04em" }}>
              Secure checkout · SSL encrypted · 30-day returns
            </p>
          </div>
        )}
      </div>
    </>
  );
}
