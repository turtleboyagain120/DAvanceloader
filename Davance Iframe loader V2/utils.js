// ========== UTILITY HELPERS ==========

// Debounce function - limits how often a function can fire
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function - ensures function runs at most once per interval
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// LocalStorage wrapper with JSON serialization
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("Storage full or unavailable:", e);
      return false;
    }
  },
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};

// URL validation
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Format bytes to human readable
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Generate random ID
function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Get query parameter from URL
function getQueryParam(param, url = window.location.href) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(param);
}

// Save current settings to localStorage
function saveSettings() {
  const settings = {
    siteUrl: document.getElementById("siteUrl").value,
    mode: document.getElementById("mode").value,
    apiKey: document.getElementById("apiKey").value,
    keyFormat: document.getElementById("keyFormat").value,
    useApiKey: document.getElementById("useApiKey").checked,
    trackingID: document.getElementById("trackingID").value,
    source: document.getElementById("source").value,
    campaign: document.getElementById("campaign").value,
    encryptParams: document.getElementById("encryptParams").checked,
    utmSource: document.getElementById("utmSource").value,
    utmMedium: document.getElementById("utmMedium").value,
    utmCampaign: document.getElementById("utmCampaign").value,
    utmTerm: document.getElementById("utmTerm").value,
    utmContent: document.getElementById("utmContent").value,
    autoResize: document.getElementById("autoResize").checked,
    aspectRatio: document.getElementById("aspectRatio").value,
    minHeight: document.getElementById("minHeight").value,
    maxHeight: document.getElementById("maxHeight").value,
    analyticsEndpoint: document.getElementById("analyticsEndpoint").value,
    iframeWidth: document.getElementById("iframeWidth").value,
    iframeHeight: document.getElementById("iframeHeight").value,
    sandboxMode: document.getElementById("sandboxMode").value,
    scrollingMode: document.getElementById("scrollingMode").value,
    borderSize: document.getElementById("borderSize").value,
    borderColor: document.getElementById("borderColor").value,
    zoomLevel: document.getElementById("zoomLevel").value,
    customCSS: document.getElementById("customCSS").value
  };
  Storage.set("iframeLoaderSettings", settings);
}

// Load settings from localStorage
function loadSettings() {
  const settings = Storage.get("iframeLoaderSettings");
  if (!settings) return;

  document.getElementById("siteUrl").value = settings.siteUrl || "example.com";
  document.getElementById("mode").value = settings.mode || "direct";
  document.getElementById("apiKey").value = settings.apiKey || "";
  document.getElementById("keyFormat").value = settings.keyFormat || "apikey";
  document.getElementById("useApiKey").checked = settings.useApiKey || false;
  document.getElementById("trackingID").value = settings.trackingID || "";
  document.getElementById("source").value = settings.source || "";
  document.getElementById("campaign").value = settings.campaign || "";
  document.getElementById("encryptParams").checked = settings.encryptParams || false;
  document.getElementById("utmSource").value = settings.utmSource || "iframe_loader";
  document.getElementById("utmMedium").value = settings.utmMedium || "embed";
  document.getElementById("utmCampaign").value = settings.utmCampaign || "custom_viewer";
  document.getElementById("utmTerm").value = settings.utmTerm || "";
  document.getElementById("utmContent").value = settings.utmContent || "";
  document.getElementById("autoResize").checked = settings.autoResize !== false;
  document.getElementById("aspectRatio").value = settings.aspectRatio || "16:9";
  document.getElementById("minHeight").value = settings.minHeight || "400px";
  document.getElementById("maxHeight").value = settings.maxHeight || "2000px";
  document.getElementById("analyticsEndpoint").value = settings.analyticsEndpoint || "https://httpbin.org/post";
  document.getElementById("iframeWidth").value = settings.iframeWidth || "100%";
  document.getElementById("iframeHeight").value = settings.iframeHeight || "85vh";
  document.getElementById("sandboxMode").value = settings.sandboxMode || "";
  document.getElementById("scrollingMode").value = settings.scrollingMode || "auto";
  document.getElementById("borderSize").value = settings.borderSize || "3px";
  document.getElementById("borderColor").value = settings.borderColor || "#ffffff";
  document.getElementById("zoomLevel").value = settings.zoomLevel || "1";
  document.getElementById("zoomVal").textContent = (settings.zoomLevel || "1") + "x";
  document.getElementById("customCSS").value = settings.customCSS || "";

  // Show UTM panel if saved mode was queryUTM
  if (settings.mode === "queryUTM") {
    document.getElementById("utmCustomPanel").style.display = "grid";
  }
}

// Export for use in other modules (kept as globals for simplicity)
console.log("%c🛠️ Utils loaded - Storage, debounce, throttle, formatBytes ready", "color: teal;");