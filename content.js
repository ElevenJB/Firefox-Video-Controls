// content.js - Cross-browser version
const runtime = typeof browser !== 'undefined' ? browser : chrome;

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

  // (Keep the same innerHTML as before - I'm omitting it here for brevity, copy from previous response)
  panel.innerHTML = `... [Paste the full panel HTML from the previous content.js here] ...`;

  document.body.appendChild(panel);

  // Rest of the panel logic (sliders, presets, etc.) remains exactly the same
  // ... [Copy the rest of the createPanel function from my previous response]
};

const togglePanel = () => {
  if (!panel) createPanel();
  else panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
};

// Monitor videos
const observer = new MutationObserver(applyToAllVideos);
observer.observe(document.documentElement, { childList: true, subtree: true });

applyToAllVideos();
setInterval(applyToAllVideos, 2000);

// Message listener (works for both browsers)
runtime.runtime.onMessage.addListener((msg) => {
  if (msg.command === 'toggle-panel') togglePanel();
});
