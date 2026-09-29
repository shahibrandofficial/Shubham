/* =========================================================
   Mista Player — Clean UI (FINAL WORKING)
   Host this as Ram.js on Vercel
   Accent: #00d4ff | Theme: dark
   ========================================================= */
(function () {
  'use strict';

  /* ========== STYLES ========== */
  if (!document.getElementById('mista-styles')) {
    var st = document.createElement('style');
    st.id = 'mista-styles';
    st.textContent = `
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{width:100%;height:100%;background:#000;overflow:hidden;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
        color:#fff;-webkit-tap-highlight-color:transparent;user-select:none;}
      .mp-container{position:absolute;inset:0;width:100%;height:100%;background:#000;overflow:hidden;}
      .mp-container #yt-iframe-holder,
      .mp-container iframe{position:absolute;inset:0;width:100%!important;height:100%!important;border:0;}
      .mp-curtain{position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center;z-index:9;transition:opacity .35s ease;}
      .mp-curtain.hide{opacity:0;visibility:hidden;}
      .mp-curtain::after{content:"";width:40px;height:40px;border-radius:50%;border:3px solid rgba(0,212,255,.2);border-top-color:#00d4ff;animation:mp-spin .8s linear infinite;}
      @keyframes mp-spin{to{transform:rotate(360deg);}}
      .mp-ui{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(180deg,rgba(0,0,0,.6) 0%,transparent 25%,transparent 65%,rgba(0,0,0,.8) 100%);opacity:0;transition:opacity .28s ease;pointer-events:none;}
      .mp-ui.show{opacity:1;pointer-events:auto;}
      .mp-top{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;gap:10px;}
      .mp-title{font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:65%;text-shadow:0 1px 3px rgba(0,0,0,.7);}
      .mp-top-right{display:flex;gap:4px;}
      .mp-btn{background:transparent;border:0;color:#fff;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;padding:0;transition:background .15s,transform .12s;}
      .mp-btn:hover{background:rgba(255,255,255,.15);}
      .mp-btn:active{transform:scale(.9);}
      .mp-btn svg{width:24px;height:24px;fill:currentColor;pointer-events:none;}
      .mp-center{display:flex;align-items:center;justify-content:center;gap:24px;flex:1;}
      .mp-center .mp-btn{width:60px;height:60px;border-radius:50%;}
      .mp-center .mp-btn svg{width:34px;height:34px;}
      .mp-bottom{display:flex;flex-direction:column;gap:8px;padding:8px 14px 16px;}
      .mp-seek-row{display:flex;align-items:center;gap:10px;}
      .mp-time{font-size:12px;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.75);min-width:38px;text-align:center;}
      .mp-seek-wrap{flex:1;position:relative;height:20px;display:flex;align-items:center;}
      .mp-range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:99px;background:linear-gradient(to right,#00d4ff 0%,#00d4ff var(--progress,0%),rgba(255,255,255,.3) var(--progress,0%),rgba(255,255,255,.3) 100%);outline:none;cursor:pointer;margin:0;}
      .mp-range::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#00d4ff;border:2px solid #fff;cursor:pointer;}
      .mp-range::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#00d4ff;border:2px solid #fff;cursor:pointer;}
      .mp-bottom-row{display:flex;align-items:center;gap:8px;}
      .mp-bottom-row .spacer{flex:1;}
      .mp-vol-wrap{display:flex;align-items:center;gap:6px;}
      .mp-vol-slider{-webkit-appearance:none;appearance:none;width:70px;height:4px;border-radius:99px;background:rgba(255,255,255,.3);outline:none;cursor:pointer;}
      .mp-vol-slider::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#00d4ff;cursor:pointer;}
      .mp-vol-slider::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#00d4ff;border:0;cursor:pointer;}
      .mp-osd{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.9);min-width:110px;padding:16px 20px;border-radius:14px;background:rgba(0,0,0,.75);display:flex;flex-direction:column;align-items:center;gap:6px;font-size:14px;font-weight:700;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;z-index:10;}
      .mp-osd.show{opacity:1;transform:translate(-50%,-50%) scale(1);}
      .mp-osd svg{width:32px;height:32px;fill:#fff;}
      .mp-ripple{position:absolute;top:50%;transform:translateY(-50%);width:100px;height:100px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:11px;font-weight:700;opacity:0;transition:opacity .2s;pointer-events:none;}
      .mp-ripple svg{width:32px;height:32px;fill:#fff;}
      .mp-ripple.left{left:15%;}
      .mp-ripple.right{right:15%;}
      .mp-ripple.show{opacity:1;}
      @media(max-width:520px){
        .mp-title{font-size:13px;max-width:55%;}
        .mp-center .mp-btn{width:50px;height:50px;}
        .mp-center .mp-btn svg{width:28px;height:28px;}
        .mp-vol-slider{width:50px;}
      }
    `;
    document.head.appendChild(st);
  }

  /* ========== ICONS ========== */
  function svg(d){return '<svg viewBox="0 0 24 24"><path d="'+d+'"/></svg>';}
  var IC = {
    play: svg('M8 5v14l11-7z'),
    pause: svg('M6 19h4V5H6v14zm8-14v14h4V5h-4z'),
    rw10: svg('M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z'),
    fw10: svg('M18.02 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z'),
    fs: svg('M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'),
    vol: svg('M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'),
    mute: svg('M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z'),
    bright: svg('M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z')
  };

  /* ========== YT API LOADER ========== */
  var ytPromise = null;
  function loadYT(){
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytPromise) return ytPromise;
    ytPromise = new Promise(function(resolve){
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function(){
        if (typeof prev === 'function') prev();
        resolve();
      };
      var s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return ytPromise;
  }

  /* ========== PLAYER CLASS ========== */
  function MistaPlayer(el){
    this.el = el;
    this.uid = 'mp' + Math.random().toString(36).slice(2,8);
    this.player = null;
    this.playing = false;
    this.locked = false;
    this.uiVisible = true;
    this.volume = 100;
    this.brightness = 100;
    this.isSeeking = false;
    this.vid = '';
    this.idleTimer = null;
    this.tickTimer = null;

    var src = el.getAttribute('data-src') || el.getAttribute('data-vid') || '';
    this.vid = this.extractId(src);

    this.render();
    this.bind();
    this.startTicker();

    if (this.vid) this.initPlayer();
    else {
      console.warn('[Mista] No video ID');
      var t = this.$('#mp-title');
      if (t) t.textContent = 'No video';
    }
  }

  MistaPlayer.prototype.extractId = function(v){
    if (!v) return '';
    var m = String(v).match(/(?:v=|\/|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : (v.length === 11 ? v : '');
  };

  MistaPlayer.prototype.$ = function(sel){
    return this.el.querySelector(sel);
  };

  MistaPlayer.prototype.render = function(){
    var uid = this.uid;
    this.el.classList.add('mp-container');
    this.el.innerHTML =
      '<div id="yt-iframe-holder-' + uid + '"></div>' +
      '<div class="mp-curtain" id="curtain-' + uid + '"></div>' +
      '<div class="mp-osd" id="osd-v-' + uid + '">' + IC.vol + '<span id="osd-v-t-' + uid + '">100</span></div>' +
      '<div class="mp-osd" id="osd-b-' + uid + '">' + IC.bright + '<span id="osd-b-t-' + uid + '">100</span></div>' +
      '<div class="mp-ripple left" id="rip-l-' + uid + '">' + IC.rw10 + '<span>10s</span></div>' +
      '<div class="mp-ripple right" id="rip-r-' + uid + '">' + IC.fw10 + '<span>10s</span></div>' +
      '<div class="mp-ui" id="ui-' + uid + '">' +
        '<div class="mp-top">' +
          '<div class="mp-title" id="mp-title">Video</div>' +
          '<div class="mp-top-right">' +
            '<button class="mp-btn" id="btn-lock-' + uid + '">' + svg('M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="mp-center">' +
          '<button class="mp-btn" id="btn-rw-' + uid + '">' + IC.rw10 + '</button>' +
          '<button class="mp-btn" id="btn-pp-' + uid + '">' + IC.play + '</button>' +
          '<button class="mp-btn" id="btn-fw-' + uid + '">' + IC.fw10 + '</button>' +
        '</div>' +
        '<div class="mp-bottom">' +
          '<div class="mp-seek-row">' +
            '<span class="mp-time" id="t-cur-' + uid + '">0:00</span>' +
            '<div class="mp-seek-wrap" id="seek-wrap-' + uid + '">' +
              '<input type="range" class="mp-range" id="seek-' + uid + '" min="0" max="100" step="0.1" value="0">' +
            '</div>' +
            '<span class="mp-time" id="t-dur-' + uid + '">0:00</span>' +
          '</div>' +
          '<div class="mp-bottom-row">' +
            '<div class="mp-vol-wrap">' +
              '<button class="mp-btn" id="btn-mute-' + uid + '">' + IC.vol + '</button>' +
              '<input type="range" class="mp-vol-slider" id="vol-' + uid + '" min="0" max="100" value="100">' +
            '</div>' +
            '<span class="spacer"></span>' +
            '<button class="mp-btn" id="btn-fs-' + uid + '">' + IC.fs + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var self = this;
    this.$('#btn-pp-' + uid).onclick = function(e){ e.stopPropagation(); self.togglePlay(); };
    this.$('#btn-rw-' + uid).onclick = function(e){ e.stopPropagation(); self.skip(-10); };
    this.$('#btn-fw-' + uid).onclick = function(e){ e.stopPropagation(); self.skip(10); };
    this.$('#btn-fs-' + uid).onclick = function(e){ e.stopPropagation(); self.toggleFS(); };
    this.$('#btn-mute-' + uid).onclick = function(e){ e.stopPropagation(); self.toggleMute(); };
    this.$('#btn-lock-' + uid).onclick = function(e){
      e.stopPropagation();
      self.locked = !self.locked;
      self.setUI(!self.locked);
    };

    this.$('#vol-' + uid).oninput = function(e){
      var v = parseInt(e.target.value) || 0;
      self.volume = v;
      if (self.player && self.player.setVolume) self.player.setVolume(v);
      self.$('#btn-mute-' + uid).innerHTML = v === 0 ? IC.mute : IC.vol;
    };

    var seek = this.$('#seek-' + uid);
    var seekWrap = this.$('#seek-wrap-' + uid);
    var updateFill = function(v){ seekWrap.style.setProperty('--progress', v + '%'); };
    seek.addEventListener('input', function(e){
      self.isSeeking = true;
      var v = parseFloat(e.target.value) || 0;
      updateFill(v);
      if (self.player && self.player.getDuration){
        var dur = self.player.getDuration() || 0;
        self.$('#t-cur-' + uid).textContent = self.fmt(v/100*dur);
      }
    });
    seek.addEventListener('change', function(){
      if (self.player && self.player.getDuration && self.player.seekTo){
        var dur = self.player.getDuration() || 0;
        self.player.seekTo(parseFloat(seek.value)/100*dur, true);
      }
      self.isSeeking = false;
      self.resetIdle();
    });
    updateFill(0);
  };

  MistaPlayer.prototype.bind = function(){
    var self = this;
    var uid = this.uid;
    var el = this.el;
    var startX = 0, startY = 0, mode = null, lastTap = 0;

    el.addEventListener('touchstart', function(e){
      if (self.locked || !e.touches[0]) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      mode = startX < el.offsetWidth / 2 ? 'bright' : 'vol';
      self._lastX = startX;
    }, { passive:true });

    el.addEventListener('touchmove', function(e){
      if (self.locked || !e.touches[0]) return;
      var dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) > 12){
        e.preventDefault();
        if (mode === 'vol'){
          var nv = Math.max(0, Math.min(100, self.volume + (dy > 0 ? 3 : -3)));
          self.volume = nv;
          if (self.player && self.player.setVolume) self.player.setVolume(nv);
          self.$('#vol-' + uid).value = nv;
          self.showOSD('v', nv);
        } else {
          var nb = Math.max(20, Math.min(100, self.brightness + (dy > 0 ? 3 : -3)));
          self.brightness = nb;
          el.style.filter = 'brightness(' + nb + '%)';
          self.showOSD('b', nb);
        }
        startY = e.touches[0].clientY;
      }
    }, { passive:false });

    el.addEventListener('click', function(){
      if (self.locked) return;
      var now = Date.now();
      if (now - lastTap < 300){
        clearTimeout(self._tapT);
        var side = (self._lastX || 0) < el.offsetWidth / 2 ? 'l' : 'r';
        self.skip(side === 'l' ? -10 : 10);
        var rip = self.$('#rip-' + side + '-' + uid);
        if (rip){
          rip.classList.add('show');
          setTimeout(function(){ rip.classList.remove('show'); }, 700);
        }
      } else {
        self._tapT = setTimeout(function(){
          self.uiVisible = !self.uiVisible;
          self.setUI(self.uiVisible);
        }, 250);
      }
      lastTap = now;
    });
  };

  MistaPlayer.prototype.setUI = function(v){
    this.uiVisible = v;
    var ui = this.$('#ui-' + this.uid);
    if (ui) ui.classList.toggle('show', v);
    if (v) this.resetIdle();
  };

  MistaPlayer.prototype.resetIdle = function(){
    var self = this;
    clearTimeout(this.idleTimer);
    if (this.playing && this.uiVisible){
      this.idleTimer = setTimeout(function(){ self.setUI(false); }, 3000);
    }
  };

  MistaPlayer.prototype.showOSD = function(type, val){
    var uid = this.uid;
    var osd = this.$('#osd-' + type + '-' + uid);
    var txt = this.$('#osd-' + type + '-t-' + uid);
    if (!osd || !txt) return;
    txt.textContent = Math.round(val);
    osd.classList.add('show');
    clearTimeout(this['_osdT_' + type]);
    var self = this;
    this['_osdT_' + type] = setTimeout(function(){ osd.classList.remove('show'); }, 800);
  };

  MistaPlayer.prototype.fmt = function(s){
    s = Math.max(0, Math.floor(s || 0));
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  };

  MistaPlayer.prototype.togglePlay = function(){
    if (!this.player) return;
    if (this.playing) this.player.pauseVideo();
    else this.player.playVideo();
  };

  MistaPlayer.prototype.skip = function(sec){
    if (!this.player || !this.player.getCurrentTime) return;
    this.player.seekTo(this.player.getCurrentTime() + sec, true);
  };

  MistaPlayer.prototype.toggleMute = function(){
    var uid = this.uid;
    var cur = parseInt(this.$('#vol-' + uid).value) || 0;
    var nv = cur > 0 ? 0 : (this._lastVol || 100);
    if (cur > 0) this._lastVol = cur;
    this.$('#vol-' + uid).value = nv;
    this.volume = nv;
    if (this.player && this.player.setVolume) this.player.setVolume(nv);
    this.$('#btn-mute-' + uid).innerHTML = nv === 0 ? IC.mute : IC.vol;
  };

  MistaPlayer.prototype.toggleFS = function(){
    if (document.fullscreenElement) document.exitFullscreen();
    else if (this.el.requestFullscreen) this.el.requestFullscreen();
    else if (this.el.webkitRequestFullscreen) this.el.webkitRequestFullscreen();
  };

  MistaPlayer.prototype.startTicker = function(){
    var self = this;
    var uid = this.uid;
    clearInterval(this.tickTimer);
    this.tickTimer = setInterval(function(){
      if (!self.playing || !self.player) return;
      if (!self.player.getCurrentTime || !self.player.getDuration) return;
      var cur = self.player.getCurrentTime() || 0;
      var dur = self.player.getDuration() || 1;
      if (!self.isSeeking){
        var seek = self.$('#seek-' + uid);
        var wrap = self.$('#seek-wrap-' + uid);
        if (seek && wrap){
          var val = (cur / dur) * 100;
          seek.value = val;
          wrap.style.setProperty('--progress', val + '%');
        }
      }
      var tCur = self.$('#t-cur-' + uid);
      var tDur = self.$('#t-dur-' + uid);
      if (tCur) tCur.textContent = self.fmt(cur);
      if (tDur) tDur.textContent = self.fmt(dur);
    }, 500);
  };

  MistaPlayer.prototype.initPlayer = function(){
    var self = this;
    loadYT().then(function(){ self.createPlayer(); })
           .catch(function(e){ console.error('[Mista] YT load failed', e); });
  };

  MistaPlayer.prototype.createPlayer = function(){
    var self = this;
    var holderId = 'yt-iframe-holder-' + this.uid;
    this.player = new YT.Player(holderId, {
      videoId: this.vid,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        controls: 0, modestbranding: 1, rel: 0, playsinline: 1,
        iv_load_policy: 3, disablekb: 1, fs: 0,
        origin: window.location.origin || 'https://mistafy.pages.dev',
        enablejsapi: 1
      },
      events: {
        onReady: function(){
          if (self.player && self.player.setVolume) self.player.setVolume(self.volume);
          if (self.player && self.player.playVideo) self.player.playVideo();
        },
        onStateChange: function(e){ self.onState(e); },
        onError: function(e){
          console.error('[Mista] YT error', e.data);
          var t = self.$('#mp-title');
          if (t) t.textContent = 'Error ' + e.data;
          var c = self.$('#curtain-' + self.uid);
          if (c) c.classList.add('hide');
        }
      }
    });
  };

  MistaPlayer.prototype.onState = function(e){
    if (!window.YT || !window.YT.PlayerState) return;
    var S = YT.PlayerState;
    var uid = this.uid;
    var pp = this.$('#btn-pp-' + uid);
    var curtain = this.$('#curtain-' + uid);
    var ui = this.$('#ui-' + uid);

    if (e.data === S.PLAYING){
      this.playing = true;
      if (pp) pp.innerHTML = IC.pause;
      if (curtain) curtain.classList.add('hide');
      if (ui) ui.classList.add('show');
      this.setUI(true);
    } else if (e.data === S.PAUSED || e.data === S.BUFFERING){
      this.playing = false;
      if (pp) pp.innerHTML = IC.play;
      this.setUI(true);
    } else if (e.data === S.ENDED){
      this.playing = false;
      if (pp) pp.innerHTML = IC.play;
      this.setUI(true);
    }
  };

  /* ========== AUTO INIT ========== */
  function initAll(){
    var els = document.querySelectorAll('[data-mista], [data-vid], .mista-embed');
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      if (el.mista) continue;
      try { el.mista = new MistaPlayer(el); }
      catch (err){ console.error('[Mista] Init failed', err); }
    }
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.MistaPlayer = MistaPlayer;
})();
