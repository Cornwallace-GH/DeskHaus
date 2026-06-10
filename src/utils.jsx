export const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "0";

export const Stars = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#C8963E", fontSize: size, letterSpacing: 1 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

export const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{ fontSize: 28, cursor: "pointer", color: n <= (hover || value) ? "#C8963E" : "#ddd", transition: "color 0.1s" }}>★</span>
      ))}
    </div>
  );
};

import { useState } from "react";
