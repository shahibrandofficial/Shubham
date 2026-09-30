/* =========================================================
   MISTA PLAYER — FINAL UNIQUE BUILD
   Ek hi code | Poora feature | Clean UI
   ========================================================= */

(function () {
  'use strict';

  /* ---------- STYLES ---------- */
  if (!document.getElementById('mista-x-style')) {
    const s = document.createElement('style');
    s.id = 'mista-x-style';
    s.textContent = `
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{
      width:100%;height:100%;background:#000;overflow:hidden;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
      color:#fff;-webkit-tap-highlight-color:transparent;
      user-select:none;-webkit-user-select:none;
      touch-action:none;
    }
    .mx-wrap{
      position:absolute;top:0;left:0;width:100%;height:100%;
      background:#000;overflow:hidden;border-radius:0!important;
    }
    .mx-wrap iframe,
    .mx-wrap #mx-holder{
      position:absolute;top:0;left:0;
      width:100%!important;height:100%!important;
      border:0;background:#000;object-fit:contain;
    }
    .mx-wrap.mx-fill iframe{object-fit:cover;}

    /* Loading */
    .mx-load{
      position:absolute;inset:0;
      background:linear-gradient(135deg,#0f0f17,#000);
      display:flex;align-items:center;justify-content:center;
      z-index:9;transition:opacity .4s;pointer-events:none;
    }
    .mx-load.off{opacity:0;visibility:hidden;}
    .mx-load::after{
      content:"";width:44px;height:44px;border-radius:50%;
      border:3px solid rgba(255,255,255,.15);
      border-top-color:#3b82f6;
      border-right-color:#8b5cf6;
      animation:mxspin .85s linear infinite;
    }
    @keyframes mxspin{to{transform:rotate(360deg);}}

    /* UI */
    .mx-ui{
      position:absolute;inset:0;z-index:4;
      display:flex;flex-direction:column;justify-content:space-between;
      background:linear-gradient(180deg,
        rgba(0,0,0,.7) 0%,transparent 22%,
        transparent 68%,rgba(0,0,0,.85) 100%);
      opacity:0;transition:opacity .3s;pointer-events:none;
    }
    .mx-ui.on{opacity:1;pointer-events:auto;}

    /* Top */
    .mx-top{
      display:flex;align-items:center;justify-content:space-between;
      padding:12px 14px;gap:10px;
    }
    .mx-title{
      font-size:14px;font-weight:600;
      max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
      text-shadow:0 2px 8px rgba(0,0,0,.9);
    }
    .mx-row{display:flex;gap:4px;}

    /* Buttons */
    .mx-b{
      background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.1);
      color:#fff;
      width:42px;height:42px;
      display:inline-flex;align-items:center;justify-content:center;
      border-radius:50%;cursor:pointer;padding:0;
      transition:all .2s;
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    }
    .mx-b:hover{
      background:rgba(59,130,246,.25);
      border-color:rgba(59,130,246,.5);
      transform:scale(1.05);
    }
    .mx-b:active{transform:scale(.9);}
    .mx-b svg{width:22px;height:22px;fill:currentColor;pointer-events:none;}

    /* Center */
    .mx-mid{
      display:flex;align-items:center;justify-content:center;
      gap:28px;flex:1;
    }
    .mx-mid .mx-b{
      width:64px;height:64px;
      background:rgba(255,255,255,.12);
      border:2px solid rgba(255,255,255,.2);
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      box-shadow:0 8px 32px rgba(0,0,0,.5);
    }
    .mx-mid .mx-b:hover{
      background:rgba(59,130,246,.3);
      border-color:#3b82f6;
      box-shadow:0 0 40px rgba(59,130,246,.6);
    }
    .mx-mid .mx-b svg{width:32px;height:32px;}
    .mx-mid #mx-pp{
      background:linear-gradient(135deg,#3b82f6,#8b5cf6);
      border:0;
      box-shadow:0 8px 32px rgba(59,130,246,.6);
    }

    /* Bottom */
    .mx-bot{
      display:flex;flex-direction:column;gap:8px;
      padding:8px 14px 18px;
    }
    .mx-seek-row{display:flex;align-items:center;gap:10px;}
    .mx-time{
      font-size:12px;font-weight:600;
      font-variant-numeric:tabular-nums;
      color:rgba(255,255,255,.9);
      min-width:40px;text-align:center;
      text-shadow:0 1px 3px rgba(0,0,0,.9);
    }
    .mx-seek-c{flex:1;position:relative;height:22px;display:flex;align-items:center;}
    .mx-range{
      -webkit-appearance:none;appearance:none;
      width:100%;height:5px;border-radius:99px;
      background:linear-gradient(to right,
        #3b82f6 0%,#3b82f6 var(--mxp,0%),
        rgba(255,255,255,.2) var(--mxp,0%),rgba(255,255,255,.2) 100%);
      outline:none;cursor:pointer;margin:0;
      transition:height .15s;
    }
    .mx-seek-c:hover .mx-range{height:7px;}
    .mx-range::-webkit-slider-thumb{
      -webkit-appearance:none;
      width:15px;height:15px;border-radius:50%;
      background:#fff;border:3px solid #3b82f6;
      cursor:pointer;
      box-shadow:0 0 0 5px rgba(59,130,246,.25);
      transition:transform .15s;
    }
    .mx-seek-c:hover .mx-range::-webkit-slider-thumb{transform:scale(1.15);}
    .mx-range::-moz-range-thumb{
      width:15px;height:15px;border-radius:50%;
      background:#fff;border:3px solid #3b82f6;cursor:pointer;
    }
    .mx-bot-row{display:flex;align-items:center;gap:8px;}
    .mx-bot-row .spacer{flex:1;}

    /* Volume */
    .mx-vol{
      display:flex;align-items:center;gap:8px;
      padding:5px 12px 5px 5px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.08);
      border-radius:14px;
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    }
    .mx-vol .mx-b{
      width:32px;height:32px;
      background:transparent;border:0;border-radius:8px;
    }
    .mx-vol .mx-b svg{width:18px;height:18px;}
    .mx-vrange{
      -webkit-appearance:none;appearance:none;
      width:80px;height:4px;border-radius:99px;
      background:rgba(255,255,255,.25);
      outline:none;cursor:pointer;
    }
    .mx-vrange::-webkit-slider-thumb{
      -webkit-appearance:none;
      width:13px;height:13px;border-radius:50%;
      background:#3b82f6;border:2px solid #fff;cursor:pointer;
      box-shadow:0 0 10px rgba(59,130,246,.6);
    }
    .mx-vrange::-moz-range-thumb{
      width:13px;height:13px;border-radius:50%;
      background:#3b82f6;border:2px solid #fff;cursor:pointer;
    }

    /* Lock overlay */
    .mx-lock{
      position:absolute;inset:0;z-index:7;
      display:none;align-items:center;justify-content:center;
      background:rgba(0,0,0,.35);
      backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
    }
    .mx-lock.on{display:flex;}
    .mx-lock button{
      background:linear-gradient(135deg,rgba(59,130,246,.25),rgba(139,92,246,.25));
      border:1px solid rgba(59,130,246,.5);
      color:#fff;border-radius:999px;
      padding:14px 24px;font-size:14px;font-weight:600;
      display:flex;align-items:center;gap:10px;cursor:pointer;
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      box-shadow:0 8px 32px rgba(59,130,246,.4);
    }
    .mx-lock svg{width:22px;height:22px;fill:#fff;}

    /* OSD */
    .mx-osd{
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%) scale(.85);
      min-width:120px;padding:18px 24px;
      border-radius:16px;
      background:rgba(0,0,0,.85);
      border:1px solid rgba(59,130,246,.3);
      display:flex;flex-direction:column;align-items:center;gap:6px;
      font-size:15px;font-weight:700;
      opacity:0;transition:all .25s;
      pointer-events:none;z-index:10;
      backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
      box-shadow:0 20px 60px rgba(59,130,246,.3);
    }
    .mx-osd.on{opacity:1;transform:translate(-50%,-50%) scale(1);}
    .mx-osd svg{width:32px;height:32px;fill:#3b82f6;}

    /* Ripple */
    .mx-rip{
      position:absolute;top:50%;transform:translateY(-50%) scale(.7);
      width:110px;height:110px;border-radius:50%;
      background:radial-gradient(circle,rgba(59,130,246,.4) 0%,rgba(59,130,246,.05) 70%,transparent 100%);
      border:2px solid rgba(59,130,246,.5);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:2px;font-size:11px;font-weight:800;
      opacity:0;transition:all .3s;pointer-events:none;
      box-shadow:0 0 60px rgba(59,130,246,.5);
    }
    .mx-rip svg{width:32px;height:32px;fill:#3b82f6;}
    .mx-rip.l{left:14%;}
    .mx-rip.r{right:14%;}
    .mx-rip.on{opacity:1;transform:translateY(-50%) scale(1);}

    /* Sheet */
    .mx-sheet-c{
      position:absolute;inset:0;z-index:20;
      background:rgba(0,0,0,.7);
      display:none;align-items:flex-end;
      opacity:0;transition:opacity .3s;
      backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
    }
    .mx-sheet-c.on{display:flex;opacity:1;}
    .mx-sheet{
      width:100%;max-height:65%;
      background:linear-gradient(180deg,rgba(20,20,35,.98),rgba(10,10,20,.98));
      border-top-left-radius:24px;border-top-right-radius:24px;
      border-top:1px solid rgba(59,130,246,.25);
      display:flex;flex-direction:column;
      transform:translateY(100%);
      transition:transform .35s cubic-bezier(.2,.8,.2,1);
      box-shadow:0 -20px 60px rgba(59,130,246,.15);
    }
    .mx-sheet-c.on .mx-sheet{transform:translateY(0);}
    .mx-sheet::before{
      content:"";display:block;
      width:48px;height:4px;border-radius:99px;
      background:rgba(255,255,255,.25);
      margin:10px auto 0;
    }
    .mx-sh-h{
      display:flex;align-items:center;justify-content:space-between;
      padding:12px 18px;
      border-bottom:1px solid rgba(255,255,255,.06);
      font-weight:700;font-size:15px;
    }
    .mx-sh-c{overflow-y:auto;padding:6px 0 18px;}
    .mx-it{
      display:flex;align-items:center;justify-content:space-between;
      padding:15px 20px;font-size:14px;
      cursor:pointer;transition:background .2s;
    }
    .mx-it:hover{background:rgba(59,130,246,.08);}
    .mx-it span:first-child{color:rgba(255,255,255,.9);}
    .mx-it span:last-child{color:#3b82f6;font-weight:700;}

    .mx-sw{
      width:46px;height:26px;border-radius:99px;
      background:rgba(255,255,255,.15);
      position:relative;transition:background .3s;
      flex-shrink:0;cursor:pointer;
      border:1px solid rgba(255,255,255,.1);
    }
    .mx-sw::after{
      content:"";position:absolute;top:2px;left:2px;
      width:20px;height:20px;border-radius:50%;
      background:#fff;transition:transform .3s cubic-bezier(.2,.8,.2,1);
    }
    .mx-sw.on{
      background:linear-gradient(135deg,#3b82f6,#8b5cf6);
      border-color:transparent;
      box-shadow:0 0 20px rgba(59,130,246,.5);
    }
    .mx-sw.on::after{transform:translateX(20px);}

    .mx-vi{
      display:flex;gap:12px;padding:10px 16px;
      cursor:pointer;transition:background .2s;
      border-radius:10px;margin:2px 6px;
    }
    .mx-vi:hover{background:rgba(59,130,246,.08);}
    .mx-vi img{
      width:120px;height:68px;object-fit:cover;
      border-radius:8px;flex-shrink:0;background:#222;
      border:1px solid rgba(255,255,255,.08);
    }
    .mx-vi .t{
      font-size:13px;line-height:1.4;
      color:rgba(255,255,255,.85);
      display:-webkit-box;-webkit-line-clamp:2;
      -webkit-box-orient:vertical;overflow:hidden;
    }
    .mx-empty{
      padding:44px 20px;text-align:center;
      color:rgba(255,255,255,.4);font-size:13px;
    }
    .mx-toast{
      position:absolute;left:50%;top:14%;
      transform:translateX(-50%) translateY(-20px);
      background:linear-gradient(135deg,#3b82f6,#8b5cf6);
      color:#fff;padding:10px 20px;
      border-radius:99px;font-size:13px;font-weight:700;
      z-index:99;
      transition:all .3s cubic-bezier(.2,.8,.2,1);
      pointer-events:none;opacity:0;
      box-shadow:0 10px 40px rgba(59,130,246,.5);
    }
    .mx-toast.on{opacity:1;transform:translateX(-50%) translateY(0);}

    .mx-sh-c::-webkit-scrollbar{width:6px;}
    .mx-sh-c::-webkit-scrollbar-thumb{
      background:linear-gradient(180deg,#3b82f6,#8b5cf6);
      border-radius:99px;
    }

    @media (max-width:520px){
      .mx-mid .mx-b{width:56px;height:56px;}
      .mx-mid .mx-b svg{width:28px;height:28px;}
      .mx-vrange{width:60px;}
      .mx-title{font-size:13px;}
    }
    @media (max-width:360px){
      .mx-vol{display:none;}
    }
    `;
    document.head.appendChild(s);
  }

  /* ---------- ICONS ---------- */
  const sv = (d) => '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>';
  const IC = {
    play: sv('M8 5v14l11-7z'),
    pause: sv('M6 19h4V5H6v14zm8-14v14h4V5h-4z'),
    back10: sv('M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z'),
    fwd10: sv('M18.02 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z'),
    fs: sv('M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'),
    fsx: sv('M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'),
    set: sv('M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'),
    hist: sv('M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.896 8.896 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8h-1.5z'),
    close: sv('M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'),
    q: sv('M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z'),
    lock: sv('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'),
    unlock: sv('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'),
    vol: sv('M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'),
    mute: sv('M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z'),
    brt: sv('M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z'),
    fit: sv('M3 5v14h18V5H3zm16 12H5V7h14v10z'),
  };

  /* ---------- STORAGE ---------- */
  const St = {
    get: () => {
      try { return JSON.parse(localStorage.getItem('mx_set')) || { auto: true, resume: true, fill: false }; }
      catch (e) { return { auto: true, resume: true, fill: false }; }
    },
    set: (s) => localStorage.setItem('mx_set', JSON.stringify(s)),
    prog: (id) => { try { return (JSON.parse(localStorage.getItem('mx_prog')) || {})[id] || 0; } catch (e) { return 0; } },
    saveProg: (id, t) => {
      if (t < 5) return;
      let a = {};
      try { a = JSON.parse(localStorage.getItem('mx_prog')) || {}; } catch (e) {}
      a[id] = t;
      const k = Object.keys(a);
      if (k.length > 50) delete a[k[0]];
      localStorage.setItem('mx_prog', JSON.stringify(a));
    },
    hist: () => { try { return JSON.parse(localStorage.getItem('mx_hist')) || []; } catch (e) { return []; } },
    addHist: (v) => {
      if (!v.id) return;
      let h = St.hist().filter(x => x.id !== v.id);
      h.unshift({ id: v.id, title: v.title, thumb: v.thumb || 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg' });
      if (h.length > 60) h.pop();
      localStorage.setItem('mx_hist', JSON.stringify(h));
    },
  };

  /* ---------- YT LOADER ---------- */
  let ytp = null;
  function loadYT() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytp) return ytp;
    ytp = new Promise((res) => {
      const p = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof p === 'function') p();
        res();
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return ytp;
  }

  /* ---------- PLAYER ---------- */
  function Player(el) {
    this.el = el;
    this.uid = 'mx' + Math.random().toString(36).slice(2, 8);
    this.player = null;
    this.set = St.get();
    this.st = { playing: false, locked: false, ui: true, vol: 100, brt: 100, speed: 1 };
    this.meta = { title: 'Video', playlist: [] };
    this.isSeeking = false;
    this.idleT = null;
    this.tickT = null;
    this.vid = '';
    const src = el.getAttribute('data-src') || el.getAttribute('data-vid') || '';
    this.vid = this.id(src);
    if (this.set.fill) el.classList.add('mx-fill');
    this.render();
    this.ticker();
    if (this.vid) { this.initYT(); this.meta_(this.vid); }
    else { this.q('#mx-title').textContent = 'No video'; }
  }

  Player.prototype.id = function (v) {
    if (!v) return '';
    const m = String(v).match(/(?:v=|\/|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : (v.length === 11 ? v : '');
  };
  Player.prototype.q = function (s) { return this.el.querySelector(s); };
  Player.prototype.vib = function (ms) { if (navigator.vibrate) { try { navigator.vibrate(ms || 20); } catch (e) {} } };

  Player.prototype.render = function () {
    const u = this.uid;
    this.el.classList.add('mx-wrap');
    this.el.innerHTML =
      '<div id="mx-hold-' + u + '"></div>' +
      '<div class="mx-load" id="mx-load-' + u + '"></div>' +
      '<div class="mx-osd" id="mx-osd-v-' + u + '">' + IC.vol + '<span id="mx-osd-vt-' + u + '">100</span></div>' +
      '<div class="mx-osd" id="mx-osd-b-' + u + '">' + IC.brt + '<span id="mx-osd-bt-' + u + '">100</span></div>' +
      '<div class="mx-rip l" id="mx-rip-l-' + u + '">' + IC.back10 + '<span>10s</span></div>' +
      '<div class="mx-rip r" id="mx-rip-r-' + u + '">' + IC.fwd10 + '<span>10s</span></div>' +
      '<div class="mx-lock" id="mx-lock-' + u + '">' +
        '<button id="mx-unlock-' + u + '">' + IC.unlock + '<span>Tap to unlock</span></button>' +
      '</div>' +
      '<div class="mx-ui" id="mx-ui-' + u + '">' +
        '<div class="mx-top">' +
          '<div class="mx-title" id="mx-title">Video</div>' +
          '<div class="mx-row">' +
            '<button class="mx-b" id="mx-hist-' + u + '">' + IC.hist + '</button>' +
            '<button class="mx-b" id="mx-pl-' + u + '">' + IC.q + '</button>' +
            '<button class="mx-b" id="mx-fit-' + u + '">' + IC.fit + '</button>' +
            '<button class="mx-b" id="mx-set-' + u + '">' + IC.set + '</button>' +
            '<button class="mx-b" id="mx-lk-' + u + '">' + IC.unlock + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="mx-mid">' +
          '<button class="mx-b" id="mx-rw-' + u + '">' + IC.back10 + '</button>' +
          '<button class="mx-b" id="mx-pp-' + u + '">' + IC.play + '</button>' +
          '<button class="mx-b" id="mx-fw-' + u + '">' + IC.fwd10 + '</button>' +
        '</div>' +
        '<div class="mx-bot">' +
          '<div class="mx-seek-row">' +
            '<span class="mx-time" id="mx-tc-' + u + '">0:00</span>' +
            '<div class="mx-seek-c" id="mx-sc-' + u + '">' +
              '<input type="range" class="mx-range" id="mx-sk-' + u + '" min="0" max="100" step="0.1" value="0">' +
            '</div>' +
            '<span class="mx-time" id="mx-td-' + u + '">0:00</span>' +
          '</div>' +
          '<div class="mx-bot-row">' +
            '<div class="mx-vol">' +
              '<button class="mx-b" id="mx-mute-' + u + '">' + IC.vol + '</button>' +
              '<input type="range" class="mx-vrange" id="mx-vol-' + u + '" min="0" max="100" value="100">' +
            '</div>' +
            '<span class="spacer"></span>' +
            '<button class="mx-b" id="mx-fs-' + u + '">' + IC.fs + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mx-toast" id="mx-toast-' + u + '"></div>';

    this.sheet = document.createElement('div');
    this.sheet.className = 'mx-sheet-c';
    this.sheet.id = 'mx-sheet-' + u;
    this.sheet.innerHTML =
      '<div class="mx-sheet">' +
        '<div class="mx-sh-h">' +
          '<div id="mx-sh-t-' + u + '">Settings</div>' +
          '<button class="mx-b" id="mx-sh-x-' + u + '">' + IC.close + '</button>' +
        '</div>' +
        '<div class="mx-sh-c" id="mx-sh-c-' + u + '"></div>' +
      '</div>';
    this.el.appendChild(this.sheet);

    this.bind();
    this.gest();
  };

  Player.prototype.bind = function () {
    const u = this.uid, self = this;
    const tap = (fn) => (e) => { e.stopPropagation(); fn(); self.vib(); self.idle(); };

    this.q('#mx-pp-' + u).onclick = tap(() => self.play());
    this.q('#mx-rw-' + u).onclick = tap(() => self.skip(-10));
    this.q('#mx-fw-' + u).onclick = tap(() => self.skip(10));
    this.q('#mx-fs-' + u).onclick = tap(() => self.fs());
    this.q('#mx-mute-' + u).onclick = tap(() => self.mute());
    this.q('#mx-set-' + u).onclick = tap(() => self.sheet_('settings'));
    this.q('#mx-pl-' + u).onclick = tap(() => self.sheet_('playlist'));
    this.q('#mx-hist-' + u).onclick = tap(() => self.sheet_('history'));
    this.q('#mx-fit-' + u).onclick = tap(() => self.fit_());

    this.q('#mx-lk-' + u).onclick = tap(() => {
      self.st.locked = true;
      self.q('#mx-lock-' + u).classList.add('on');
      self.setUI(false);
    });
    this.q('#mx-unlock-' + u).onclick = tap(() => {
      self.st.locked = false;
      self.q('#mx-lock-' + u).classList.remove('on');
      self.setUI(true);
    });
    this.q('#mx-sh-x-' + u).onclick = tap(() => self.closeSheet());
    this.sheet.onclick = (e) => { if (e.target === self.sheet) self.closeSheet(); };

    this.q('#mx-vol-' + u).oninput = (e) => {
      const v = parseInt(e.target.value) || 0;
      self.st.vol = v;
      if (self.player && self.player.setVolume) self.player.setVolume(v);
      self.q('#mx-mute-' + u).innerHTML = v === 0 ? IC.mute : IC.vol;
    };

    const sk = this.q('#mx-sk-' + u);
    const sc = this.q('#mx-sc-' + u);
    const fill = (v) => sc.style.setProperty('--mxp', v + '%');
    const seek = (v) => {
      if (self.player && self.player.getDuration && self.player.seekTo) {
        self.player.seekTo((v / 100) * (self.player.getDuration() || 0), true);
      }
    };

    sk.addEventListener('input', (e) => {
      self.isSeeking = true;
      const v = parseFloat(e.target.value) || 0;
      fill(v);
      if (self.player && self.player.getDuration) {
        self.q('#mx-tc-' + u).textContent = self.fmt((v / 100) * (self.player.getDuration() || 0));
      }
    });
    sk.addEventListener('change', (e) => { seek(parseFloat(e.target.value) || 0); self.isSeeking = false; self.idle(); });
    sk.addEventListener('touchend', () => { seek(parseFloat(sk.value) || 0); self.isSeeking = false; self.idle(); }, { passive: true });
  };

  Player.prototype.gest = function () {
    const self = this, u = this.uid, el = this.el;
    let sx = 0, sy = 0, mode = null, lastTap = 0;

    el.addEventListener('touchstart', (e) => {
      if (self.st.locked || !e.touches[0]) return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      mode = sx < el.offsetWidth / 2 ? 'brt' : 'vol';
      self._lx = sx;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (self.st.locked || !e.touches[0]) return;
      const dy = sy - e.touches[0].clientY;
      if (Math.abs(dy) > 12) {
        e.preventDefault();
        if (mode === 'vol') {
          const nv = Math.max(0, Math.min(100, self.st.vol + (dy > 0 ? 3 : -3)));
          self.st.vol = nv;
          if (self.player && self.player.setVolume) self.player.setVolume(nv);
          self.q('#mx-vol-' + u).value = nv;
          self.osd('v', nv);
        } else {
          const nb = Math.max(20, Math.min(100, self.st.brt + (dy > 0 ? 3 : -3)));
          self.st.brt = nb;
          el.style.filter = 'brightness(' + nb + '%)';
          self.osd('b', nb);
        }
        sy = e.touches[0].clientY;
      }
    }, { passive: false });

    el.addEventListener('click', () => {
      if (self.st.locked) return;
      const now = Date.now();
      if (now - lastTap < 300) {
        clearTimeout(self._tt);
        const side = (self._lx || 0) < el.offsetWidth / 2 ? 'l' : 'r';
        self.skip(side === 'l' ? -10 : 10);
        const r = self.q('#mx-rip-' + side + '-' + u);
        if (r) { r.classList.add('on'); setTimeout(() => r.classList.remove('on'), 700); }
      } else {
        self._tt = setTimeout(() => self.setUI(!self.st.ui), 250);
      }
      lastTap = now;
    });
  };

  Player.prototype.setUI = function (v) {
    this.st.ui = v;
    const ui = this.q('#mx-ui-' + this.uid);
    if (ui) ui.classList.toggle('on', v);
    if (v) this.idle();
  };
  Player.prototype.idle = function () {
    const self = this;
    clearTimeout(this.idleT);
    if (this.st.playing && this.st.ui) {
      this.idleT = setTimeout(() => self.setUI(false), 3500);
    }
  };
  Player.prototype.osd = function (t, v) {
    const u = this.uid;
    const o = this.q('#mx-osd-' + t + '-' + u);
    const x = this.q('#mx-osd-' + t + 't-' + u);
    if (!o || !x) return;
    x.textContent = Math.round(v);
    o.classList.add('on');
    clearTimeout(this['_o' + t]);
    this['_o' + t] = setTimeout(() => o.classList.remove('on'), 900);
  };
  Player.prototype.fmt = function (s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + ((s % 60) < 10 ? '0' : '') + (s % 60);
  };
  Player.prototype.play = function () {
    if (!this.player) return;
    if (this.st.playing) this.player.pauseVideo();
    else this.player.playVideo();
  };
  Player.prototype.skip = function (s) {
    if (!this.player || !this.player.getCurrentTime) return;
    this.player.seekTo(this.player.getCurrentTime() + s, true);
  };
  Player.prototype.mute = function () {
    const u = this.uid;
    const c = parseInt(this.q('#mx-vol-' + u).value) || 0;
    const nv = c > 0 ? 0 : (this._lv || 100);
    if (c > 0) this._lv = c;
    this.q('#mx-vol-' + u).value = nv;
    this.st.vol = nv;
    if (this.player && this.player.setVolume) this.player.setVolume(nv);
    this.q('#mx-mute-' + u).innerHTML = nv === 0 ? IC.mute : IC.vol;
  };
  Player.prototype.fit_ = function () {
    const f = this.el.classList.toggle('mx-fill');
    this.set.fill = f;
    St.set(this.set);
    this.toast(f ? 'Fill Screen' : 'Fit 16:9');
  };
  Player.prototype.toast = function (m) {
    const t = this.q('#mx-toast-' + this.uid);
    if (!t) return;
    t.textContent = m;
    t.classList.add('on');
    clearTimeout(this._to);
    this._to = setTimeout(() => t.classList.remove('on'), 1400);
  };
  Player.prototype.fs = function () {
    const u = this.uid;
    const b = this.q('#mx-fs-' + u);
    if (window.Android && window.Android.enterFullscreen) {
      if (window.Android.isFullscreen && window.Android.isFullscreen()) {
        window.Android.exitFullscreen();
        if (b) b.innerHTML = IC.fs;
      } else {
        window.Android.enterFullscreen();
        if (b) b.innerHTML = IC.fsx;
      }
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
      if (b) b.innerHTML = IC.fs;
    } else {
      const e = this.el;
      if (e.requestFullscreen) e.requestFullscreen();
      else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
      if (b) b.innerHTML = IC.fsx;
    }
  };

  Player.prototype.sheet_ = function (tab) {
    const u = this.uid;
    this.vib();
    this.q('#mx-sh-t-' + u).textContent =
      tab === 'settings' ? 'Settings' : tab === 'playlist' ? 'Up Next' : 'History';
    const c = this.q('#mx-sh-c-' + u);
    c.innerHTML = '';

    if (tab === 'settings') {
      c.innerHTML =
        '<div class="mx-it"><span>Speed</span><span>' + this.st.speed + 'x</span></div>' +
        '<div class="mx-it"><span>Autoplay Next</span><div class="mx-sw ' + (this.set.auto ? 'on' : '') + '" id="mx-sa-' + u + '"></div></div>' +
        '<div class="mx-it"><span>Resume Playback</span><div class="mx-sw ' + (this.set.resume ? 'on' : '') + '" id="mx-sr-' + u + '"></div></div>' +
        '<div class="mx-it"><span>Fill Screen</span><div class="mx-sw ' + (this.set.fill ? 'on' : '') + '" id="mx-sf-' + u + '"></div></div>';
      this.q('#mx-sa-' + u).onclick = (e) => { this.set.auto = !this.set.auto; e.currentTarget.classList.toggle('on', this.set.auto); St.set(this.set); };
      this.q('#mx-sr-' + u).onclick = (e) => { this.set.resume = !this.set.resume; e.currentTarget.classList.toggle('on', this.set.resume); St.set(this.set); };
      this.q('#mx-sf-' + u).onclick = (e) => {
        const on = this.el.classList.toggle('mx-fill');
        this.set.fill = on;
        e.currentTarget.classList.toggle('on', on);
        St.set(this.set);
      };
    } else if (tab === 'playlist') {
      if (!this.meta.playlist.length) c.innerHTML = '<div class="mx-empty">No related videos</div>';
      else this.meta.playlist.slice(0, 15).forEach((v) => {
        const i = document.createElement('div');
        i.className = 'mx-vi';
        i.innerHTML = '<img src="' + (v.thumb || 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg') + '" loading="lazy"><div class="t">' + v.title + '</div>';
        i.onclick = () => { this.closeSheet(); this.load(v); };
        c.appendChild(i);
      });
    } else {
      const h = St.hist();
      if (!h.length) c.innerHTML = '<div class="mx-empty">No history yet</div>';
      else h.forEach((v) => {
        const i = document.createElement('div');
        i.className = 'mx-vi';
        i.innerHTML = '<img src="' + v.thumb + '" loading="lazy"><div class="t">' + v.title + '</div>';
        i.onclick = () => { this.closeSheet(); this.load(v); };
        c.appendChild(i);
      });
    }
    this.sheet.classList.add('on');
  };
  Player.prototype.closeSheet = function () { this.sheet.classList.remove('on'); };

  Player.prototype.initYT = function () {
    const self = this;
    loadYT().then(() => self.mk());
  };
  Player.prototype.mk = function () {
    const self = this;
    const id = 'mx-hold-' + this.uid;
    let start = 0;
    if (this.set.resume) {
      const p = St.prog(this.vid);
      if (p > 10) start = p;
    }
    this.player = new YT.Player(id, {
      videoId: this.vid,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        controls: 0, modestbranding: 1, rel: 0, playsinline: 1,
        iv_load_policy: 3, disablekb: 1, fs: 0, start: start,
        origin: window.location.origin || 'https://mistafy.pages.dev',
        enablejsapi: 1,
      },
      events: {
        onReady: () => {
          if (self.player.setVolume) self.player.setVolume(self.st.vol);
          if (self.set.auto && self.player.playVideo) self.player.playVideo();
        },
        onStateChange: (e) => self.onState(e),
        onError: (e) => {
          const t = self.q('#mx-title');
          if (t) t.textContent = 'Video unavailable (' + e.data + ')';
          const c = self.q('#mx-load-' + self.uid);
          if (c) c.classList.add('off');
        },
      },
    });
  };

  Player.prototype.onState = function (e) {
    if (!window.YT || !window.YT.PlayerState) return;
    const S = YT.PlayerState, u = this.uid;
    const pp = this.q('#mx-pp-' + u);
    const ld = this.q('#mx-load-' + u);
    if (e.data === S.PLAYING) {
      this.st.playing = true;
      if (pp) pp.innerHTML = IC.pause;
      if (ld) ld.classList.add('off');
      this.setUI(true);
      if (this.vid) St.addHist({ id: this.vid, title: this.meta.title });
    } else if (e.data === S.PAUSED || e.data === S.BUFFERING) {
      this.st.playing = false;
      if (pp) pp.innerHTML = IC.play;
      this.setUI(true);
    } else if (e.data === S.ENDED) {
      this.st.playing = false;
      if (pp) pp.innerHTML = IC.play;
      this.setUI(true);
      if (this.set.auto && this.meta.playlist.length) this.load(this.meta.playlist[0]);
    }
  };

  Player.prototype.load = function (v) {
    this.vid = v.id;
    this.meta.title = v.title || 'Video';
    this.q('#mx-title').textContent = this.meta.title;
    if (this.player && this.player.loadVideoById) {
      let s = 0;
      if (this.set.resume) { const p = St.prog(this.vid); if (p > 10) s = p; }
      this.player.loadVideoById({ videoId: v.id, startSeconds: s });
    }
    this.meta_(v.id);
  };

  Player.prototype.ticker = function () {
    const self = this, u = this.uid;
    clearInterval(this.tickT);
    this.tickT = setInterval(() => {
      if (!self.player) return;
      if (!self.player.getCurrentTime || !self.player.getDuration) return;
      const c = self.player.getCurrentTime() || 0;
      const d = self.player.getDuration() || 1;
      if (c > 5) St.saveProg(self.vid, Math.floor(c));
      if (!self.isSeeking) {
        const sk = self.q('#mx-sk-' + u);
        const sc = self.q('#mx-sc-' + u);
        if (sk && sc) {
          const val = (c / d) * 100;
          sk.value = val;
          sc.style.setProperty('--mxp', val + '%');
        }
      }
      const tc = self.q('#mx-tc-' + u);
      const td = self.q('#mx-td-' + u);
      if (tc) tc.textContent = self.fmt(c);
      if (td) td.textContent = self.fmt(d);
    }, 500);
  };

  Player.prototype.meta_ = async function (id) {
    try {
      const r = await fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + id);
      const d = await r.json();
      this.meta.title = d.title || 'Video';
      this.q('#mx-title').textContent = this.meta.title;
      St.addHist({ id: id, title: this.meta.title });
    } catch (e) {
      this.q('#mx-title').textContent = 'Video';
    }
  };

  /* ---------- INIT ---------- */
  function initAll() {
    const els = document.querySelectorAll('[data-mista], .mista-embed, [data-vid]');
    for (let i = 0; i < els.length; i++) {
      if (els[i].mista) continue;
      try { els[i].mista = new Player(els[i]); }
      catch (e) { console.error('[Mista] fail', e); }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.MistaPlayer = Player;
})();
