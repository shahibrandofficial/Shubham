/* =========================================================
   =========================================================
   MISTA PLAYER — RAM.JS
   Complete Final Build — 2000+ Lines
   =========================================================
   Features:
   - Sharp corners (no rounded border-radius)
   - Fit (16:9) / Fill (fullscreen) toggle
   - Fullscreen forces landscape via native bridge
   - Seek, volume, brightness gestures
   - History, Playlist, Settings
   - Auto-resume playback
   - Autoplay next
   - Lock screen
   - Double-tap skip
   =========================================================
   Author: Mista Player Build
   Version: 2.0 Final
   =========================================================
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     SECTION 1: GLOBAL CONSTANTS
     ========================================================= */
  const STYLE_ID = 'mista-style-final-fix';
  const STORAGE_KEY_SETTINGS = 'mista_settings';
  const STORAGE_KEY_PROGRESS = 'mista_progress';
  const STORAGE_KEY_HISTORY = 'mista_history';
  const HISTORY_LIMIT = 60;
  const PROGRESS_LIMIT = 50;
  const MIN_PROGRESS_SECONDS = 5;
  const RESUME_THRESHOLD_SECONDS = 10;
  const IDLE_TIMEOUT_MS = 3000;
  const DOUBLE_TAP_MS = 300;
  const OSD_HIDE_MS = 800;
  const RIPPLE_HIDE_MS = 700;
  const TICK_INTERVAL_MS = 500;
  const SEEK_STEP_SECONDS = 10;
  const VOLUME_STEP = 3;
  const BRIGHTNESS_STEP = 3;
  const BRIGHTNESS_MIN = 20;
  const BRIGHTNESS_MAX = 100;
  const VOLUME_MIN = 0;
  const VOLUME_MAX = 100;

  /* =========================================================
     SECTION 2: CSS STYLES
     ========================================================= */
  const CSS = `
  /* =========================================================
     RESET
     ========================================================= */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #ffffff;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }

  /* =========================================================
     CONTAINER — Sharp corners, poora screen
     ========================================================= */
  .mp-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
    border-radius: 0 !important;
    isolation: isolate;
  }

  /* =========================================================
     IFRAME — FIT by default (16:9)
     ========================================================= */
  .mp-container iframe,
  .mp-container video,
  .mp-container #yt-iframe-holder,
  .mp-container #yt-iframe-holder iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    border: 0;
    background: #000;
    object-fit: contain;
  }

  /* =========================================================
     FILL MODE
     ========================================================= */
  .mp-container.mp-fill iframe,
  .mp-container.mp-fill video,
  .mp-container.mp-fill #yt-iframe-holder iframe {
    object-fit: cover;
  }

  /* =========================================================
     CURTAIN (Loading)
     ========================================================= */
  .mp-curtain {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    opacity: 1;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .mp-curtain.hide {
    opacity: 0;
    visibility: hidden;
  }

  .mp-curtain::after {
    content: "";
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.15);
    border-top-color: #e50914;
    animation: mp-spin 0.8s linear infinite;
  }

  @keyframes mp-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* =========================================================
     MAIN UI WRAPPER
     ========================================================= */
  .mp-ui {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.55) 0%,
      transparent 20%,
      transparent 70%,
      rgba(0, 0, 0, 0.75) 100%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  .mp-ui.show {
    opacity: 1;
    pointer-events: auto;
  }

  /* =========================================================
     TOP BAR
     ========================================================= */
  .mp-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    gap: 10px;
  }

  .mp-title {
    font-size: 14px;
    font-weight: 600;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  }

  .mp-top-right {
    display: flex;
    gap: 4px;
  }

  /* =========================================================
     BUTTONS
     ========================================================= */
  .mp-btn {
    background: transparent;
    border: 0;
    color: #ffffff;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s, transform 0.12s;
  }

  .mp-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .mp-btn:active {
    transform: scale(0.9);
  }

  .mp-btn svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
    pointer-events: none;
  }

  /* =========================================================
     CENTER CLUSTER
     ========================================================= */
  .mp-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    flex: 1;
  }

  .mp-center .mp-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .mp-center .mp-btn svg {
    width: 34px;
    height: 34px;
  }

  /* =========================================================
     BOTTOM BAR
     ========================================================= */
  .mp-bottom {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 14px 16px;
  }

  .mp-seek-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mp-time {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.85);
    min-width: 38px;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .mp-seek-wrap {
    flex: 1;
    position: relative;
    height: 22px;
    display: flex;
    align-items: center;
  }

  .mp-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 99px;
    background: linear-gradient(
      to right,
      #e50914 0%,
      #e50914 var(--progress, 0%),
      rgba(255, 255, 255, 0.3) var(--progress, 0%),
      rgba(255, 255, 255, 0.3) 100%
    );
    outline: none;
    cursor: pointer;
    margin: 0;
  }

  .mp-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e50914;
    border: 2px solid #ffffff;
    cursor: pointer;
    box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.25);
  }

  .mp-range::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e50914;
    border: 2px solid #ffffff;
    cursor: pointer;
  }

  .mp-controls-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 2px;
  }

  .mp-controls-row .spacer {
    flex: 1;
  }

  .mp-vol-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 6px;
  }

  .mp-vol-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 70px;
    height: 4px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    cursor: pointer;
  }

  .mp-vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e50914;
    cursor: pointer;
  }

  .mp-vol-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e50914;
    border: 0;
    cursor: pointer;
  }

  /* =========================================================
     LOCK OVERLAY
     ========================================================= */
  .mp-lock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 7;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.25);
  }

  .mp-lock-overlay.show {
    display: flex;
  }

  .mp-lock-overlay button {
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    border-radius: 999px;
    padding: 12px 18px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .mp-lock-overlay svg {
    width: 20px;
    height: 20px;
    fill: #ffffff;
  }

  /* =========================================================
     OSD
     ========================================================= */
  .mp-osd {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    min-width: 110px;
    padding: 16px 20px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
    z-index: 10;
  }

  .mp-osd.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .mp-osd svg {
    width: 32px;
    height: 32px;
    fill: #ffffff;
  }

  /* =========================================================
     RIPPLE (Double-tap indicator)
     ========================================================= */
  .mp-ripple {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 11px;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  .mp-ripple svg {
    width: 32px;
    height: 32px;
    fill: #ffffff;
  }

  .mp-ripple.left {
    left: 15%;
  }

  .mp-ripple.right {
    right: 15%;
  }

  .mp-ripple.show {
    opacity: 1;
  }

  /* =========================================================
     BOTTOM SHEET
     ========================================================= */
  .mp-sheet-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.55);
    display: none;
    align-items: flex-end;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .mp-sheet-overlay.show {
    display: flex;
    opacity: 1;
  }

  .mp-sheet {
    width: 100%;
    max-height: 62%;
    background: rgba(15, 15, 18, 0.96);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    display: flex;
    flex-direction: column;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    color: #ffffff;
  }

  .mp-sheet-overlay.show .mp-sheet {
    transform: translateY(0);
  }

  .mp-sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    font-weight: 600;
    font-size: 15px;
  }

  .mp-sheet-content {
    overflow-y: auto;
    padding: 6px 0 14px;
  }

  .mp-sheet-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    font-size: 14px;
    cursor: pointer;
  }

  .mp-sheet-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .mp-switch {
    width: 42px;
    height: 24px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.25);
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
    cursor: pointer;
  }

  .mp-switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    transition: transform 0.2s;
  }

  .mp-switch.on {
    background: #e50914;
  }

  .mp-switch.on::after {
    transform: translateX(18px);
  }

  .mp-vid-item {
    display: flex;
    gap: 12px;
    padding: 10px 16px;
    cursor: pointer;
  }

  .mp-vid-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .mp-vid-item img {
    width: 110px;
    height: 62px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
    background: #222;
  }

  .mp-vid-item .vtitle {
    font-size: 13px;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mp-empty {
    padding: 34px 20px;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
  }

  /* =========================================================
     RESPONSIVE
     ========================================================= */
  @media (max-width: 520px) {
    .mp-title {
      font-size: 13px;
      max-width: 55%;
    }
    .mp-center .mp-btn {
      width: 50px;
      height: 50px;
    }
    .mp-center .mp-btn svg {
      width: 28px;
      height: 28px;
    }
    .mp-vol-slider {
      width: 55px;
    }
  }
  `;

  if (!document.getElementById(STYLE_ID)) {
    const styleTag = document.createElement('style');
    styleTag.id = STYLE_ID;
    styleTag.textContent = CSS;
    document.head.appendChild(styleTag);
  }

  /* =========================================================
     SECTION 3: SVG ICONS
     ========================================================= */
  function svg(innerPath) {
    return '<svg viewBox="0 0 24 24"><path d="' + innerPath + '"/></svg>';
  }

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
     SECTION 4: STORAGE HELPERS
     ========================================================= */
  const Store = {
    getSet: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (raw) return JSON.parse(raw);
        return { autoplay: true, resume: true, fill: false };
      } catch (e) {
        return { autoplay: true, resume: true, fill: false };
      }
    },

    saveSet: function (settings) {
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      } catch (e) {
        /* ignore */
      }
    },

    getProg: function (id) {
      try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)) || {};
        return all[id] || 0;
      } catch (e) {
        return 0;
      }
    },

    saveProg: function (id, time) {
      if (time < MIN_PROGRESS_SECONDS) return;
      try {
        let all = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)) || {};
        all[id] = time;
        const keys = Object.keys(all);
        if (keys.length > PROGRESS_LIMIT) {
          delete all[keys[0]];
        }
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(all));
      } catch (e) {
        /* ignore */
      }
    },

    getHist: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [];
      } catch (e) {
        return [];
      }
    },

    addHist: function (video) {
      if (!video.id) return;
      try {
        let history = Store.getHist().filter(function (x) {
          return x.id !== video.id;
        });
        history.unshift({
          id: video.id,
          title: video.title,
          thumb: video.thumb || ('https://i.ytimg.com/vi/' + video.id + '/mqdefault.jpg')
        });
        if (history.length > HISTORY_LIMIT) {
          history.pop();
        }
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
      } catch (e) {
        /* ignore */
      }
    },

    clearHist: function () {
      try {
        localStorage.removeItem(STORAGE_KEY_HISTORY);
      } catch (e) {
        /* ignore */
      }
    }
  };

  /* =========================================================
     SECTION 5: YOUTUBE API LOADER
     ========================================================= */
  let ytPromise = null;

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      return Promise.resolve();
    }
    if (ytPromise) {
      return ytPromise;
    }
    ytPromise = new Promise(function (resolve) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof prev === 'function') {
          prev();
        }
        resolve();
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });
    return ytPromise;
  }

  /* =========================================================
     SECTION 6: MISTA PLAYER CLASS
     ========================================================= */
  function MistaPlayer(element) {
    this.el = element;
    this.uid = 'mp' + Math.random().toString(36).slice(2, 8);
    this.player = null;
    this.settings = Store.getSet();

    this.state = {
      playing: false,
      locked: false,
      uiVisible: true,
      speed: 1,
      volume: 100,
      brightness: 100
    };

    this.meta = {
      title: 'Video',
      playlist: []
    };

    this.isSeeking = false;
    this.idleTimer = null;
    this.tickTimer = null;
    this.vid = '';

    const src = element.getAttribute('data-src') ||
                element.getAttribute('data-vid') ||
                '';
    this.vid = this.extractID(src);

    if (this.settings.fill) {
      element.classList.add('mp-fill');
    }

    this.render();
    this.startTicker();

    if (this.vid) {
      this.initYT();
      this.fetchMeta(this.vid);
    } else {
      const titleEl = this.qs('#mp-title');
      if (titleEl) titleEl.textContent = 'No video';
    }
  }

  /* =========================================================
     Extract YouTube video ID from URL or raw ID
     ========================================================= */
  MistaPlayer.prototype.extractID = function (input) {
    if (!input) return '';
    const str = String(input);
    const m = str.match(/(?:v=|\/|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{11})/);
    if (m) return m[1];
    if (str.length === 11) return str;
    return '';
  };

  /* =========================================================
     Query selector helper
     ========================================================= */
  MistaPlayer.prototype.qs = function (selector) {
    return this.el.querySelector(selector);
  };

  /* =========================================================
     Haptic feedback
     ========================================================= */
  MistaPlayer.prototype.vibe = function (ms) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms || 20);
      } catch (e) {
        /* ignore */
      }
    }
  };

  /* =========================================================
     RENDER — Build all UI elements
     ========================================================= */
  MistaPlayer.prototype.render = function () {
    const u = this.uid;

    this.el.classList.add('mp-container');

    this.el.innerHTML =
      '<div id="yt-iframe-holder-' + u + '"></div>' +
      '<div class="mp-curtain" id="curtain-' + u + '"></div>' +

      '<div class="mp-osd" id="osd-v-' + u + '">' +
        ICONS.volume_up +
        '<span id="osd-v-t-' + u + '">100</span>' +
      '</div>' +

      '<div class="mp-osd" id="osd-b-' + u + '">' +
        ICONS.brightness +
        '<span id="osd-b-t-' + u + '">100</span>' +
      '</div>' +

      '<div class="mp-ripple left" id="rip-l-' + u + '">' +
        ICONS.replay_10 +
        '<span>10s</span>' +
      '</div>' +

      '<div class="mp-ripple right" id="rip-r-' + u + '">' +
        ICONS.forward_10 +
        '<span>10s</span>' +
      '</div>' +

      '<div class="mp-lock-overlay" id="lock-ov-' + u + '">' +
        '<button id="btn-unlock-' + u + '">' +
          ICONS.lock_open +
          '<span>Tap to unlock</span>' +
        '</button>' +
      '</div>' +

      '<div class="mp-ui" id="ui-' + u + '">' +

        '<div class="mp-top">' +
          '<div class="mp-title" id="mp-title">Video</div>' +
          '<div class="mp-top-right">' +
            '<button class="mp-btn" id="btn-hist-' + u + '" title="History">' +
              ICONS.history +
            '</button>' +
            '<button class="mp-btn" id="btn-pl-' + u + '" title="Up Next">' +
              ICONS.queue_music +
            '</button>' +
            '<button class="mp-btn" id="btn-fit-' + u + '" title="Fit/Fill">' +
              ICONS.fit +
            '</button>' +
            '<button class="mp-btn" id="btn-set-' + u + '" title="Settings">' +
              ICONS.settings +
            '</button>' +
            '<button class="mp-btn" id="btn-lock-' + u + '" title="Lock">' +
              ICONS.lock_open +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="mp-center">' +
          '<button class="mp-btn" id="btn-rw-' + u + '">' +
            ICONS.replay_10 +
          '</button>' +
          '<button class="mp-btn" id="btn-pp-' + u + '">' +
            ICONS.play +
          '</button>' +
          '<button class="mp-btn" id="btn-fw-' + u + '">' +
            ICONS.forward_10 +
          '</button>' +
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
              '<button class="mp-btn" id="btn-mute-' + u + '" title="Mute">' +
                ICONS.volume_up +
              '</button>' +
              '<input type="range" class="mp-vol-slider" id="vol-' + u + '" min="0" max="100" value="100">' +
            '</div>' +
            '<span class="spacer"></span>' +
            '<button class="mp-btn" id="btn-fs-' + u + '" title="Fullscreen">' +
              ICONS.fullscreen +
            '</button>' +
          '</div>' +

        '</div>' +

      '</div>';

    /* Bottom sheet */
    this.sheet = document.createElement('div');
    this.sheet.className = 'mp-sheet-overlay';
    this.sheet.id = 'sheet-' + u;
    this.sheet.innerHTML =
      '<div class="mp-sheet">' +
        '<div class="mp-sheet-header">' +
          '<div id="sheet-title-' + u + '">Settings</div>' +
          '<button class="mp-btn" id="sheet-close-' + u + '">' +
            ICONS.close +
          '</button>' +
        '</div>' +
        '<div class="mp-sheet-content" id="sheet-content-' + u + '"></div>' +
      '</div>';

    this.el.appendChild(this.sheet);

    this.bindControls();
    this.bindGestures();
  };

  /* =========================================================
     BIND CONTROLS — All button click handlers
     ========================================================= */
  MistaPlayer.prototype.bindControls = function () {
    const u = this.uid;
    const self = this;

    const tap = function (fn) {
      return function (e) {
        e.stopPropagation();
        fn();
        self.vibe();
        self.resetIdle();
      };
    };

    this.qs('#btn-pp-' + u).onclick = tap(function () {
      self.togglePlay();
    });

    this.qs('#btn-rw-' + u).onclick = tap(function () {
      self.skip(-SEEK_STEP_SECONDS);
    });

    this.qs('#btn-fw-' + u).onclick = tap(function () {
      self.skip(SEEK_STEP_SECONDS);
    });

    this.qs('#btn-fs-' + u).onclick = tap(function () {
      self.toggleFS();
    });

    this.qs('#btn-mute-' + u).onclick = tap(function () {
      self.toggleMute();
    });

    this.qs('#btn-set-' + u).onclick = tap(function () {
      self.openSheet('settings');
    });

    this.qs('#btn-pl-' + u).onclick = tap(function () {
      self.openSheet('playlist');
    });

    this.qs('#btn-hist-' + u).onclick = tap(function () {
      self.openSheet('history');
    });

    this.qs('#btn-fit-' + u).onclick = tap(function () {
      self.toggleFit();
    });

    this.qs('#btn-lock-' + u).onclick = tap(function () {
      self.state.locked = true;
      self.qs('#lock-ov-' + u).classList.add('show');
      self.setUI(false);
    });

    this.qs('#btn-unlock-' + u).onclick = tap(function () {
      self.state.locked = false;
      self.qs('#lock-ov-' + u).classList.remove('show');
      self.setUI(true);
    });

    this.qs('#sheet-close-' + u).onclick = tap(function () {
      self.closeSheet();
    });

    this.sheet.onclick = function (e) {
      if (e.target === self.sheet) {
        self.closeSheet();
      }
    };

    /* Volume slider */
    this.qs('#vol-' + u).oninput = function (e) {
      const vol = parseInt(e.target.value) || 0;
      self.state.volume = vol;
      if (self.player && self.player.setVolume) {
        self.player.setVolume(vol);
      }
      const muteBtn = self.qs('#btn-mute-' + u);
      muteBtn.innerHTML = vol === 0 ? ICONS.volume_off : ICONS.volume_up;
    };

    /* Seek slider */
    const seek = this.qs('#seek-' + u);
    const seekWrap = this.qs('#seek-wrap-' + u);

    const updateFill = function (val) {
      seekWrap.style.setProperty('--progress', val + '%');
    };

    const doSeek = function (val) {
      if (self.player && self.player.getDuration && self.player.seekTo) {
        const dur = self.player.getDuration() || 0;
        const target = (val / 100) * dur;
        self.player.seekTo(target, true);
      }
    };

    seek.addEventListener('input', function (e) {
      self.isSeeking = true;
      const val = parseFloat(e.target.value) || 0;
      updateFill(val);
      if (self.player && self.player.getDuration) {
        const dur = self.player.getDuration() || 0;
        self.qs('#t-cur-' + u).textContent = self.fmt((val / 100) * dur);
      }
    });

    seek.addEventListener('change', function (e) {
      const val = parseFloat(e.target.value) || 0;
      doSeek(val);
      self.isSeeking = false;
      self.resetIdle();
    });

    seek.addEventListener('touchend', function () {
      const val = parseFloat(seek.value) || 0;
      doSeek(val);
      self.isSeeking = false;
      self.resetIdle();
    }, { passive: true });
  };

  /* =========================================================
     BIND GESTURES — Touch swipe, double-tap
     ========================================================= */
  MistaPlayer.prototype.bindGestures = function () {
    const self = this;
    const u = this.uid;
    const el = this.el;

    let startX = 0;
    let startY = 0;
    let mode = null;
    let lastTap = 0;

    el.addEventListener('touchstart', function (e) {
      if (self.state.locked) return;
      if (!e.touches[0]) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      mode = startX < el.offsetWidth / 2 ? 'brightness' : 'volume';
      self._lastX = startX;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      if (self.state.locked) return;
      if (!e.touches[0]) return;

      const dy = startY - e.touches[0].clientY;

      if (Math.abs(dy) > 12) {
        e.preventDefault();

        if (mode === 'volume') {
          const nv = Math.max(VOLUME_MIN, Math.min(VOLUME_MAX, self.state.volume + (dy > 0 ? VOLUME_STEP : -VOLUME_STEP)));
          self.state.volume = nv;
          if (self.player && self.player.setVolume) {
            self.player.setVolume(nv);
          }
          self.qs('#vol-' + u).value = nv;
          self.showOSD('v', nv);
        } else {
          const nb = Math.max(BRIGHTNESS_MIN, Math.min(BRIGHTNESS_MAX, self.state.brightness + (dy > 0 ? BRIGHTNESS_STEP : -BRIGHTNESS_STEP)));
          self.state.brightness = nb;
          el.style.filter = 'brightness(' + nb + '%)';
          self.showOSD('b', nb);
        }

        startY = e.touches[0].clientY;
      }
    }, { passive: false });

    el.addEventListener('click', function () {
      if (self.state.locked) return;

      const now = Date.now();

      if (now - lastTap < DOUBLE_TAP_MS) {
        clearTimeout(self._tapT);
        const side = (self._lastX || 0) < el.offsetWidth / 2 ? 'l' : 'r';
        self.skip(side === 'l' ? -SEEK_STEP_SECONDS : SEEK_STEP_SECONDS);

        const rip = self.qs('#rip-' + side + '-' + u);
        if (rip) {
          rip.classList.add('show');
          setTimeout(function () {
            rip.classList.remove('show');
          }, RIPPLE_HIDE_MS);
        }
      } else {
        self._tapT = setTimeout(function () {
          self.setUI(!self.state.uiVisible);
        }, 250);
      }

      lastTap = now;
    });
  };

  /* =========================================================
     UI VISIBILITY
     ========================================================= */
  MistaPlayer.prototype.setUI = function (visible) {
    this.state.uiVisible = visible;
    const ui = this.qs('#ui-' + this.uid);
    if (ui) {
      ui.classList.toggle('show', visible);
    }
    if (visible) {
      this.resetIdle();
    }
  };

  MistaPlayer.prototype.resetIdle = function () {
    const self = this;
    clearTimeout(this.idleTimer);

    if (this.state.playing && this.state.uiVisible) {
      this.idleTimer = setTimeout(function () {
        self.setUI(false);
      }, IDLE_TIMEOUT_MS);
    }
  };

  /* =========================================================
     OSD DISPLAY
     ========================================================= */
  MistaPlayer.prototype.showOSD = function (type, val) {
    const u = this.uid;
    const osd = this.qs('#osd-' + type + '-' + u);
    const txt = this.qs('#osd-' + type + '-t-' + u);

    if (!osd || !txt) return;

    txt.textContent = Math.round(val);
    osd.classList.add('show');

    clearTimeout(this['_osdT_' + type]);
    this['_osdT_' + type] = setTimeout(function () {
      osd.classList.remove('show');
    }, OSD_HIDE_MS);
  };

  /* =========================================================
     FORMAT TIME
     ========================================================= */
  MistaPlayer.prototype.fmt = function (seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  };

  /* =========================================================
     PLAY / PAUSE
     ========================================================= */
  MistaPlayer.prototype.togglePlay = function () {
    if (!this.player) return;
    if (this.state.playing) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  };

  /* =========================================================
     SKIP FORWARD / BACK
     ========================================================= */
  MistaPlayer.prototype.skip = function (seconds) {
    if (!this.player || !this.player.getCurrentTime) return;
    const current = this.player.getCurrentTime();
    this.player.seekTo(current + seconds, true);
  };

  /* =========================================================
     MUTE / UNMUTE
     ========================================================= */
  MistaPlayer.prototype.toggleMute = function () {
    const u = this.uid;
    const cur = parseInt(this.qs('#vol-' + u).value) || 0;
    const nv = cur > 0 ? 0 : (this._lastVol || 100);

    if (cur > 0) {
      this._lastVol = cur;
    }

    this.qs('#vol-' + u).value = nv;
    this.state.volume = nv;

    if (this.player && this.player.setVolume) {
      this.player.setVolume(nv);
    }

    this.qs('#btn-mute-' + u).innerHTML = nv === 0 ? ICONS.volume_off : ICONS.volume_up;
  };

  /* =========================================================
     FIT / FILL TOGGLE
     ========================================================= */
  MistaPlayer.prototype.toggleFit = function () {
    const isFill = this.el.classList.toggle('mp-fill');
    this.settings.fill = isFill;
    Store.saveSet(this.settings);
    this.showToast(isFill ? 'Fill Screen' : 'Fit 16:9');
  };

  /* =========================================================
     TOAST HELPER
     ========================================================= */
  MistaPlayer.prototype.showToast = function (message) {
    const u = this.uid;
    let toast = this.qs('#toast-' + u);

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-' + u;
      toast.style.cssText =
        'position:absolute;' +
        'left:50%;top:12%;' +
        'transform:translateX(-50%);' +
        'background:rgba(0,0,0,.8);' +
        'color:#fff;' +
        'padding:8px 16px;' +
        'border-radius:20px;' +
        'font-size:13px;' +
        'font-weight:600;' +
        'z-index:99;' +
        'transition:opacity .3s;' +
        'pointer-events:none;' +
        'opacity:0;';
      this.el.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    clearTimeout(this._toastT);
    this._toastT = setTimeout(function () {
      toast.style.opacity = '0';
    }, 1200);
  };

  /* =========================================================
     FULLSCREEN TOGGLE — Native bridge aware
     ========================================================= */
  MistaPlayer.prototype.toggleFS = function () {
    const u = this.uid;
    const btn = this.qs('#btn-fs-' + u);

    /* Native Android bridge available */
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

    /* Browser fallback */
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      if (btn) btn.innerHTML = ICONS.fullscreen;
    } else {
      const el = this.el;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
      if (btn) btn.innerHTML = ICONS.fullscreen_exit;
    }
  };

  /* =========================================================
     OPEN BOTTOM SHEET
     ========================================================= */
  MistaPlayer.prototype.openSheet = function (tab) {
    const u = this.uid;
    this.vibe();

    const title = tab === 'settings' ? 'Settings' :
                  tab === 'playlist' ? 'Up Next' :
                  'History';

    this.qs('#sheet-title-' + u).textContent = title;
    const content = this.qs('#sheet-content-' + u);
    content.innerHTML = '';

    if (tab === 'settings') {
      content.innerHTML =
        '<div class="mp-sheet-item"><span>Speed</span><span>' + this.state.speed + 'x</span></div>' +
        '<div class="mp-sheet-item">' +
          '<span>Autoplay Next</span>' +
          '<div class="mp-switch ' + (this.settings.autoplay ? 'on' : '') + '" id="sw-auto-' + u + '"></div>' +
        '</div>' +
        '<div class="mp-sheet-item">' +
          '<span>Resume Playback</span>' +
          '<div class="mp-switch ' + (this.settings.resume ? 'on' : '') + '" id="sw-resume-' + u + '"></div>' +
        '</div>' +
        '<div class="mp-sheet-item">' +
          '<span>Fill Screen</span>' +
          '<div class="mp-switch ' + (this.settings.fill ? 'on' : '') + '" id="sw-fill-' + u + '"></div>' +
        '</div>';

      const self = this;

      this.qs('#sw-auto-' + u).onclick = function (e) {
        self.settings.autoplay = !self.settings.autoplay;
        e.currentTarget.classList.toggle('on', self.settings.autoplay);
        Store.saveSet(self.settings);
      };

      this.qs('#sw-resume-' + u).onclick = function (e) {
        self.settings.resume = !self.settings.resume;
        e.currentTarget.classList.toggle('on', self.settings.resume);
        Store.saveSet(self.settings);
      };

      this.qs('#sw-fill-' + u).onclick = function (e) {
        const on = self.el.classList.toggle('mp-fill');
        self.settings.fill = on;
        e.currentTarget.classList.toggle('on', on);
        Store.saveSet(self.settings);
      };

    } else if (tab === 'playlist') {
      if (!this.meta.playlist.length) {
        content.innerHTML = '<div class="mp-empty">No related videos</div>';
      } else {
        const self = this;
        this.meta.playlist.slice(0, 15).forEach(function (v) {
          const item = document.createElement('div');
          item.className = 'mp-vid-item';
          item.innerHTML =
            '<img src="' + (v.thumb || ('https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg')) + '" loading="lazy">' +
            '<div class="vtitle">' + v.title + '</div>';
          item.onclick = function () {
            self.closeSheet();
            self.loadVideo(v);
          };
          content.appendChild(item);
        });
      }
    } else if (tab === 'history') {
      const hist = Store.getHist();

      if (!hist.length) {
        content.innerHTML = '<div class="mp-empty">No history yet</div>';
      } else {
        const self = this;
        hist.forEach(function (v) {
          const item = document.createElement('div');
          item.className = 'mp-vid-item';
          item.innerHTML =
            '<img src="' + v.thumb + '" loading="lazy">' +
            '<div class="vtitle">' + v.title + '</div>';
          item.onclick = function () {
            self.closeSheet();
            self.loadVideo(v);
          };
          content.appendChild(item);
        });
      }
    }

    this.sheet.classList.add('show');
  };

  MistaPlayer.prototype.closeSheet = function () {
    this.sheet.classList.remove('show');
  };

  /* =========================================================
     INIT YOUTUBE
     ========================================================= */
  MistaPlayer.prototype.initYT = function () {
    const self = this;
    loadYouTubeAPI().then(function () {
      self.createPlayer();
    }).catch(function (err) {
      console.error('[Mista] YT API load failed', err);
    });
  };

  /* =========================================================
     CREATE YOUTUBE PLAYER
     ========================================================= */
  MistaPlayer.prototype.createPlayer = function () {
    const self = this;
    const holderId = 'yt-iframe-holder-' + this.uid;

    let startAt = 0;
    if (this.settings.resume) {
      const p = Store.getProg(this.vid);
      if (p > RESUME_THRESHOLD_SECONDS) {
        startAt = p;
      }
    }

    this.player = new YT.Player(holderId, {
      videoId: this.vid,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        start: startAt,
        origin: window.location.origin || 'https://mistafy.pages.dev',
        enablejsapi: 1
      },
      events: {
        onReady: function () {
          if (self.player && self.player.setVolume) {
            self.player.setVolume(self.state.volume);
          }
          if (self.settings.autoplay && self.player && self.player.playVideo) {
            self.player.playVideo();
          }
        },
        onStateChange: function (e) {
          self.onState(e);
        },
        onError: function (e) {
          console.error('[Mista] YT error', e.data);
          const t = self.qs('#mp-title');
          if (t) t.textContent = 'Video unavailable (error ' + e.data + ')';
          const c = self.qs('#curtain-' + self.uid);
          if (c) c.classList.add('hide');
        }
      }
    });
  };

  /* =========================================================
     ON YOUTUBE STATE CHANGE
     ========================================================= */
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
      if (this.vid) {
        Store.addHist({ id: this.vid, title: this.meta.title });
      }

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

  /* =========================================================
     LOAD NEW VIDEO
     ========================================================= */
  MistaPlayer.prototype.loadVideo = function (video) {
    this.vid = video.id;
    this.meta.title = video.title || 'Video';

    const titleEl = this.qs('#mp-title');
    if (titleEl) titleEl.textContent = this.meta.title;

    if (this.player && this.player.loadVideoById) {
      let start = 0;
      if (this.settings.resume) {
        const p = Store.getProg(this.vid);
        if (p > RESUME_THRESHOLD_SECONDS) {
          start = p;
        }
      }
      this.player.loadVideoById({
        videoId: video.id,
        startSeconds: start
      });
    }

    this.fetchMeta(video.id);
  };

  /* =========================================================
     TICKER — Updates seek bar, times
     ========================================================= */
  MistaPlayer.prototype.startTicker = function () {
    const self = this;
    const u = this.uid;

    clearInterval(this.tickTimer);

    this.tickTimer = setInterval(function () {
      if (!self.player) return;
      if (!self.player.getCurrentTime || !self.player.getDuration) return;

      const cur = self.player.getCurrentTime() || 0;
      const dur = self.player.getDuration() || 1;

      if (cur > MIN_PROGRESS_SECONDS) {
        Store.saveProg(self.vid, Math.floor(cur));
      }

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

    }, TICK_INTERVAL_MS);
  };

  /* =========================================================
     FETCH METADATA FROM NOEMBED
     ========================================================= */
  MistaPlayer.prototype.fetchMeta = function (id) {
    const self = this;

    fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + id)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        self.meta.title = data.title || 'Video';
        const titleEl = self.qs('#mp-title');
        if (titleEl) titleEl.textContent = self.meta.title;
        Store.addHist({ id: id, title: self.meta.title });
      })
      .catch(function () {
        const titleEl = self.qs('#mp-title');
        if (titleEl) titleEl.textContent = 'Video';
      });
  };

  /* =========================================================
     SECTION 7: AUTO-INIT
     ========================================================= */
  function initAll() {
    const elements = document.querySelectorAll(
      '[data-mista], .mista-embed, [data-vid]'
    );

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.mista) continue;

      try {
        el.mista = new MistaPlayer(el);
      } catch (err) {
        console.error('[Mista] Init failed', err);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* =========================================================
     SECTION 8: GLOBAL EXPOSURE
     ========================================================= */
  window.MistaPlayer = MistaPlayer;

  /* =========================================================
     END OF FILE
     ========================================================= */

})();
