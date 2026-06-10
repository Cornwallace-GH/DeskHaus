import { useState } from "react";
import { useToast } from "../context";
import { StarInput } from "../utils";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (!rating) return setErr("Please select a star rating.");
    if (!author.trim()) return setErr("Please enter your name.");
    if (body.trim().length < 10) return setErr("Review must be at least 10 characters.");
    setErr("");
    onSubmit({ author: author.trim(), rating, body: body.trim(), date: "Jun 2026" });
    toast("Review submitted — thanks!", "success");
    setRating(0); setAuthor(""); setBody("");
  };

  return (
    <div style={{ background: "#F8F7F4", padding: 24, marginTop: 24 }}>
      <div className="tag" style={{ marginBottom: 16 }}>Write a Review</div>
      <StarInput value={rating} onChange={setRating} />
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <input className="input" placeholder="Your name" value={author} onChange={e => setAuthor(e.target.value)} />
        <textarea className="input" placeholder="Share your experience..." value={body} onChange={e => setBody(e.target.value)} rows={3} style={{ resize: "vertical" }} />
        {err && <p style={{ fontSize: 12, color: "#c62828" }}>{err}</p>}
        <button className="btn btn-dark" style={{ alignSelf: "flex-start" }} onClick={handleSubmit}>Submit Review</button>
      </div>
    </div>
  );
}
