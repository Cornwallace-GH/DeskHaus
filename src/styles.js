export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: #F8F7F4; color: #1C1C1C; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
  .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.18s ease; }
  .btn-dark { background: #1C1C1C; color: #fff; padding: 13px 26px; font-size: 12px; }
  .btn-dark:hover { background: #333; }
  .btn-dark:disabled { background: #aaa; cursor: not-allowed; }
  .btn-outline { background: transparent; color: #1C1C1C; border: 1px solid #1C1C1C; padding: 11px 22px; font-size: 12px; }
  .btn-outline:hover { background: #1C1C1C; color: #fff; }
  .btn-ghost { background: transparent; color: #666; border: 1px solid #ddd; padding: 9px 16px; font-size: 11px; }
  .btn-ghost:hover { border-color: #999; color: #1C1C1C; }
  .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; color: #666; transition: color 0.15s; font-size: 18px; line-height: 1; }
  .btn-icon:hover { color: #1C1C1C; }
  .card { background: #fff; transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.09); }
  .pill { display: inline-block; padding: 3px 9px; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .pill-dark { background: #1C1C1C; color: #fff; }
  .pill-gold { background: #C8963E; color: #fff; }
  .pill-green { background: #2E7D32; color: #fff; }
  .pill-blue { background: #1565C0; color: #fff; }
  .tag { font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #999; }
  .input { width: 100%; border: 1px solid #ddd; padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #1C1C1C; background: #fff; outline: none; transition: border-color 0.15s; border-radius: 0; }
  .input:focus { border-color: #1C1C1C; }
  .select { border: 1px solid #ddd; padding: 9px 14px; font-family: 'Inter', sans-serif; font-size: 12px; color: #1C1C1C; background: #fff; cursor: pointer; outline: none; letter-spacing: 0.04em; border-radius: 0; }
  .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 440px; background: #fff; z-index: 300; overflow-y: auto; animation: slideR 0.28s cubic-bezier(.4,0,.2,1); box-shadow: -8px 0 40px rgba(0,0,0,0.12); }
  @keyframes slideR { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.42); z-index: 200; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { position: fixed; inset: 0; z-index: 400; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,0.5); }
  .modal-box { background: #fff; max-width: 940px; width: 100%; max-height: 92vh; overflow-y: auto; animation: scaleIn 0.22s ease; }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  .toast-wrap { position: fixed; bottom: 28px; right: 28px; z-index: 600; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
  .toast { background: #1C1C1C; color: #fff; padding: 12px 20px; font-size: 13px; letter-spacing: 0.03em; animation: toastIn 0.25s ease; pointer-events: auto; min-width: 220px; }
  @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .nav-link { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #555; cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; transition: color 0.15s; }
  .nav-link:hover { color: #1C1C1C; }
  .qty-btn { width: 32px; height: 32px; border: 1px solid #ddd; background: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .qty-btn:hover { border-color: #1C1C1C; background: #1C1C1C; color: #fff; }
  .variant-btn { padding: 7px 14px; font-size: 11px; font-weight: 500; letter-spacing: 0.04em; border: 1px solid #ddd; background: none; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; }
  .variant-btn.active { border-color: #1C1C1C; background: #1C1C1C; color: #fff; }
  .variant-btn:hover:not(.active) { border-color: #888; }
  .cat-btn { padding: 8px 16px; font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; border: 1px solid #ddd; background: none; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; white-space: nowrap; }
  .cat-btn.active { background: #1C1C1C; color: #fff; border-color: #1C1C1C; }
  .cat-btn:hover:not(.active) { border-color: #999; }
  .product-img-thumb { width: 64px; height: 64px; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; }
  .product-img-thumb.active { border-color: #1C1C1C; }
  .divider { height: 1px; background: #EBEBEB; }
  .progress-bar { height: 3px; background: #eee; border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: #C8963E; border-radius: 2px; transition: width 0.3s; }
  .checkout-step { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
  .step-num { width: 24px; height: 24px; border: 1px solid #1C1C1C; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; }
  .step-num.done { background: #1C1C1C; color: #fff; border-color: #1C1C1C; }
  @media (max-width: 768px) {
    .drawer { width: 100%; }
    .modal-box { max-height: 100vh; }
    .hero-grid { grid-template-columns: 1fr !important; }
    .shop-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
    .product-detail-grid { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; }
    .about-grid { grid-template-columns: 1fr !important; }
    .bundle-grid { grid-template-columns: 1fr !important; }
    .toast-wrap { right: 12px; bottom: 12px; left: 12px; }
    .toast { min-width: unset; }
  }
`;
