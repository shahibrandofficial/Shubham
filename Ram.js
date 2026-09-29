/* =========================================================
   MISTA PLAYER — VIP EDITION
   Premium UI | Fullscreen Landscape | Fit/Fill | All Features
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. VIP STYLES
     ========================================================= */
  const STYLE_ID = 'mista-vip-style';
  const CSS = `
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{
    width:100%;height:100%;background:#000;overflow:hidden;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    color:#fff;-webkit-tap-highlight-color:transparent;
    user-select:none;-webkit-user-select:none;
  }

  /* ===== CONTAINER ===== */
  .mp-container{
    position:absolute;top:0;left:0;
    width:100%;height:100%;
    background:#000;overflow:hidden;
    border-radius:0 !important;
    isolation:isolate;
  }

  /* ===== VIDEO ===== */
  .mp-container #yt-iframe-holder,
  .mp-container iframe{
    position:absolute;top:0;left:0;
    width:100% !important;height:100% !important;
    border:0;background:#000;
    object-fit:contain;
  }
  .mp-container.mp-fill iframe{
    object-fit:cover;
  }

  /* ===== LOADING CURTAIN ===== */
  .mp-curtain{
    position:absolute;top:0;left:0;right:0;bottom:0;
    background:radial-gradient(circle at center,#1a1a2e 0%,#000 80%);
    display:flex;align-items:center;justify-content:center;
    z-index:9;transition:opacity .4s,visibility .4s;pointer-events:none;
  }
  .mp-curtain.hide{opacity:0;visibility:hidden;}
  .mp-curtain::after{
    content:"";width:56px;height:56px;border-radius:50%;
    border:3px solid rgba(0,212,255,.15);
    border-top-color:#00d4ff;
    border-right-color:#7c3aed;
    animation:mp-spin .9s linear infinite;
    box-shadow:0 0 30px rgba(0,212,255,.4);
  }
  @keyframes mp-spin{to{transform:rotate(360deg);}}
  .mp-curtain::before{
    content:"MISTA";position:absolute;bottom:38%;
    font-size:12px;letter-spacing:8px;font-weight:800;
    background:linear-gradient(90deg,#00d4ff,#7c3aed);
    -webkit-background-clip:text;background-clip:text;
    color:transparent;
  }

  /* ===== MAIN UI ===== */
  .mp-ui{
    position:absolute;top:0;left:0;right:0;bottom:0;z-index:4;
    display:flex;flex-direction:column;justify-content:space-between;
    background:linear-gradient(180deg,
      rgba(0,0,0,.75) 0%,
      transparent 22%,
      transparent 68%,
      rgba(0,0,0,.85) 100%);
    opacity:0;transition:opacity .3s;pointer-events:none;
  }
  .mp-ui.show{opacity:1;pointer-events:auto;}

  /* ===== TOP BAR ===== */
  .mp-top{
    display:flex;align-items:center;justify-content:space-between;
    padding:14px 18px;gap:12px;
  }
  .mp-title{
    font-size:14px;font-weight:600;
    max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    text-shadow:0 2px 8px rgba(0,0,0,.9);
    letter-spacing:.2px;
  }
  .mp-top-right{display:flex;gap:2px;}

  /* ===== BUTTONS ===== */
  .mp-btn{
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.08);
    color:#fff;
    width:42px;height:42px;min-width:42px;min-height:42px;
    display:inline-flex;align-items:center;justify-content:center;
    border-radius:12px;cursor:pointer;padding:0;
    transition:all .2s cubic-bezier(.2,.8,.2,1);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
  }
  .mp-btn:hover{
    background:rgba(0,212,255,.15);
    border-color:rgba(0,212,255,.4);
    transform:translateY(-1px);
  }
  .mp-btn:active{transform:scale(.92);}
  .mp-btn svg{width:22px;height:22px;fill:currentColor;pointer-events:none;}

  /* ===== CENTER CONTROLS ===== */
  .mp-center{
    display:flex;align-items:center;justify-content:center;
    gap:32px;flex:1;
  }
  .mp-center .mp-btn{
    width:68px;height:68px;border-radius:50%;
    background:rgba(255,255,255,.1);
    border:2px solid rgba(255,255,255,.2);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    box-shadow:0 8px 32px rgba(0,0,0,.5);
  }
  .mp-center .mp-btn:hover{
    background:rgba(0,212,255,.2);
    border-color:#00d4ff;
    box-shadow:0 0 40px rgba(0,212,255,.5);
    transform:scale(1.05);
  }
  .mp-center .mp-btn svg{width:36px;height:36px;}
  .mp-center .mp-btn#btn-pp-XXXXX{
    background:linear-gradient(135deg,#00d4ff,#7c3aed);
    border:0;
    box-shadow:0 8px 32px rgba(0,212,255,.5);
  }

  /* ===== BOTTOM BAR ===== */
  .mp-bottom{
    display:flex;flex-direction:column;gap:10px;
    padding:10px 18px 20px;
  }

  /* Seek row */
  .mp-seek-row{
    display:flex;align-items:center;gap:12px;
  }
  .mp-time{
    font-size:12px;font-weight:600;
    font-variant-numeric:tabular-nums;
    color:rgba(255,255,255,.9);
    min-width:42px;text-align:center;
    text-shadow:0 1px 4px rgba(0,0,0,.9);
    letter-spacing:.5px;
  }
  .mp-seek-wrap{
    flex:1;position:relative;height:24px;display:flex;align-items:center;
  }
  .mp-range{
    -webkit-appearance:none;appearance:none;
    width:100%;height:5px;border-radius:99px;
    background:linear-gradient(to right,
      #00d4ff 0%,
      #00d4ff var(--progress,0%),
      rgba(255,255,255,.2) var(--progress,0%),
      rgba(255,255,255,.2) 100%);
    outline:none;cursor:pointer;margin:0;
    transition:height .15s;
  }
  .mp-seek-wrap:hover .mp-range{height:7px;}
  .mp-range::-webkit-slider-thumb{
    -webkit-appearance:none;
    width:16px;height:16px;border-radius:50%;
    background:#fff;
    border:3px solid #00d4ff;
    cursor:pointer;
    box-shadow:0 0 0 5px rgba(0,212,255,.25), 0 0 20px rgba(0,212,255,.6);
    transition:transform .15s;
  }
  .mp-seek-wrap:hover .mp-range::-webkit-slider-thumb{transform:scale(1.15);}
  .mp-range::-moz-range-thumb{
    width:16px;height:16px;border-radius:50%;
    background:#fff;border:3px solid #00d4ff;cursor:pointer;
  }

  /* Controls row */
  .mp-controls-row{
    display:flex;align-items:center;gap:8px;
  }
  .mp-controls-row .spacer{flex:1;}

  /* Volume */
  .mp-vol-wrap{
    display:flex;align-items:center;gap:8px;
    padding:6px 12px 6px 6px;
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.08);
    border-radius:12px;
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
  }
  .mp-vol-wrap .mp-btn{
    width:32px;height:32px;min-width:32px;min-height:32px;
    background:transparent;border:0;
    border-radius:8px;
  }
  .mp-vol-wrap .mp-btn svg{width:18px;height:18px;}
  .mp-vol-slider{
    -webkit-appearance:none;appearance:none;
    width:80px;height:4px;border-radius:99px;
    background:rgba(255,255,255,.25);outline:none;cursor:pointer;
  }
  .mp-vol-slider::-webkit-slider-thumb{
    -webkit-appearance:none;width:14px;height:14px;
    border-radius:50%;background:#00d4ff;
    border:2px solid #fff;cursor:pointer;
    box-shadow:0 0 10px rgba(0,212,255,.6);
  }
  .mp-vol-slider::-moz-range-thumb{
    width:14px;height:14px;border-radius:50%;
    background:#00d4ff;border:2px solid #fff;cursor:pointer;
  }

  /* ===== LOCK OVERLAY ===== */
  .mp-lock-overlay{
    position:absolute;top:0;left:0;right:0;bottom:0;z-index:7;
    display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.35);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
  }
  .mp-lock-overlay.show{display:flex;}
  .mp-lock-overlay button{
    background:linear-gradient(135deg,rgba(0,212,255,.2),rgba(124,58,237,.2));
    border:1px solid rgba(0,212,255,.5);
    color:#fff;border-radius:999px;
    padding:14px 24px;font-size:14px;font-weight:600;
    display:flex;align-items:center;gap:10px;cursor:pointer;
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    box-shadow:0 8px 32px rgba(0,212,255,.3);
    transition:all .2s;
  }
  .mp-lock-overlay button:hover{
    background:linear-gradient(135deg,rgba(0,212,255,.3),rgba(124,58,237,.3));
    box-shadow:0 8px 40px rgba(0,212,255,.5);
  }
  .mp-lock-overlay svg{width:22px;height:22px;fill:#fff;}

  /* ===== OSD (volume/brightness) ===== */
  .mp-osd{
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(.85);
    min-width:130px;padding:20px 24px;
    border-radius:20px;
    background:rgba(0,0,0,.85);
    border:1px solid rgba(0,212,255,.3);
    display:flex;flex-direction:column;align-items:center;gap:8px;
    font-size:16px;font-weight:700;
    opacity:0;transition:all .25s;
    pointer-events:none;z-index:10;
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    box-shadow:0 20px 60px rgba(0,212,255,.3);
  }
  .mp-osd.show{opacity:1;transform:translate(-50%,-50%) scale(1);}
  .mp-osd svg{
    width:36px;height:36px;
    fill:#00d4ff;
    filter:drop-shadow(0 0 10px rgba(0,212,255,.8));
  }
  .mp-osd span{
    background:linear-gradient(90deg,#00d4ff,#7c3aed);
    -webkit-background-clip:text;background-clip:text;
    color:transparent;
  }

  /* ===== RIPPLE (double tap) ===== */
  .mp-ripple{
    position:absolute;top:50%;transform:translateY(-50%) scale(.7);
    width:120px;height:120px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,212,255,.35) 0%,rgba(0,212,255,.05) 70%,transparent 100%);
    border:2px solid rgba(0,212,255,.5);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    gap:4px;font-size:12px;font-weight:800;
    opacity:0;transition:all .3s;
    pointer-events:none;
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    box-shadow:0 0 60px rgba(0,212,255,.5);
    letter-spacing:1px;
  }
  .mp-ripple svg{width:36px;height:36px;fill:#00d4ff;filter:drop-shadow(0 0 8px #00d4ff);}
  .mp-ripple.left{left:14%;}
  .mp-ripple.right{right:14%;}
  .mp-ripple.show{opacity:1;transform:translateY(-50%) scale(1);}

  /* ===== BOTTOM SHEET (Settings/History/Up Next) ===== */
  .mp-sheet-overlay{
    position:absolute;top:0;left:0;right:0;bottom:0;z-index:20;
    background:rgba(0,0,0,.7);
    display:none;align-items:flex-end;
    opacity:0;transition:opacity .3s;
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
  }
  .mp-sheet-overlay.show{display:flex;opacity:1;}

  .mp-sheet{
    width:100%;max-height:65%;
    background:linear-gradient(180deg,rgba(20,20,35,.98),rgba(10,10,20,.98));
    border-top-left-radius:24px;border-top-right-radius:24px;
    border-top:1px solid rgba(0,212,255,.2);
    display:flex;flex-direction:column;
    transform:translateY(100%);
    transition:transform .35s cubic-bezier(.2,.8,.2,1);
    box-shadow:0 -20px 60px rgba(0,212,255,.15);
  }
  .mp-sheet-overlay.show .mp-sheet{transform:translateY(0);}

  /* Grab handle */
  .mp-sheet::before{
    content:"";display:block;
    width:48px;height:4px;border-radius:99px;
    background:rgba(255,255,255,.25);
    margin:10px auto 0;
  }

  .mp-sheet-header{
    display:flex;align-items:center;justify-content:space-between;
    padding:14px 20px;
    border-bottom:1px solid rgba(255,255,255,.06);
    font-weight:700;font-size:16px;
    letter-spacing:.3px;
  }
  .mp-sheet-header div:first-child{
    background:linear-gradient(90deg,#00d4ff,#7c3aed);
    -webkit-background-clip:text;background-clip:text;
    color:transparent;
  }
  .mp-sheet-content{overflow-y:auto;padding:8px 0 20px;}

  /* Sheet items */
  .mp-sheet-item{
    display:flex;align-items:center;justify-content:space-between;
    padding:16px 22px;font-size:14px;
    cursor:pointer;transition:background .2s;
  }
  .mp-sheet-item:hover{background:rgba(0,212,255,.08);}
  .mp-sheet-item span:first-child{color:rgba(255,255,255,.9);font-weight:500;}
  .mp-sheet-item span:last-child{
    color:#00d4ff;font-weight:700;
    font-variant-numeric:tabular-nums;
  }

  /* Switch toggle */
  .mp-switch{
    width:46px;height:26px;border-radius:99px;
    background:rgba(255,255,255,.15);
    position:relative;
    transition:background .3s;
    flex-shrink:0;cursor:pointer;
    border:1px solid rgba(255,255,255,.1);
  }
  .mp-switch::after{
    content:"";position:absolute;top:2px;left:2px;
    width:20px;height:20px;border-radius:50%;
    background:#fff;
    transition:transform .3s cubic-bezier(.2,.8,.2,1);
    box-shadow:0 2px 8px rgba(0,0,0,.3);
  }
  .mp-switch.on{
    background:linear-gradient(135deg,#00d4ff,#7c3aed);
    border-color:transparent;
    box-shadow:0 0 20px rgba(0,212,255,.4);
  }
  .mp-switch.on::after{transform:translateX(20px);}

  /* Video list */
  .mp-vid-item{
    display:flex;gap:14px;padding:12px 20px;
    cursor:pointer;transition:background .2s;
    border-radius:12px;
    margin:2px 8px;
  }
  .mp-vid-item:hover{background:rgba(0,212,255,.08);}
  .mp-vid-item img{
    width:120px;height:68px;object-fit:cover;
    border-radius:10px;flex-shrink:0;
    background:#222;
    border:1px solid rgba(255,255,255,.08);
  }
  .mp-vid-item .vtitle{
    font-size:13px;line-height:1.4;
    color:rgba(255,255,255,.85);
    display:-webkit-box;-webkit-line-clamp:2;
    -webkit-box-orient:vertical;overflow:hidden;
    font-weight:500;
  }
  .mp-empty{
    padding:50px 20px;text-align:center;
    color:rgba(255,255,255,.4);font-size:13px;
    letter-spacing:.3px;
  }

  /* ===== TOAST ===== */
  .mp-toast{
    position:absolute;left:50%;top:14%;
    transform:translateX(-50%) translateY(-20px);
    background:linear-gradient(135deg,rgba(0,212,255,.9),rgba(124,58,237,.9));
    color:#fff;padding:10px 20px;
    border-radius:99px;
    font-size:13px;font-weight:700;
    z-index:99;
    transition:all .3s cubic-bezier(.2,.8,.2,1);
    pointer-events:none;
    opacity:0;
    box-shadow:0 10px 40px rgba(0,212,255,.5);
    letter-spacing:.3px;
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
  }
  .mp-toast.show{
    opacity:1;
    transform:translateX(-50%) translateY(0);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width:520px){
    .mp-title{font-size:13px;max-width:55%;}
    .mp-center{gap:20px;}
    .mp-center .mp-btn{width:56px;height:56px;}
    .mp-center .mp-btn svg{width:30px;height:30px;}
    .mp-vol-slider{width:60px;}
    .mp-btn{width:38px;height:38px;min-width:38px;min-height:38px;}
    .mp-btn svg{width:20px;height:20px;}
  }

  @media (max-width:360px){
    .mp-vol-wrap{display:none;}
  }

  /* ===== SCROLLBAR ===== */
  .mp-sheet-content::-webkit-scrollbar{width:6px;}
  .mp-sheet-content::-webkit-scrollbar-track{background:transparent;}
  .mp-sheet-content::-webkit-scrollbar-thumb{
    background:linear-gradient(180deg,#00d4ff,#7c3aed);
    border-radius:99px;
  }
  `;

  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* =========================================================
     2. ICONS
     ========================================================= */
  const svg = (d) => '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>';
  const ICONS = {
    play: svg('M8 5v14l11-7z'),
    pause: svg('M6 19h4V5H6v14zm8-14v14h4V5h-4z'),
    replay_10: svg('M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z'),
    forward_10: svg('M18.02 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z'),
    fullscreen: svg('M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'),
    fullscreen_exit: svg('M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'),
    settings: svg('M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'),
    history: svg('M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.896 8.896 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8h-1.5z'),
    close: svg('M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'),
    queue_music: svg('M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z'),
    lock: svg('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'),
    lock_open: svg('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'),
    volume_up: svg('M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'),
    volume_off: svg('M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z'),
    brightness: svg('M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z'),
    fit: svg('M3 5v14h18V5H3zm16 12H5V7h14v10z'),
  };

  /* =========================================================
     3. STORAGE
     ========================================================= */
  const Store = {
    getSet: () => {
      try { return JSON.parse(localStorage.getItem('mista_settings')) || { autoplay: true, resume: true, fill: false }; }
      catch (e) { return { autoplay: true, resume: true, fill: false }; }
    },
    saveSet: (s) => localStorage.setItem('mista_settings', JSON.stringify(s)),
    getProg: (id) => {
      try { return (JSON.parse(localStorage.getItem('mista_progress')) || {})[id] || 0; }
      catch (e) { return 0; }
    },
    saveProg: (id, t) => {
      if (t < 5) return;
      let all = {};
      try { all = JSON.parse(localStorage.getItem('mista_progress')) || {}; } catch (e) {}
      all[id] = t;
      const keys = Object.keys(all);
      if (keys.length > 50) delete all[keys[0]];
      localStorage.setItem('mista_progress', JSON.stringify(all));
    },
    getHist: () => {
      try { return JSON.parse(localStorage.getItem('mista_history')) || []; }
      catch (e) { return []; }
    },
    addHist: (v) => {
      if (!v.id) return;
      let h = Store.getHist().filter(x => x.id !== v.id);
      h.unshift({ id: v.id, title: v.title, thumb: v.thumb || 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg' });
      if (h.length > 60) h.pop();
      localStorage.setItem('mista_history', JSON.stringify(h));
    },
    clearHist: () => localStorage.removeItem('mista_history'),
  };

  /* =========================================================
     4. YT LOADER
     ========================================================= */
  let ytPromise = null;
  function loadYT() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytPromise) return ytPromise;
    ytPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof prev === 'function') prev();
        resolve();
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return ytPromise;
  }

  /* =========================================================
     5. PLAYER CLASS
     ========================================================= */
  function MistaPlayer(el) {
    this.el = el;
    this.uid = 'mp' + Math.random().toString(36).slice(2, 8);
    this.player = null;
    this.settings = Store.getSet();
    this.state = { playing: false, locked: false, uiVisible: true, speed: 1, volume: 100, brightness: 100 };
    this.meta = { title: 'Video', playlist: [] };
    this.isSeeking = false;
    this.idleTimer = null;
    this.tickTimer = null;
    this.vid = '';

    const src = el.getAttribute('data-src') || el.getAttribute('data-vid') || '';
    this.vid = this.extractID(src);

    if (this.settings.fill) el.classList.add('mp-fill');

    this.render();
    this.startTicker();

    if (this.vid) {
      this.initYT();
      this.fetchMeta(this.vid);
    } else {
      const t = this.qs('#mp-title');
      if (t) t.textContent = 'No video source';
    }
  }

  MistaPlayer.prototype.extractID = function (v) {
    if (!v) return '';
    const m = String(v).match(/(?:v=|\/|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{11})/);
    if (m) return m[1];
    return (v.length === 11) ? v : '';
  };

  MistaPlayer.prototype.qs = function (sel) { return this.el.querySelector(sel); };

  MistaPlayer.prototype.vibe = function (ms) {
    if (navigator.vibrate) { try { navigator.vibrate(ms || 20); } catch (e) {} }
  };

  MistaPlayer.prototype.render = function () {
    const u = this.uid;
    this.el.classList.add('mp-container');

    this.el.innerHTML =
      '<div id="yt-iframe-holder-' + u + '"></div>' +
      '<div class="mp-curtain" id="curtain-' + u + '"></div>' +
      '<div class="mp-osd" id="osd-v-' + u + '">' + ICONS.volume_up + '<span id="osd-v-t-' + u + '">100</span></div>' +
      '<div class="mp-osd" id="osd-b-' + u + '">' + ICONS.brightness + '<span id="osd-b-t-' + u + '">100</span></div>' +
      '<div class="mp-ripple left" id="rip-l-' + u + '">' + ICONS.replay_10 + '<span>10s</span></div>' +
      '<div class="mp-ripple right" id="rip-r-' + u + '">' + ICONS.forward_10 + '<span>10s</span></div>' +
      '<div class="mp-lock-overlay" id="lock-ov-' + u + '">' +
        '<button id="btn-unlock-' + u + '">' + ICONS.lock_open + '<span>Tap to unlock</span></button>' +
      '</div>' +
      '<div class="mp-ui" id="ui-' + u + '">' +
        '<div class="mp-top">' +
          '<div class="mp-title" id="mp-title">Video</div>' +
          '<div class="mp-top-right">' +
            '<button class="mp-btn" id="btn-hist-' + u + '" title="History">' + ICONS.history + '</button>' +
            '<button class="mp-btn" id="btn-pl-' + u + '" title="Up Next">' + ICONS.queue_music + '</button>' +
            '<button class="mp-btn" id="btn-fit-' + u + '" title="Fit/Fill">' + ICONS.fit + '</button>' +
            '<button class="mp-btn" id="btn-set-' + u + '" title="Settings">' + ICONS.settings + '</button>' +
            '<button class="mp-btn" id="btn-lock-' + u + '" title="Lock">' + ICONS.lock_open + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="mp-center">' +
          '<button class="mp-btn" id="btn-rw-' + u + '">' + ICONS.replay_10 + '</button>' +
          '<button class="mp-btn" id="btn-pp-' + u + '">' + ICONS.play + '</button>' +
          '<button class="mp-btn" id="btn-fw-' + u + '">' + ICONS.forward_10 + '</button>' +
        '</div>' +
        '<div class="mp-bottom">' +
          '<div class="mp-seek-row">' +
            '<span class="mp-time" id="t-cur-' + u + '">0:00</span>' +
            '<div class="mp-seek-wrap" id="seek-wrap-' + u + '">' +
              '<input type="range" class="mp-range" id="seek-' + u + '" min="0" max="100" step="0.1" value="0">' +
            '</div>' +
            '<span class="mp-time" id="t-dur-' + u + '">0:00</span>' +
          '</div>' +
          '<div class="mp-controls-row">' +
            '<div class="mp-vol-wrap">' +
              '<button class="mp-btn" id="btn-mute-' + u + '" title="Mute">' + ICONS.volume_up + '</button>' +
              '<input type="range" class="mp-vol-slider" id="vol-' + u + '" min="0" max="100" value="100">' +
            '</div>' +
            '<span class="spacer"></span>' +
            '<button class="mp-btn" id="btn-fs-' + u + '" title="Fullscreen">' + ICONS.fullscreen + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mp-toast" id="toast-' + u + '"></div>';

    this.sheet = document.createElement('div');
    this.sheet.className = 'mp-sheet-overlay';
    this.sheet.id = 'sheet-' + u;
    this.sheet.innerHTML =
      '<div class="mp-sheet">' +
        '<div class="mp-sheet-header">' +
          '<div id="sheet-title-' + u + '">Settings</div>' +
          '<button class="mp-btn" id="sheet-close-' + u + '">' + ICONS.close + '</button>' +
        '</div>' +
        '<div class="mp-sheet-content" id="sheet-content-' + u + '"></div>' +
      '</div>';
    this.el.appendChild(this.sheet);

    this.bindControls();
    this.bindGestures();
  };

  MistaPlayer.prototype.bindControls = function () {
    const u = this.uid;
    const self = this;
    const tap = (fn) => (e) => { e.stopPropagation(); fn(); self.vibe(); self.resetIdle(); };

    this.qs('#btn-pp-' + u).onclick = tap(() => self.togglePlay());
    this.qs('#btn-rw-' + u).onclick = tap(() => self.skip(-10));
    this.qs('#btn-fw-' + u).onclick = tap(() => self.skip(10));
    this.qs('#btn-fs-' + u).onclick = tap(() => self.toggleFS());
    this.qs('#btn-mute-' + u).onclick = tap(() => self.toggleMute());
    this.qs('#btn-set-' + u).onclick = tap(() => self.openSheet('settings'));
    this.qs('#btn-pl-' + u).onclick = tap(() => self.openSheet('playlist'));
    this.qs('#btn-hist-' + u).onclick = tap(() => self.openSheet('history'));
    this.qs('#btn-fit-' + u).onclick = tap(() => self.toggleFit());

    this.qs('#btn-lock-' + u).onclick = tap(() => {
      self.state.locked = true;
      self.qs('#lock-ov-' + u).classList.add('show');
      self.setUI(false);
    });
    this.qs('#btn-unlock-' + u).onclick = tap(() => {
      self.state.locked = false;
      self.qs('#lock-ov-' + u).classList.remove('show');
      self.setUI(true);
    });

    this.qs('#sheet-close-' + u).onclick = tap(() => self.closeSheet());
    this.sheet.onclick = (e) => { if (e.target === self.sheet) self.closeSheet(); };

    this.qs('#vol-' + u).oninput = (e) => {
      const v = parseInt(e.target.value) || 0;
      self.state.volume = v;
      if (self.player && self.player.setVolume) self.player.setVolume(v);
      self.qs('#btn-mute-' + u).innerHTML = v === 0 ? ICONS.volume_off : ICONS.volume_up;
    };

    const seek = this.qs('#seek-' + u);
    const seekWrap = this.qs('#seek-wrap-' + u);
    const updateFill = (val) => seekWrap.style.setProperty('--progress', val + '%');
    const doSeek = (val) => {
      if (self.player && self.player.getDuration && self.player.seekTo) {
        const dur = self.player.getDuration() || 0;
        self.player.seekTo((val / 100) * dur, true);
      }
    };

    seek.addEventListener('input', (e) => {
      self.isSeeking = true;
      const val = parseFloat(e.target.value) || 0;
      updateFill(val);
      if (self.player && self.player.getDuration) {
        const dur = self.player.getDuration() || 0;
        self.qs('#t-cur-' + u).textContent = self.fmt((val / 100) * dur);
      }
    });

    seek.addEventListener('change', (e) => {
      const val = parseFloat(e.target.value) || 0;
      doSeek(val);
      self.isSeeking = false;
      self.resetIdle();
    });

    seek.addEventListener('touchend', (e) => {
      const val = parseFloat(seek.value) || 0;
      doSeek(val);
      self.isSeeking = false;
      self.resetIdle();
    }, { passive: true });
  };

  MistaPlayer.prototype.bindGestures = function () {
    const self = this;
    const u = this.uid;
    const el = this.el;
    let startX = 0, startY = 0, mode = null, lastTap = 0;

    el.addEventListener('touchstart', (e) => {
      if (self.state.locked) return;
      if (!e.touches[0]) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      mode = startX < el.offsetWidth / 2 ? 'bright' : 'vol';
      self._lastX = startX;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (self.state.locked) return;
      if (!e.touches[0]) return;
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) > 12) {
        e.preventDefault();
        if (mode === 'vol') {
          const nv = Math.max(0, Math.min(100, self.state.volume + (dy > 0 ? 3 : -3)));
          self.state.volume = nv;
          if (self.player && self.player.setVolume) self.player.setVolume(nv);
          self.qs('#vol-' + u).value = nv;
          self.showOSD('v', nv);
        } else {
          const nb = Math.max(20, Math.min(100, self.state.brightness + (dy > 0 ? 3 : -3)));
          self.state.brightness = nb;
          el.style.filter = 'brightness(' + nb + '%)';
          self.showOSD('b', nb);
        }
        startY = e.touches[0].clientY;
      }
    }, { passive: false });

    el.addEventListener('click', () => {
      if (self.state.locked) return;
      const now = Date.now();
      if (now - lastTap < 300) {
        clearTimeout(self._tapT);
        const side = (self._lastX || 0) < el.offsetWidth / 2 ? 'l' : 'r';
        self.skip(side === 'l' ? -10 : 10);
        const rip = self.qs('#rip-' + side + '-' + u);
        if (rip) { rip.classList.add('show'); setTimeout(() => rip.classList.remove('show'), 700); }
      } else {
        self._tapT = setTimeout(() => self.setUI(!self.state.uiVisible), 250);
      }
      lastTap = now;
    });
  };

  MistaPlayer.prototype.setUI = function (v) {
    this.state.uiVisible = v;
    const ui = this.qs('#ui-' + this.uid);
    if (ui) ui.classList.toggle('show', v);
    if (v) this.resetIdle();
  };

  MistaPlayer.prototype.resetIdle = function () {
    const self = this;
    clearTimeout(this.idleTimer);
    if (this.state.playing && this.state.uiVisible) {
      this.idleTimer = setTimeout(() => self.setUI(false), 3500);
    }
  };

  MistaPlayer.prototype.showOSD = function (type, val) {
    const u = this.uid;
    const osd = this.qs('#osd-' + type + '-' + u);
    const txt = this.qs('#osd-' + type + '-t-' + u);
    if (!osd || !txt) return;
    txt.textContent = Math.round(val);
    osd.classList.add('show');
    clearTimeout(this['_osdT_' + type]);
    this['_osdT_' + type] = setTimeout(() => osd.classList.remove('show'), 900);
  };

  MistaPlayer.prototype.fmt = function (s) {
    s = Math.max(0, Math.floor(s || 0));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  };

  MistaPlayer.prototype.togglePlay = function () {
    if (!this.player) return;
    if (this.state.playing) this.player.pauseVideo();
    else this.player.playVideo();
  };

  MistaPlayer.prototype.skip = function (sec) {
    if (!this.player || !this.player.getCurrentTime) return;
    this.player.seekTo(this.player.getCurrentTime() + sec, true);
  };

  MistaPlayer.prototype.toggleMute = function () {
    const u = this.uid;
    const cur = parseInt(this.qs('#vol-' + u).value) || 0;
    const nv = cur > 0 ? 0 : (this._lastVol || 100);
    if (cur > 0) this._lastVol = cur;
    this.qs('#vol-' + u).value = nv;
    this.state.volume = nv;
    if (this.player && this.player.setVolume) this.player.setVolume(nv);
    this.qs('#btn-mute-' + u).innerHTML = nv === 0 ? ICONS.volume_off : ICONS.volume_up;
  };

  MistaPlayer.prototype.toggleFit = function () {
    const isFill = this.el.classList.toggle('mp-fill');
    this.settings.fill = isFill;
    Store.saveSet(this.settings);
    this.showToast(isFill ? '🎬 Fill Screen' : '📐 Fit 16:9');
  };

  MistaPlayer.prototype.showToast = function (msg) {
    const u = this.uid;
    const toast = this.qs('#toast-' + u);
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => toast.classList.remove('show'), 1400);
  };

  /* Fullscreen — native bridge + fallback */
  MistaPlayer.prototype.toggleFS = function () {
    const u = this.uid;
    const btn = this.qs('#btn-fs-' + u);

    if (window.Android && window.Android.enterFullscreen) {
      if (window.Android.isFullscreen && window.Android.isFullscreen()) {
        window.Android.exitFullscreen();
        if (btn) btn.innerHTML = ICONS.fullscreen;
      } else {
        window.Android.enterFullscreen();
        if (btn) btn.innerHTML = ICONS.fullscreen_exit;
      }
      return;
    }

    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      if (btn) btn.innerHTML = ICONS.fullscreen;
    } else {
      const el = this.el;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      if (btn) btn.innerHTML = ICONS.fullscreen_exit;
    }
  };

  MistaPlayer.prototype.openSheet = function (tab) {
    const u = this.uid;
    this.vibe();
    const title = tab === 'settings' ? '⚙️ Settings' : tab === 'playlist' ? '🎵 Up Next' : '🕐 History';
    this.qs('#sheet-title-' + u).textContent = title;
    const content = this.qs('#sheet-content-' + u);
    content.innerHTML = '';

    if (tab === 'settings') {
      content.innerHTML =
        '<div class="mp-sheet-item"><span>Playback Speed</span><span>' + this.state.speed + 'x</span></div>' +
        '<div class="mp-sheet-item"><span>Autoplay Next</span><div class="mp-switch ' + (this.settings.autoplay ? 'on' : '') + '" id="sw-auto-' + u + '"></div></div>' +
        '<div class="mp-sheet-item"><span>Resume Playback</span><div class="mp-switch ' + (this.settings.resume ? 'on' : '') + '" id="sw-resume-' + u + '"></div></div>' +
        '<div class="mp-sheet-item"><span>Fill Screen (16:9)</span><div class="mp-switch ' + (this.settings.fill ? 'on' : '') + '" id="sw-fill-' + u + '"></div></div>';

      this.qs('#sw-auto-' + u).onclick = (e) => {
        this.settings.autoplay = !this.settings.autoplay;
        e.currentTarget.classList.toggle('on', this.settings.autoplay);
        Store.saveSet(this.settings);
      };
      this.qs('#sw-resume-' + u).onclick = (e) => {
        this.settings.resume = !this.settings.resume;
        e.currentTarget.classList.toggle('on', this.settings.resume);
        Store.saveSet(this.settings);
      };
      this.qs('#sw-fill-' + u).onclick = (e) => {
        const on = this.el.classList.toggle('mp-fill');
        this.settings.fill = on;
        e.currentTarget.classList.toggle('on', on);
        Store.saveSet(this.settings);
      };
    } else if (tab === 'playlist') {
      if (!this.meta.playlist.length) {
        content.innerHTML = '<div class="mp-empty">No related videos</div>';
      } else {
        this.meta.playlist.slice(0, 15).forEach((v) => {
          const item = document.createElement('div');
          item.className = 'mp-vid-item';
          item.innerHTML = '<img src="' + (v.thumb || 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg') + '" loading="lazy"><div class="vtitle">' + v.title + '</div>';
          item.onclick = () => { this.closeSheet(); this.loadVideo(v); };
          content.appendChild(item);
        });
      }
    } else if (tab === 'history') {
      const hist = Store.getHist();
      if (!hist.length) {
        content.innerHTML = '<div class="mp-empty">No history yet</div>';
      } else {
        hist.forEach((v) => {
          const item = document.createElement('div');
          item.className = 'mp-vid-item';
          item.innerHTML = '<img src="' + v.thumb + '" loading="lazy"><div class="vtitle">' + v.title + '</div>';
          item.onclick = () => { this.closeSheet(); this.loadVideo(v); };
          content.appendChild(item);
        });
      }
    }
    this.sheet.classList.add('show');
  };

  MistaPlayer.prototype.closeSheet = function () { this.sheet.classList.remove('show'); };

  MistaPlayer.prototype.initYT = function () {
    const self = this;
    loadYT().then(() => self.createPlayer());
  };

  MistaPlayer.prototype.createPlayer = function () {
    const self = this;
    const holderId = 'yt-iframe-holder-' + this.uid;
    let startAt = 0;
    if (this.settings.resume) {
      const p = Store.getProg(this.vid);
      if (p > 10) startAt = p;
    }
    this.player = new YT.Player(holderId, {
      videoId: this.vid,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        controls: 0, modestbranding: 1, rel: 0, playsinline: 1,
        iv_load_policy: 3, disablekb: 1, fs: 0, start: startAt,
        origin: window.location.origin || 'https://mistafy.pages.dev',
        enablejsapi: 1,
      },
      events: {
        onReady: () => {
          if (self.player && self.player.setVolume) self.player.setVolume(self.state.volume);
          if (self.settings.autoplay && self.player && self.player.playVideo) self.player.playVideo();
        },
        onStateChange: (e) => self.onState(e),
        onError: (e) => {
          const t = self.qs('#mp-title');
          if (t) t.textContent = '⚠️ Video unavailable (' + e.data + ')';
          const c = self.qs('#curtain-' + self.uid);
          if (c) c.classList.add('hide');
        },
      },
    });
  };

  MistaPlayer.prototype.onState = function (e) {
    if (!window.YT || !window.YT.PlayerState) return;
    const S = YT.PlayerState;
    const u = this.uid;
    const pp = this.qs('#btn-pp-' + u);
    const curtain = this.qs('#curtain-' + u);

    if (e.data === S.PLAYING) {
      this.state.playing = true;
      if (pp) pp.innerHTML = ICONS.pause;
      if (curtain) curtain.classList.add('hide');
      this.setUI(true);
      if (this.vid) Store.addHist({ id: this.vid, title: this.meta.title });
    } else if (e.data === S.PAUSED || e.data === S.BUFFERING) {
      this.state.playing = false;
      if (pp) pp.innerHTML = ICONS.play;
      this.setUI(true);
    } else if (e.data === S.ENDED) {
      this.state.playing = false;
      if (pp) pp.innerHTML = ICONS.play;
      this.setUI(true);
      if (this.settings.autoplay && this.meta.playlist.length) {
        this.loadVideo(this.meta.playlist[0]);
      }
    }
  };

  MistaPlayer.prototype.loadVideo = function (v) {
    this.vid = v.id;
    this.meta.title = v.title || 'Video';
    this.qs('#mp-title').textContent = this.meta.title;
    if (this.player && this.player.loadVideoById) {
      let start = 0;
      if (this.settings.resume) {
        const p = Store.getProg(this.vid);
        if (p > 10) start = p;
      }
      this.player.loadVideoById({ videoId: v.id, startSeconds: start });
    }
    this.fetchMeta(v.id);
  };

  MistaPlayer.prototype.startTicker = function () {
    const self = this;
    const u = this.uid;
    clearInterval(this.tickTimer);
    this.tickTimer = setInterval(() => {
      if (!self.player) return;
      if (!self.player.getCurrentTime || !self.player.getDuration) return;
      const cur = self.player.getCurrentTime() || 0;
      const dur = self.player.getDuration() || 1;
      if (cur > 5) Store.saveProg(self.vid, Math.floor(cur));
      if (!self.isSeeking) {
        const seek = self.qs('#seek-' + u);
        const wrap = self.qs('#seek-wrap-' + u);
        if (seek && wrap) {
          const val = (cur / dur) * 100;
          seek.value = val;
          wrap.style.setProperty('--progress', val + '%');
        }
      }
      const tCur = self.qs('#t-cur-' + u);
      const tDur = self.qs('#t-dur-' + u);
      if (tCur) tCur.textContent = self.fmt(cur);
      if (tDur) tDur.textContent = self.fmt(dur);
    }, 500);
  };

  MistaPlayer.prototype.fetchMeta = async function (id) {
    try {
      const url = 'https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + id;
      const res = await fetch(url);
      const data = await res.json();
      this.meta.title = data.title || 'Video';
      this.qs('#mp-title').textContent = this.meta.title;
      Store.addHist({ id: id, title: this.meta.title });
    } catch (e) {
      this.qs('#mp-title').textContent = 'Video';
    }
  };

  /* =========================================================
     6. AUTO-INIT
     ========================================================= */
  function initAll() {
    const els = document.querySelectorAll('[data-mista], .mista-embed, [data-vid]');
    for (let i = 0; i < els.length; i++) {
      if (els[i].mista) continue;
      try { els[i].mista = new MistaPlayer(els[i]); }
      catch (e) { console.error('[Mista VIP] Init failed', e); }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.MistaPlayer = MistaPlayer;
})();
