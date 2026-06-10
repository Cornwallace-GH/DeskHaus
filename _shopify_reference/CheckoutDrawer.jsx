import { useState } from "react";
import { useCart, useToast } from "../context";

const Field = ({ label, value, onChange, error, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#777", marginBottom: 5 }}>{label}</label>
    <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    {error && <p style={{ fontSize: 11, color: "#c62828", marginTop: 3 }}>{error}</p>}
  </div>
);

export default function CheckoutDrawer({ onClose, onSuccess }) {
  const { cart, cartTotal, cartSavings, clearCart } = useCart();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ email: "", name: "", phone: "" });
  const [addr, setAddr] = useState({ line1: "", city: "", state: "", zip: "" });
  const [ship, setShip] = useState("standard");
  const [pay, setPay] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const shippingCost = cartTotal >= 75 ? 0 : ship === "express" ? 14.99 : 5.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingCost + tax;

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!info.email.includes("@")) e.email = "Valid email required";
      if (!info.name.trim()) e.name = "Name required";
    }
    if (step === 2) {
      if (!addr.line1.trim()) e.line1 = "Address required";
      if (!addr.city.trim()) e.city = "City required";
      if (!addr.zip.match(/^\d{5}/)) e.zip = "Valid ZIP required";
    }
    if (step === 3) {
      if (!pay.number.replace(/\s/g,"").match(/^\d{16}$/)) e.number = "16-digit number required";
      if (!pay.name.trim()) e.payname = "Name on card required";
      if (!pay.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Format MM/YY";
      if (!pay.cvv.match(/^\d{3,4}$/)) e.cvv = "3–4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const place = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); clearCart(); onSuccess(); }, 2000);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer" style={{ padding: "32px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 className="serif" style={{ fontSize: 24 }}>Checkout</h2>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: 22 }}>✕</button>
        </div>

        {/* Steps indicator */}
        <div style={{ marginBottom: 24 }}>
          {[["1","Contact",step>1],["2","Shipping",step>2],["3","Payment",step>3]].map(([n,label,done]) => (
            <div key={n} className="checkout-step">
              <div className={`step-num ${done ? "done" : ""}`}>{done ? "✓" : n}</div>
              <span style={{ fontSize: 13, fontWeight: step === parseInt(n) ? 600 : 400, color: step === parseInt(n) ? "#1C1C1C" : "#888" }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {step === 1 && (
            <>
              <Field label="Email" value={info.email} onChange={v => setInfo(p=>({...p,email:v}))} error={errors.email} placeholder="you@email.com" type="email" />
              <Field label="Full Name" value={info.name} onChange={v => setInfo(p=>({...p,name:v}))} error={errors.name} placeholder="John Smith" />
              <Field label="Phone (optional)" value={info.phone} onChange={v => setInfo(p=>({...p,phone:v}))} placeholder="+1 (555) 000-0000" />
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Street Address" value={addr.line1} onChange={v => setAddr(p=>({...p,line1:v}))} error={errors.line1} placeholder="123 Main St" />
              <Field label="City" value={addr.city} onChange={v => setAddr(p=>({...p,city:v}))} error={errors.city} placeholder="Atlanta" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="State" value={addr.state} onChange={v => setAddr(p=>({...p,state:v}))} placeholder="GA" />
                <Field label="ZIP" value={addr.zip} onChange={v => setAddr(p=>({...p,zip:v}))} error={errors.zip} placeholder="30301" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#777", marginBottom: 8 }}>Shipping Method</label>
                {[{id:"standard",label:"Standard (5–7 days)",cost:cartTotal>=75?"Free":"$5.99"},{id:"express",label:"Express (2–3 days)",cost:"$14.99"}].map(o => (
                  <label key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: `1px solid ${ship===o.id?"#1C1C1C":"#ddd"}`, marginBottom: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="radio" value={o.id} checked={ship===o.id} onChange={() => setShip(o.id)} />
                    <span style={{ flex: 1 }}>{o.label}</span>
                    <span style={{ fontWeight: 600 }}>{o.cost}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div style={{ background: "#f8f7f4", padding: "12px 14px", marginBottom: 20, fontSize: 12, color: "#555" }}>🔒 Secured by 256-bit SSL encryption</div>
              <Field label="Card Number" value={pay.number}
                onChange={v => setPay(p=>({...p,number:v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19)}))}
                error={errors.number} placeholder="1234 5678 9012 3456" />
              <Field label="Name on Card" value={pay.name} onChange={v => setPay(p=>({...p,name:v}))} error={errors.payname} placeholder="John Smith" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Expiry" value={pay.expiry}
                  onChange={v => { let val=v.replace(/\D/g,""); if(val.length>=2) val=val.slice(0,2)+"/"+val.slice(2,4); setPay(p=>({...p,expiry:val})); }}
                  error={errors.expiry} placeholder="MM/YY" />
                <Field label="CVV" value={pay.cvv} onChange={v => setPay(p=>({...p,cvv:v.replace(/\D/g,"").slice(0,4)}))} error={errors.cvv} placeholder="123" />
              </div>
            </>
          )}

          {/* Order Summary */}
          <div style={{ background: "#f8f7f4", padding: "16px 14px", marginTop: 20 }}>
            <div className="tag" style={{ marginBottom: 12 }}>Order Summary</div>
            {cart.map(i => (
              <div key={i.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 6 }}>
                <span>{i.name} × {i.qty}</span><span>${(i.price*i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: "10px 0" }} />
            {cartSavings > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#388E3C", marginBottom: 4 }}><span>Savings</span><span>−${cartSavings.toFixed(2)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 4 }}><span>Shipping</span><span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 8 }}><span>Tax (est.)</span><span>${tax.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
          </div>
        </div>

        <div style={{ paddingTop: 20 }}>
          {step < 3
            ? <button className="btn btn-dark" style={{ width: "100%", padding: 14 }} onClick={next}>Continue →</button>
            : <button className="btn btn-dark" style={{ width: "100%", padding: 14 }} onClick={place} disabled={loading}>{loading ? "Processing..." : `Place Order · $${orderTotal.toFixed(2)}`}</button>
          }
          {step > 1 && <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => setStep(s=>s-1)}>← Back</button>}
        </div>
      </div>
    </>
  );
}
