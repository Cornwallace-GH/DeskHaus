import { createContext, useContext, useCallback, useState } from "react";

// ─── CART ────────────────────────────────────────────────────────────────────
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = useCallback((product, variant, qty = 1) => {
    setCart(prev => {
      const key = `${product.id}-${variant}`;
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, variant, qty, key }];
    });
  }, []);

  const removeFromCart = useCallback((key) => setCart(prev => prev.filter(i => i.key !== key)), []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartSavings = cart.reduce((s, i) => s + (i.compareAt ? (i.compareAt - i.price) * i.qty : 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, cartSavings, wishlist, toggleWishlist }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = "default") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            borderLeft: `3px solid ${t.type === "success" ? "#4CAF50" : t.type === "wish" ? "#C8963E" : "#555"}`
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
