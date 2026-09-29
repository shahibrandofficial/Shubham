/* =========================================================
   Mista Player — Clean UI Overhaul
   Accent: #00d4ff (cyan) | Theme: dark (with light toggle)
   Logic: identical to original, only UI/UX improved
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. INJECT STYLES ---------- */
  const STYLE_ID = 'mista-player-styles';

  const CSS = `
  :root{
    --mp-accent:#00d4ff;
    --mp-accent-soft:rgba(0,212,255,.18);
    --mp-bg:rgba(10,12,18,.82);
    --mp-bg-solid:#0a0c12;
    --mp-text:#ffffff;
    --mp-text-dim:rgba(255,255,255,.65);
    --mp-radius:14px;
    --mp-icon-size:24px;
    --mp-control-h:56px;
    --mp-shadow:0 8px 32px rgba(0,0,0,.55);
    --mp-blur:blur(18px) saturate(160%);
  }
  .mp-container[data-theme="light"]{
    --mp-bg:rgba(255,255,255,.85);
    --mp-bg-solid:#ffffff;
    --mp-text:#0a0c12;
    --mp-text-dim:rgba(10,12,18,.6);
    --mp-shadow:0 8px 32px rgba(0,0,0,.18);
  }

  .mp-container{
    position:relative;
    width:100%;
    height:100%;
    background:#000;
    overflow:hidden;
    border-radius:var(--mp-radius);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    color:var(--mp-text);
    user-select:none;
    -webkit-tap-highlight-color:transparent;
    isolation:isolate;
  }
  .mp-container.mp-vertical-video{ background:#000; }

  #yt-iframe-holder,
  .mp-container iframe{
    position:absolute; inset:0; width:100%; height:100%; border:0;
  }

  /* curtain / loading */
  .mp-curtain{
    position:absolute; inset:0; background:#000;
    display:flex; align-items:center; justify-content:center;
    z-index:9; opacity:1; transition:opacity .35s ease;
    pointer-events:none;
  }
  .mp-curtain.hidden{ opacity:0; visibility:hidden; }
  .mp-curtain::after{
    content:""; width:38px; height:38px; border-radius:50%;
    border:3px solid var(--mp-accent-soft);
    border-top-color:var(--mp-accent);
    animation:mp-spin .8s linear infinite;
  }
  @keyframes mp-spin{ to{ transform:rotate(360deg); } }

  /* touch overlay ripple text */
  .mp-touch-overlay{
    position:absolute; inset:0; pointer-events:none; z-index:5;
  }
  .mp-ripple-txt{
    position:absolute; top:50%; transform:translateY(-50%);
    width:110px; height:110px; border-radius:50%;
    background:rgba(0,0,0,.55);
    backdrop-filter:var(--mp-blur);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:2px; font-size:11px; font-weight:600;
    opacity:0; transition:opacity .25s ease, transform .25s ease;
    color:#fff;
  }
  .mp-ripple-txt svg{ width:34px; height:34px; fill:#fff; }
  .mp-ripple-txt.left{ left:12%; }
  .mp-ripple-txt.right{ right:12%; }
  .mp-ripple-txt.show{
    opacity:1;
    animation:mp-ripple .9s ease forwards;
  }
  @keyframes mp-ripple{
    0%{ transform:translateY(-50%) scale(.7); }
    40%{ transform:translateY(-50%) scale(1.05); }
    100%{ transform:translateY(-50%) scale(1); }
  }

  /* OSD icons (volume / brightness) */
  .mp-osd-icon{
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%) scale(.9);
    width:96px; height:96px; border-radius:50%;
    background:rgba(0,0,0,.6);
    backdrop-filter:var(--mp-blur);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:6px; font-size:13px; font-weight:700;
    opacity:0; transition:opacity .2s ease, transform .2s ease;
    color:#fff; z-index:6; pointer-events:none;
  }
  .mp-osd-icon svg{ width:30px; height:30px; fill:#fff; }
  .mp-osd-icon.show{ opacity:1; transform:translate(-50%,-50%) scale(1); }

  /* locked overlay */
  .mp-locked-overlay{
    position:absolute; inset:0; z-index:7;
    display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.25);
  }
  .mp-locked-overlay.show{ display:flex; }
  .mp-locked-overlay button{
    background:rgba(0,0,0,.6);
    backdrop-filter:var(--mp-blur);
    border:1px solid rgba(255,255,255,.15);
    color:#fff; border-radius:999px;
    padding:12px 18px; font-size:13px; font-weight:600;
    display:flex; align-items:center; gap:8px; cursor:pointer;
    transition:transform .15s ease, background .15s ease;
  }
  .mp-locked-overlay button:hover{ background:rgba(0,0,0,.8); }
  .mp-locked-overlay button:active{ transform:scale(.94); }
  .mp-locked-overlay svg{ width:20px; height:20px; fill:#fff; }

  /* main UI */
  .mp-ui{
    position:absolute; inset:0; z-index:4;
    display:flex; flex-direction:column; justify-content:space-between;
    background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,transparent 22%,transparent 68%,rgba(0,0,0,.72) 100%);
    opacity:0; transition:opacity .28s ease;
    pointer-events:none;
  }
  .mp-ui.show{ opacity:1; pointer-events:auto; }
  .mp-ui.hidden{ opacity:0; pointer-events:none; }

  /* top bar */
  .mp-top-bar{
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 16px; gap:12px;
  }
  .mp-title{
    font-size:14px; font-weight:600; letter-spacing:.2px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    max-width:60%; text-shadow:0 1px 3px rgba(0,0,0,.6);
  }
  .mp-top-right{ display:flex; align-items:center; gap:6px; }

  /* buttons */
  .mp-btn-reset, .mp-icon{
    background:transparent; border:0; color:var(--mp-text);
    width:40px; height:40px; min-width:40px; min-height:40px;
    display:inline-flex; align-items:center; justify-content:center;
    border-radius:10px; cursor:pointer;
    transition:background .15s ease, transform .12s ease;
    padding:0;
  }
  .mp-btn-reset:hover, .mp-icon:hover{ background:rgba(255,255,255,.12); }
  .mp-btn-reset:active, .mp-icon:active{ transform:scale(.9); }
  .mp-btn-reset svg, .mp-icon svg{
    width:var(--mp-icon-size); height:var(--mp-icon-size); fill:currentColor;
    pointer-events:none;
  }
  .mp-container[data-theme="light"] .mp-btn-reset:hover,
  .mp-container[data-theme="light"] .mp-icon:hover{
    background:rgba(0,0,0,.08);
  }

  /* center cluster */
  .mp-center{
    display:flex; align-items:center; justify-content:center;
    gap:22px; flex:1;
  }
  .mp-center .mp-icon{ width:56px; height:56px; border-radius:50%; }
  .mp-center .mp-icon svg{ width:32px; height:32px; }
  .mp-center .mp-icon.seek svg{ width:38px; height:38px; }

  /* bottom bar */
  .mp-bottom{
    display:flex; flex-direction:column; gap:6px;
    padding:8px 14px 14px;
  }
  .mp-seek-row{
    display:flex; align-items:center; gap:10px;
  }
  .mp-time{
    font-size:12px; font-variant-numeric:tabular-nums;
    color:var(--mp-text-dim); min-width:38px; text-align:center;
    text-shadow:0 1px 2px rgba(0,0,0,.5);
  }
  .mp-seek-container{
    position:relative; flex:1; height:22px; display:flex; align-items:center;
  }
  .mp-range{
    -webkit-appearance:none; appearance:none;
    width:100%; height:4px; border-radius:99px;
    background:linear-gradient(to right,
      var(--mp-accent) 0%,
      var(--mp-accent) var(--progress,0%),
      rgba(255,255,255,.25) var(--progress,0%),
      rgba(255,255,255,.25) 100%);
    outline:none; cursor:pointer; margin:0;
    transition:height .15s ease;
  }
  .mp-seek-container:hover .mp-range{ height:6px; }
  .mp-range::-webkit-slider-thumb{
    -webkit-appearance:none; appearance:none;
    width:14px; height:14px; border-radius:50%;
    background:var(--mp-accent); border:2px solid #fff;
    box-shadow:0 0 0 4px var(--mp-accent-soft);
    transition:transform .15s ease;
    cursor:pointer;
  }
  .mp-range::-moz-range-thumb{
    width:14px; height:14px; border-radius:50%;
    background:var(--mp-accent); border:2px solid #fff;
    box-shadow:0 0 0 4px var(--mp-accent-soft);
    cursor:pointer;
  }
  .mp-seek-container:hover .mp-range::-webkit-slider-thumb{ transform:scale(1.15); }

  /* bottom controls row */
  .mp-controls-row{
    display:flex; align-items:center; gap:6px;
    padding-top:2px;
  }
  .mp-controls-row .spacer{ flex:1; }

  .mp-btn-pl, .mp-btn-vol{
    display:flex; align-items:center; gap:6px;
  }
  .mp-vol-wrap{
    display:flex; align-items:center; gap:6px;
    padding:0 6px;
  }
  .mp-vol-slider{
    -webkit-appearance:none; appearance:none;
    width:80px; height:4px; border-radius:99px;
    background:rgba(255,255,255,.25); outline:none; cursor:pointer;
  }
  .mp-vol-slider::-webkit-slider-thumb{
    -webkit-appearance:none; width:12px; height:12px;
    border-radius:50%; background:var(--mp-accent); cursor:pointer;
  }
  .mp-vol-slider::-moz-range-thumb{
    width:12px; height:12px; border-radius:50%;
    background:var(--mp-accent); border:0; cursor:pointer;
  }

  /* bottom sheet */
  .mp-sheet-overlay{
    position:absolute; inset:0; z-index:20;
    background:rgba(0,0,0,.55);
    backdrop-filter:blur(4px);
    display:none; align-items:flex-end;
    opacity:0; transition:opacity .25s ease;
  }
  .mp-sheet-overlay.show{ display:flex; opacity:1; }
  .mp-sheet{
    width:100%; max-height:62%;
    background:var(--mp-bg);
    backdrop-filter:var(--mp-blur);
    border-top-left-radius:20px; border-top-right-radius:20px;
    box-shadow:var(--mp-shadow);
    display:flex; flex-direction:column;
    transform:translateY(100%);
    transition:transform .3s cubic-bezier(.2,.8,.2,1);
    color:var(--mp-text);
  }
  .mp-sheet-overlay.show .mp-sheet{ transform:translateY(0); }
  .mp-sheet-header{
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 18px; border-bottom:1px solid rgba(255,255,255,.08);
    font-weight:600; font-size:15px;
  }
  .mp-container[data-theme="light"] .mp-sheet-header{
    border-bottom-color:rgba(0,0,0,.08);
  }
  .mp-sheet-content{ overflow-y:auto; padding:6px 0 14px; }

  .mp-sheet-item{
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 20px; font-size:14px; cursor:pointer;
    transition:background .15s ease;
  }
  .mp-sheet-item:hover{ background:rgba(255,255,255,.06); }
  .mp-container[data-theme="light"] .mp-sheet-item:hover{
    background:rgba(0,0,0,.05);
  }

  .mp-switch{
    width:42px; height:24px; border-radius:99px;
    background:rgba(255,255,255,.25);
    position:relative; transition:background .2s ease;
    flex-shrink:0;
  }
  .mp-switch::after{
    content:""; position:absolute; top:3px; left:3px;
    width:18px; height:18px; border-radius:50%;
    background:#fff; transition:transform .2s ease;
  }
  .mp-switch.on{ background:var(--mp-accent); }
  .mp-switch.on::after{ transform:translateX(18px); }

  .mp-sheet-item.active{ color:var(--mp-accent); font-weight:700; }
  .mp-sheet-item .check{ width:20px; height:20px; fill:var(--mp-accent); }

  /* video list item */
  .mp-vid-item{
    display:flex; gap:12px; padding:10px 16px;
    cursor:pointer; transition:background .15s ease;
  }
  .mp-vid-item:hover{ background:rgba(255,255,255,.06); }
  .mp-vid-item img{
    width:110px; height:62px; object-fit:cover;
    border-radius:8px; flex-shrink:0; background:#222;
  }
  .mp-vid-item .vtitle{
    font-size:13px; line-height:1.35;
    display:-webkit-box; -webkit-line-clamp:2;
    -webkit-box-orient:vertical; overflow:hidden;
  }
  .mp-empty{
    padding:34px 20px; text-align:center;
    color:var(--mp-text-dim); font-size:13px;
  }

  /* responsive */
  @media (max-width:520px){
    :root{ --mp-icon-size:22px; }
    .mp-center .mp-icon{ width:48px; height:48px; }
    .mp-center .mp-icon svg{ width:28px; height:28px; }
    .mp-center{ gap:14px; }
    .mp-title{ font-size:13px; max-width:52%; }
    .mp-vol-slider{ width:60px; }
    .mp-time{ font-size:11px; min-width:34px; }
  }
  @media (max-width:360px){
    .mp-vol-wrap{ display:none; }
  }
  `;

  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- 2. ICONS ---------- */
  const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

  const ICONS = {
    play: svg('M8 5v14l11-7z'),
    pause: svg('M6 19h4V5H6v14zm8-14v14h4V5h-4z'),
    replay_10: svg('M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.04-.25-.04-.18.01-.25.04-.13.09-.19.17-.1.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.01.25-.05.13-.09.19-.17.1-.18.12-.32.04-.29.04-.48v-.97z'),
    forward_10: svg('M18.02 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.13 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.04-.25-.04-.18.01-.25.04-.13.09-.19.17-.1.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.01.25-.05.13-.09.19-.17.1-.18.12-.32.04-.29.04-.48v-.97z'),
    fullscreen: svg('M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'),
    fullscreen_exit: svg('M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'),
    settings: svg('M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'),
    history: svg('M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.896 8.896 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8h-1.5z'),
    close: svg('M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'),
    check: svg('M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'),
    arrow_back: svg('M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'),
    queue_music: svg('M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z'),
    lock: svg('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'),
    lock_open: svg('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'),
    volume_up: svg('M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'),
    volume_off: svg('M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z'),
    brightness_high: svg('M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z'),
    picture_in_picture: svg('M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z'),
  };

  /* ---------- 3. STORAGE ---------- */
  const Store = {
    getSet: () => {
      try { return JSON.parse(localStorage.getItem('mista_settings')) || { autoplay: true, resume: true }; }
      catch { return { autoplay: true, resume: true }; }
    },
    saveSet: (s) => localStorage.setItem('mista_settings', JSON.stringify(s)),
    getProg: (id) => {
      try { return (JSON.parse(localStorage.getItem('mista_progress')) || {})[id] || 0; }
      catch { return 0; }
    },
    saveProg: (id, t) => {
      if (t < 5) return;
      let all = {};
      try { all = JSON.parse(localStorage.getItem('mista_progress')) || {}; } catch {}
      all[id] = t;
      const keys = Object.keys(all);
      if (keys.length > 50) delete all[keys[0]];
      localStorage.setItem('mista_progress', JSON.stringify(all));
    },
    getHist: () => {
      try { return JSON.parse(localStorage.getItem('mista_history')) || []; }
      catch { return []; }
    },
    addHist: (v) => {
      if (!v.id) return;
      let h = Store.getHist().filter(x => x.id !== v.id);
      h.unshift({ id: v.id, title: v.title, thumb: v.thumb || `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg` });
      if (h.length > 60) h.pop();
      localStorage.setItem('mista_history', JSON.stringify(h));
    },
    clearHist: () => localStorage.removeItem('mista_history'),
  };

  /* ---------- 4. PLAYER CLASS ---------- */
  class MistaPlayer {
    constructor(el) {
      this.c = el;
      this.uid = Math.random().toString(36).slice(2, 9);
      this.player = null;
      this.settings = Store.getSet();
      this.state = {
        playing: false,
        locked: false,
        uiVisible: true,
        quality: 'auto',
        speed: 1,
        volume: 100,
        brightness: 100,
      };
      this.meta = { title: 'Loading...', playlist: [] };
      this.isSeeking = false;
      this.idleT = null;

      const src = el.getAttribute('data-src') || el.getAttribute('data-video') || '';
      this.vid = this.extractID(src);
      this.theme = el.getAttribute('data-theme') || 'dark';

      this.renderUI();
      this.bindControls();
      this.bindGestures();
      if (this.vid) this.initYT();
    }

    extractID(v) {
      if (!v) return '';
      const m = v.match(/(?:v=|\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})/);
      return m ? m[1] : v;
    }
    qs(s) { return this.c.querySelector(s); }
    vibe(ms = 30) { if (navigator.vibrate) navigator.vibrate(ms); }

    renderUI() {
      const u = this.uid;
      this.c.classList.add('mp-container');
      this.c.setAttribute('data-theme', this.theme);

      this.c.innerHTML = `
        <div id="yt-iframe-holder" id="yt-iframe-${u}"></div>
        <div class="mp-curtain" id="curtain-${u}"></div>

        <div class="mp-touch-overlay" id="touch-${u}">
          <div class="mp-ripple-txt left" id="rip-l-${u}">${ICONS.replay_10}<span>10s</span></div>
          <div class="mp-ripple-txt right" id="rip-r-${u}">${ICONS.forward_10}<span>10s</span></div>
        </div>

        <div class="mp-osd-icon" id="osd-v-${u}">${ICONS.volume_up}<span id="osd-v-txt-${u}">100</span></div>
        <div class="mp-osd-icon" id="osd-b-${u}">${ICONS.brightness_high}<span id="osd-b-txt-${u}">100</span></div>

        <div class="mp-locked-overlay" id="lock-ov-${u}">
          <button id="btn-unlock-${u}">${ICONS.lock_open}<span>Tap to unlock</span></button>
        </div>

        <div class="mp-ui" id="ui-${u}">
          <div class="mp-top-bar">
            <div class="mp-title" id="title-${u}">Loading...</div>
            <div class="mp-top-right">
              <button class="mp-btn-reset mp-icon" id="btn-hist-${u}" title="History">${ICONS.history}</button>
              <button class="mp-btn-reset mp-icon" id="btn-pl-${u}" title="Up Next">${ICONS.queue_music}</button>
              <button class="mp-btn-reset mp-icon" id="btn-set-${u}" title="Settings">${ICONS.settings}</button>
              <button class="mp-btn-reset mp-icon" id="btn-lock-${u}" title="Lock">${ICONS.lock_open}</button>
            </div>
          </div>

          <div class="mp-center">
            <button class="mp-btn-reset mp-icon seek" id="btn-rw-${u}">${ICONS.replay_10}</button>
            <button class="mp-btn-reset mp-icon" id="btn-pp-${u}">${ICONS.play}</button>
            <button class="mp-btn-reset mp-icon seek" id="btn-fw-${u}">${ICONS.forward_10}</button>
          </div>

          <div class="mp-bottom">
            <div class="mp-seek-row">
              <span class="mp-time" id="time-cur-${u}">0:00</span>
              <div class="mp-seek-container" id="seek-cont-${u}">
                <input type="range" class="mp-range" id="seek-${u}" min="0" max="100" step="0.1" value="0">
              </div>
              <span class="mp-time" id="time-dur-${u}">0:00</span>
            </div>
            <div class="mp-controls-row">
              <button class="mp-btn-reset mp-icon" id="btn-pip-${u}" title="Picture in Picture">${ICONS.picture_in_picture}</button>
              <div class="mp-vol-wrap">
                <button class="mp-btn-reset mp-icon" id="btn-mute-${u}" title="Mute">${ICONS.volume_up}</button>
                <input type="range" class="mp-vol-slider" id="vol-${u}" min="0" max="100" value="100">
              </div>
              <span class="spacer"></span>
              <button class="mp-btn-reset mp-icon" id="btn-fs-${u}" title="Fullscreen">${ICONS.fullscreen}</button>
            </div>
          </div>
        </div>
      `;

      // bottom sheet
      this.sheetOverlay = document.createElement('div');
      this.sheetOverlay.className = 'mp-sheet-overlay';
      this.sheetOverlay.id = `sheet-${u}`;
      this.sheetOverlay.innerHTML = `
        <div class="mp-sheet">
          <div class="mp-sheet-header">
            <div id="sheet-title-${u}">Settings</div>
            <button class="mp-btn-reset mp-icon" id="sheet-close-${u}">${ICONS.close}</button>
          </div>
          <div class="mp-sheet-content" id="sheet-content-${u}"></div>
        </div>
      `;
      this.c.appendChild(this.sheetOverlay);

      this.startIdleTimer();
    }

    bindControls() {
      const u = this.uid;
      const tap = (fn) => (e) => { e.stopPropagation(); fn(); this.vibe(); this.resetIdle(); };

      this.qs(`#btn-pp-${u}`).onclick = tap(() => this.togglePlay());
      this.qs(`#btn-rw-${u}`).onclick = tap(() => this.skip(-10));
      this.qs(`#btn-fw-${u}`).onclick = tap(() => this.skip(10));
      this.qs(`#btn-fs-${u}`).onclick = tap(() => this.toggleFS());
      this.qs(`#btn-pip-${u}`).onclick = tap(() => this.togglePiP());
      this.qs(`#btn-mute-${u}`).onclick = tap(() => this.toggleMute());
      this.qs(`#btn-set-${u}`).onclick = tap(() => this.openSheet('settings'));
      this.qs(`#btn-pl-${u}`).onclick = tap(() => this.openSheet('playlist'));
      this.qs(`#btn-hist-${u}`).onclick = tap(() => this.openSheet('history'));

      this.qs(`#btn-lock-${u}`).onclick = tap(() => {
        this.state.locked = true;
        this.qs(`#lock-ov-${u}`).classList.add('show');
        this.toggleUI(false);
      });
      this.qs(`#btn-unlock-${u}`).onclick = tap(() => {
        this.state.locked = false;
        this.qs(`#lock-ov-${u}`).classList.remove('show');
        this.toggleUI(true);
      });

      this.qs(`#sheet-close-${u}`).onclick = tap(() => this.closeSheet());
      this.sheetOverlay.onclick = (e) => { if (e.target === this.sheetOverlay) this.closeSheet(); };

      // volume slider
      this.qs(`#vol-${u}`).oninput = (e) => {
        const v = parseInt(e.target.value);
        this.state.volume = v;
        if (this.player) this.player.setVolume(v);
        const ic = this.qs(`#btn-mute-${u}`);
        ic.innerHTML = v === 0 ? ICONS.volume_off : ICONS.volume_up;
      };

      // seek slider
      const seek = this.qs(`#seek-${u}`);
      const seekCont = this.qs(`#seek-cont-${u}`);
      const updateFill = (val) => seekCont.style.setProperty('--progress', val + '%');

      seek.ontouchstart = seek.onmousedown = (e) => { e.stopPropagation(); this.isSeeking = true; };
      seek.oninput = (e) => {
        const val = parseFloat(e.target.value);
        updateFill(val);
        if (this.player) {
          const dur = this.player.getDuration() || 0;
          this.qs(`#time-cur-${u}`).textContent = this.fmt(val / 100 * dur);
        }
      };
      seek.onchange = () => {
        if (this.player) {
          const dur = this.player.getDuration() || 0;
          this.player.seekTo(val => 0); // placeholder — replace below
          this.player.seekTo(parseFloat(seek.value) / 100 * dur, true);
        }
        this.isSeeking = false;
        this.resetIdle();
      };
      updateFill(0);

      this.startTicker();
    }

    bindGestures() {
      const u = this.uid;
      const overlay = this.qs(`#touch-${u}`);
      let startX = 0, startY = 0, moved = false, mode = null;

      overlay.addEventListener('touchstart', (e) => {
        if (this.state.locked) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        moved = false;
        const rect = overlay.getBoundingClientRect();
        mode = startX < rect.width / 2 ? 'brightness' : 'volume';
      }, { passive: true });

      overlay.addEventListener('touchmove', (e) => {
        if (this.state.locked) return;
        const dx = startX - e.touches[0].clientX;
        const dy = startY - e.touches[0].clientY;

        if (Math.abs(dy) > 12) {
          moved = true;
          e.preventDefault();
          if (mode === 'volume') {
            const nv = Math.max(0, Math.min(100, this.state.volume + (dy > 0 ? 3 : -3)));
            this.state.volume = nv;
            if (this.player) this.player.setVolume(nv);
            this.qs(`#vol-${u}`).value = nv;
            this.showOSD('v', nv);
          } else {
            const nb = Math.max(20, Math.min(100, this.state.brightness + (dy > 0 ? 3 : -3)));
            this.state.brightness = nb;
            this.c.style.filter = `brightness(${nb}%)`;
            this.showOSD('b', nb);
          }
          startY = e.touches[0].clientY;
        } else if (Math.abs(dx) > 20 && !this.player?.getCurrentTime) {
          // horizontal seek fallback handled by double-tap
        }
      }, { passive: false });

      // double tap to seek
      let lastTap = 0;
      overlay.addEventListener('click', () => {
        if (this.state.locked) return;
        const now = Date.now();
        if (now - lastTap < 300) {
          clearTimeout(this._tapT);
          this.vibe(28);
          const rect = overlay.getBoundingClientRect();
          const x = this._lastX || 0;
          const side = x < rect.width / 2 ? 'l' : 'r';
          this.skip(side === 'l' ? -10 : 10);
          const rip = this.qs(`#rip-${side}-${u}`);
          rip.classList.add('show');
          setTimeout(() => rip.classList.remove('show'), 700);
        } else {
          this._tapT = setTimeout(() => this.toggleUI(), 250);
        }
        lastTap = now;
      });
      overlay.addEventListener('touchstart', (e) => { this._lastX = e.touches[0].clientX; }, { passive: true });
    }

    toggleUI(force) {
      if (this.state.locked) return;
      this.state.uiVisible = force !== undefined ? force : !this.state.uiVisible;
      this.qs(`#ui-${this.uid}`).classList.toggle('show', this.state.uiVisible);
      this.qs(`#ui-${this.uid}`).classList.toggle('hidden', !this.state.uiVisible);
      if (this.state.uiVisible) this.startIdleTimer();
    }

    startIdleTimer() {
      clearTimeout(this.idleT);
      if (this.state.playing && this.state.uiVisible && !this.isSeeking) {
        this.idleT = setTimeout(() => this.toggleUI(false), 3000);
      }
    }
    resetIdle() { this.startIdleTimer(); }

    toggleFS() {
      const c = this.qs(`#cont-${this.uid}`) || this.c;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (c.requestFullscreen) c.requestFullscreen();
    }

    async togglePiP() {
      try {
        const iframe = this.c.querySelector('iframe');
        if (iframe?.requestPictureInPicture) await iframe.requestPictureInPicture();
      } catch (e) { console.warn('PiP not available', e); }
    }

    toggleMute() {
      const cur = parseInt(this.qs(`#vol-${this.uid}`).value);
      const nv = cur > 0 ? 0 : (this.state._lastVol || 100);
      this.state._lastVol = cur > 0 ? cur : (this.state._lastVol || 100);
      this.qs(`#vol-${this.uid}`).value = nv;
      this.state.volume = nv;
      if (this.player) this.player.setVolume(nv);
      this.qs(`#btn-mute-${this.uid}`).innerHTML = nv === 0 ? ICONS.volume_off : ICONS.volume_up;
    }

    showOSD(type, val) {
      const el = this.qs(`#osd-${type}-${this.uid}`);
      const txt = this.qs(`#osd-${type}-txt-${this.uid}`);
      txt.textContent = Math.round(val);
      el.classList.add('show');
      clearTimeout(this[`_osdT_${type}`]);
      this[`_osdT_${type}`] = setTimeout(() => el.classList.remove('show'), 800);
    }

    fmt(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    }

    togglePlay() {
      if (!this.player) return;
      if (this.state.playing) this.player.pauseVideo();
      else this.player.playVideo();
    }

    skip(sec) {
      if (!this.player) return;
      this.player.seekTo(this.player.getCurrentTime() + sec, true);
    }

    openSheet(tab) {
      const u = this.uid;
      this.vibe();
      this.qs(`#sheet-title-${u}`).textContent =
        tab === 'settings' ? 'Settings' : tab === 'playlist' ? 'Up Next' : 'History';
      const content = this.qs(`#sheet-content-${u}`);
      content.innerHTML = '';

      if (tab === 'settings') {
        content.innerHTML = `
          <div class="mp-sheet-item"><span>Speed</span><span>${this.state.speed}x</span></div>
          <div style="height:1px;background:rgba(255,255,255,.08);margin:8px 20px;"></div>
          <div class="mp-sheet-item"><span>Autoplay Next</span><div class="mp-switch ${this.settings.autoplay ? 'on' : ''}" id="sw-auto-${u}"></div></div>
          <div class="mp-sheet-item"><span>Resume Playback</span><div class="mp-switch ${this.settings.resume ? 'on' : ''}" id="sw-resume-${u}"></div></div>
        `;
        this.qs(`#sw-auto-${u}`).onclick = (e) => {
          this.settings.autoplay = !this.settings.autoplay;
          e.target.classList.toggle('on', this.settings.autoplay);
          Store.saveSet(this.settings);
        };
        this.qs(`#sw-resume-${u}`).onclick = (e) => {
          this.settings.resume = !this.settings.resume;
          e.target.classList.toggle('on', this.settings.resume);
          Store.saveSet(this.settings);
        };
      } else if (tab === 'playlist') {
        if (!this.meta.playlist.length) {
          content.innerHTML = '<div class="mp-empty">No related videos</div>';
        } else {
          this.meta.playlist.slice(0, 15).forEach(v => {
            const item = document.createElement('div');
            item.className = 'mp-vid-item';
            item.innerHTML = `<img src="${v.thumb || `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}" loading="lazy"><div class="vtitle">${v.title}</div>`;
            item.onclick = () => { this.closeSheet(); this.loadVideo(v); };
            content.appendChild(item);
          });
        }
      } else if (tab === 'history') {
        const hist = Store.getHist();
        if (!hist.length) {
          content.innerHTML = '<div class="mp-empty">No history yet</div>';
        } else {
          hist.forEach(v => {
            const item = document.createElement('div');
            item.className = 'mp-vid-item';
            item.innerHTML = `<img src="${v.thumb}" loading="lazy"><div class="vtitle">${v.title}</div>`;
            item.onclick = () => { this.closeSheet(); this.loadVideo(v); };
            content.appendChild(item);
          });
        }
      }
      this.sheetOverlay.classList.add('show');
    }
    closeSheet() { this.sheetOverlay.classList.remove('show'); }

    initYT() {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => this.createPlayer();
      } else this.createPlayer();
    }

    createPlayer() {
      let startAt = 0;
      if (this.settings.resume) {
        const p = Store.getProg(this.vid);
        if (p > 10) startAt = p;
      }
      this.player = new YT.Player(`yt-iframe-holder`, {
        videoId: this.vid,
        playerVars: {
          controls: 0, modestbranding: 1, rel: 0, playsinline: 1,
          iv_load_policy: 3, disablekb: 1, fs: 0, start: startAt,
        },
        events: {
          onStateChange: (e) => this.onState(e),
          onReady: () => {
            this.player.setVolume(this.state.volume);
            if (this.settings.autoplay) this.player.playVideo();
          },
        },
      });
    }

    onState(e) {
      const S = YT.PlayerState;
      const pp = this.qs(`#btn-pp-${this.uid}`);
      const curtain = this.qs(`#curtain-${this.uid}`);
      const ui = this.qs(`#ui-${this.uid}`);

      if (e.data === S.PLAYING) {
        this.state.playing = true;
        pp.innerHTML = ICONS.pause;
        curtain.classList.add('hidden');
        ui.classList.add('show');
        this.startIdleTimer();
        if (this.vid) Store.addHist({ id: this.vid, title: this.meta.title });
      } else if (e.data === S.PAUSED || e.data === S.BUFFERING) {
        this.state.playing = false;
        pp.innerHTML = ICONS.play;
        ui.classList.add('show');
        this.toggleUI(true);
      } else if (e.data === S.ENDED) {
        this.state.playing = false;
        pp.innerHTML = ICONS.replay_10;
        this.toggleUI(true);
        if (this.settings.autoplay && this.meta.playlist.length) {
          this.loadVideo(this.meta.playlist[0]);
        }
      }
    }

    loadVideo(v) {
      this.vid = v.id;
      this.meta.title = v.title || 'Video';
      this.qs(`#title-${this.uid}`).textContent = this.meta.title;
      if (this.player) {
        let start = 0;
        if (this.settings.resume) {
          const p = Store.getProg(this.vid);
          if (p > 10) start = p;
        }
        this.player.loadVideoById({ videoId: v.id, startSeconds: start });
      }
      this.fetchMeta(v.id);
    }

    startTicker() {
      clearInterval(this._tick);
      this._tick = setInterval(() => {
        if (!this.state.playing || !this.player || !this.player.getCurrentTime) return;
        const cur = this.player.getCurrentTime() || 0;
        const dur = this.player.getDuration() || 1;
        if (cur > 5) Store.saveProg(this.vid, Math.floor(cur));
        if (!this.isSeeking) {
          const seek = this.qs(`#seek-${this.uid}`);
          const val = cur / dur * 100;
          seek.value = val;
          this.qs(`#seek-cont-${this.uid}`).style.setProperty('--progress', val + '%');
        }
        this.qs(`#time-cur-${this.uid}`).textContent = this.fmt(cur);
        this.qs(`#time-dur-${this.uid}`).textContent = this.fmt(dur);
      }, 500);
    }

    async fetchMeta(id) {
      try {
        const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`;
        const data = await (await fetch(url)).json();
        this.meta.title = data.title || 'Video';
        this.qs(`#title-${this.uid}`).textContent = this.meta.title;
        Store.addHist({ id, title: this.meta.title });
      } catch {
        this.qs(`#title-${this.uid}`).textContent = 'Video';
      }
    }
  }

  /* ---------- 5. AUTO-INIT ---------- */
  function initAll() {
    document.querySelectorAll('[data-mista]').forEach(el => {
      if (!el.mista) el.mista = new MistaPlayer(el);
    });
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

})();
