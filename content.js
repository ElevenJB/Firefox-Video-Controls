// content.js
let panel = null;
let currentDomain = window.location.hostname || 'global';

const getStorageKey = (param) => `video_${param}_${currentDomain}`;

const getDefaultValues = () => ({
  sat: 100, bri: 100, con: 100, hue: 0, gray: 0, opa: 100
});

const loadSettings = () => {
  const defaults = getDefaultValues();
  return {
    sat: parseInt(localStorage.getItem(getStorageKey('sat')) || defaults.sat),
    bri: parseInt(localStorage.getItem(getStorageKey('bri')) || defaults.bri),
    con: parseInt(localStorage.getItem(getStorageKey('con')) || defaults.con),
    hue: parseInt(localStorage.getItem(getStorageKey('hue')) || defaults.hue),
    gray: parseInt(localStorage.getItem(getStorageKey('gray')) || defaults.gray),
    opa: parseInt(localStorage.getItem(getStorageKey('opa')) || defaults.opa)
  };
};

const saveSettings = (settings) => {
  Object.keys(settings).forEach(key => {
    localStorage.setItem(getStorageKey(key), settings[key]);
  });
};

const applyFilters = (video) => {
  if (!video) return;
  const s = loadSettings();
  video.style.filter = `
    saturate(${s.sat}%) 
    brightness(${s.bri}%) 
    contrast(${s.con}%) 
    hue-rotate(${s.hue}deg) 
    grayscale(${s.gray}%) 
    opacity(${s.opa}%)
  `;
};

const applyToAllVideos = () => {
  document.querySelectorAll('video').forEach(applyFilters);
};

const createPanel = () => {
  if (panel) {
    panel.style.display = 'block';
    return;
  }

  panel = document.createElement('div');
  panel.id = 'video-color-panel';
  panel.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 2147483647;
    background: #1f1f1f; color: #eee; padding: 16px; border-radius: 12px;
    font-family: system-ui, -apple-system, sans-serif; font-size: 14px;
    min-width: 280px; box-shadow: 0 15px 35px rgba(0,0,0,0.6);
    border: 1px solid #333; user-select: none;
  `;

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #444; padding-bottom:8px;">
      <strong style="font-size:16px;">🎨 Video Enhancer</strong>
      <button id="close-panel" style="background:none;border:none;color:#aaa;font-size:20px;cursor:pointer;padding:0 6px;">×</button>
    </div>

    <div class="slider-group"><label>Saturation <span id="sat-val">100</span>%</label><input type="range" id="sat" min="0" max="300" value="100"></div>
    <div class="slider-group"><label>Brightness <span id="bri-val">100</span>%</label><input type="range" id="bri" min="0" max="300" value="100"></div>
    <div class="slider-group"><label>Contrast <span id="con-val">100</span>%</label><input type="range" id="con" min="0" max="300" value="100"></div>
    <div class="slider-group"><label>Hue <span id="hue-val">0</span>°</label><input type="range" id="hue" min="0" max="360" value="0"></div>
    <div class="slider-group"><label>Grayscale <span id="gray-val">0</span>%</label><input type="range" id="gray" min="0" max="100" value="0"></div>
    <div class="slider-group"><label>Opacity <span id="opa-val">100</span>%</label><input type="range" id="opa" min="10" max="100" value="100"></div>

    <div style="margin:15px 0 10px; display:grid; grid-template-columns:repeat(auto-fit, minmax(80px,1fr)); gap:6px;">
      <button data-preset="cinematic" style="padding:6px; font-size:12px;">Cinematic</button>
      <button data-preset="vivid" style="padding:6px; font-size:12px;">Vivid</button>
      <button data-preset="warm" style="padding:6px; font-size:12px;">Warm</button>
      <button data-preset="cool" style="padding:6px; font-size:12px;">Cool</button>
      <button data-preset="highcon" style="padding:6px; font-size:12px;">High Contrast</button>
      <button data-preset="gray" style="padding:6px; font-size:12px;">B&W</button>
    </div>

    <button id="reset" style="width:100%; padding:10px; background:#333; border:none; color:white; border-radius:8px; cursor:pointer; margin-top:8px;">
      Reset All
    </button>
  `;

  document.body.appendChild(panel);

  // Style the sliders a bit nicer
  const style = document.createElement('style');
  style.textContent = `
    .slider-group { margin: 12px 0; }
    .slider-group label { display:block; margin-bottom:4px; font-size:13px; }
    input[type="range"] { width:100%; accent-color: #00aaff; }
  `;
  panel.appendChild(style);

  const sliders = {
    sat: panel.querySelector('#sat'),
    bri: panel.querySelector('#bri'),
    con: panel.querySelector('#con'),
    hue: panel.querySelector('#hue'),
    gray: panel.querySelector('#gray'),
    opa: panel.querySelector('#opa')
  };

  const update = () => {
    const values = {
      sat: sliders.sat.value,
      bri: sliders.bri.value,
      con: sliders.con.value,
      hue: sliders.hue.value,
      gray: sliders.gray.value,
      opa: sliders.opa.value
    };

    // Update displayed values
    Object.keys(values).forEach(k => {
      const valEl = panel.querySelector(`#${k}-val`);
      if (valEl) valEl.textContent = values[k];
    });

    saveSettings(values);
    applyToAllVideos();
  };

  Object.values(sliders).forEach(slider => {
    slider.addEventListener('input', update);
  });

  // Presets
  panel.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.preset;
      let vals = getDefaultValues();

      if (p === 'cinematic') { vals.con = 120; vals.sat = 85; vals.bri = 95; }
      else if (p === 'vivid') { vals.sat = 140; vals.con = 110; }
      else if (p === 'warm') { vals.hue = 15; vals.sat = 115; }
      else if (p === 'cool') { vals.hue = 200; vals.sat = 110; }
      else if (p === 'highcon') { vals.con = 150; vals.sat = 110; }
      else if (p === 'gray') { vals.gray = 100; }

      Object.keys(vals).forEach(k => sliders[k].value = vals[k]);
      update();
    });
  });

  panel.querySelector('#reset').addEventListener('click', () => {
    const def = getDefaultValues();
    Object.keys(def).forEach(k => sliders[k].value = def[k]);
    update();
  });

  panel.querySelector('#close-panel').addEventListener('click', () => {
    panel.style.display = 'none';
  });

  // Load current settings into sliders
  const loaded = loadSettings();
  Object.keys(loaded).forEach(k => {
    if (sliders[k]) sliders[k].value = loaded[k];
  });
  update(); // apply immediately
};

const togglePanel = () => {
  if (!panel) createPanel();
  else panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
};

// Monitor for new videos (YouTube, Netflix, etc.)
const observer = new MutationObserver(() => {
  applyToAllVideos();
});

observer.observe(document.documentElement, { childList: true, subtree: true });

// Initial run
applyToAllVideos();

// Keyboard message from background
browser.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'toggle-panel') togglePanel();
});

// Make it work better on sites that replace videos dynamically
setInterval(applyToAllVideos, 2000);
