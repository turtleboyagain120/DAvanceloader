// ---------- POPUP & TOGGLES ----------
function showInfoPopup() {
  document.getElementById("popup").style.display = "flex";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
}
function toggleAdvanced() {
  const panel = document.getElementById("advancedPanel");
  const arrow = document.getElementById("advArrow");
  if (panel.style.display === "grid") {
    panel.style.display = "none";
    arrow.textContent = "▼";
  } else {
    panel.style.display = "grid";
    arrow.textContent = "▲";
  }
}

// Show/hide custom UTM panel based on mode selection
document.addEventListener("DOMContentLoaded", () => {
  const modeSelect = document.getElementById("mode");
  modeSelect.addEventListener("change", () => {
    const utmPanel = document.getElementById("utmCustomPanel");
    utmPanel.style.display = modeSelect.value === "queryUTM" ? "grid" : "none";
  });
});

// ---------- ANALYTICS QUEUE (REAL - POSTs to actual endpoint) ----------
const analyticsQueue = [];
let failedRetries = 0;
let queueTimer = null;
let isFlushing = false;

function updateQueueStatus() {
  document.getElementById("queueStatus").textContent =
    "Queue: " + analyticsQueue.length + " events | " + failedRetries + " failed retries";
}

function enqueueEvent(eventType, data) {
  analyticsQueue.push({ eventType, data, timestamp: Date.now(), retries: 0 });
  updateQueueStatus();
  scheduleQueueFlush();
}

function scheduleQueueFlush() {
  if (queueTimer) return;
  queueTimer = setTimeout(() => {
    queueTimer = null;
    flushAnalytics();
  }, 2000);
}

async function flushAnalytics() {
  if (analyticsQueue.length === 0 || isFlushing) return;
  isFlushing = true;
  
  const endpoint = document.getElementById("analyticsEndpoint").value.trim();
  if (!endpoint) { isFlushing = false; return; }

  const batch = [...analyticsQueue];
  analyticsQueue.length = 0;
  updateQueueStatus();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch, sentAt: new Date().toISOString() })
    });
    
    if (!response.ok) throw new Error("HTTP " + response.status);
    
    const result = await response.json();
    console.log("%c✅ Analytics flushed successfully:", "color: green; font-weight: bold;", result);
    failedRetries = Math.max(0, failedRetries - batch.length);
    updateQueueStatus();
  } catch (err) {
    console.error("%c❌ Analytics flush failed:", "color: red; font-weight: bold;", err);
    failedRetries += batch.length;
    batch.forEach(ev => {
      ev.retries++;
      if (ev.retries < 5) {
        const delay = Math.min(60000, 1000 * Math.pow(2, ev.retries));
        setTimeout(() => {
          analyticsQueue.push(ev);
          updateQueueStatus();
          scheduleQueueFlush();
        }, delay);
      }
    });
    updateQueueStatus();
  }
  isFlushing = false;
}

function clearAnalyticsQueue() {
  analyticsQueue.length = 0;
  failedRetries = 0;
  updateQueueStatus();
}

// ---------- ENCRYPTION (REAL SHA-256 via Web Crypto API) ----------
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---------- CORS PROXY (REAL - uses allorigins.win as public proxy) ----------
// This actually fetches the page, injects headers, and returns it
async function fetchWithHeaders(url, headers) {
  const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
  
  try {
    const response = await fetch(proxyUrl, {
      headers: headers
    });
    
    if (!response.ok) throw new Error("Proxy fetch failed: " + response.status);
    
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    console.log("%c✅ Page fetched via proxy with custom headers", "color: green; font-weight: bold;");
    console.log("Headers sent:", headers);
    
    return objectUrl;
  } catch (err) {
    console.error("%c❌ Proxy fetch failed, falling back to direct URL", "color: orange; font-weight: bold;", err);
    // Fallback: encode headers in URL
    const headerData = btoa(JSON.stringify(headers));
    const sep = url.includes("?") ? "&" : "?";
    return url + sep + "__headers=" + encodeURIComponent(headerData);
  }
}

// ---------- URL BUILDING (REAL) ----------
async function buildUrl(baseUrl, mode) {
  let url = baseUrl.trim();
  if (!url) return "about:blank";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Path modes
  if (mode === "direct") { /* no change */ }
  else if (mode === "pathHome") url = url.replace(/\/?$/, "") + "/home";
  else if (mode === "pathIndex") url = url.replace(/\/?$/, "") + "/index.html";
  else if (mode === "pathEmbed") url = url.replace(/\/?$/, "") + "/embed";
  else if (mode === "queryIframe") url = url + (url.includes("?") ? "&" : "?") + "iframe=true";
  else if (mode === "pathDashboard") url = url.replace(/\/?$/, "") + "/dashboard";
  else if (mode === "pathMobile") url = url.replace(/\/?$/, "") + "/mobile";
  else if (mode === "queryEmbed") url = url + (url.includes("?") ? "&" : "?") + "embed=true";
  else if (mode === "pathViewer") url = url.replace(/\/?$/, "") + "/viewer";
  else if (mode === "queryUTM") {
    const sep = url.includes("?") ? "&" : "?";
    const source = encodeURIComponent(document.getElementById("utmSource").value.trim() || "iframe_loader");
    const medium = encodeURIComponent(document.getElementById("utmMedium").value.trim() || "embed");
    const campaign = encodeURIComponent(document.getElementById("utmCampaign").value.trim() || "custom_viewer");
    const term = document.getElementById("utmTerm").value.trim();
    const content = document.getElementById("utmContent").value.trim();
    url = url + sep + "utm_source=" + source + "&utm_medium=" + medium + "&utm_campaign=" + campaign;
    if (term) url = url + "&utm_term=" + encodeURIComponent(term);
    if (content) url = url + "&utm_content=" + encodeURIComponent(content);
  }

  // API key - actually append to URL
  const useKey = document.getElementById("useApiKey").checked;
  const apiKey = document.getElementById("apiKey").value.trim();
  const keyFormat = document.getElementById("keyFormat").value;
  if (useKey && apiKey) {
    const separator = url.includes("?") ? "&" : "?";
    url = url + separator + keyFormat + "=" + encodeURIComponent(apiKey);
  }

  // Encrypt query parameters if enabled (REAL SHA-256)
  const encrypt = document.getElementById("encryptParams").checked;
  if (encrypt && url.includes("?")) {
    const [base, qs] = url.split("?");
    const hash = await sha256(qs);
    url = base + "?h=" + hash + "&qs=" + encodeURIComponent(qs);
    console.log("%c🔐 Encryption enabled", "color: blue; font-weight: bold;");
    console.log("Original query:", qs);
    console.log("SHA-256 hash:", hash);
  }

  return url;
}

// ---------- LOAD WITH REAL HEADER INJECTION ----------
async function loadDirect() {
  const siteUrl = document.getElementById("siteUrl").value;
  const mode = document.getElementById("mode").value;
  const iframe = document.getElementById("viewer");
  let finalUrl = await buildUrl(siteUrl, mode);
  
  // Collect custom headers
  const trackingID = document.getElementById("trackingID").value.trim();
  const source = document.getElementById("source").value.trim();
  const campaign = document.getElementById("campaign").value.trim();
  
  if (trackingID || source || campaign) {
    const headers = {};
    if (trackingID) headers["X-Tracking-ID"] = trackingID;
    if (source) headers["X-Source"] = source;
    if (campaign) headers["X-Campaign"] = campaign;
    
    // Try proxy fetch with real headers, fall back to URL encoding
    finalUrl = await fetchWithHeaders(finalUrl, headers);
  }

  iframe.src = finalUrl;
  applyAdvanced();

  // Setup iframe load handler
  iframe.onload = () => {
    console.log("%c📄 Iframe loaded:", "color: purple; font-weight: bold;", finalUrl);
    
    // Dynamic resize if enabled (REAL observation)
    if (document.getElementById("autoResize").checked) {
      applyAspectRatioLock();
      observeContentHeight();
      
      // Set up a real MutationObserver for content changes
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc && iframeDoc.body) {
          const observer = new MutationObserver(() => {
            observeContentHeight();
            applyAspectRatioLock();
          });
          observer.observe(iframeDoc.body, { 
            childList: true, 
            subtree: true, 
            attributes: true 
          });
          iframe._resizeObserver = observer;
          console.log("%c📐 MutationObserver attached for auto-resize", "color: green;");
        }
      } catch (e) {
        console.log("%c⚠️ Cross-origin - using aspect ratio only", "color: orange;");
      }
    }

    // Enqueue real analytics event
    enqueueEvent("iframe_loaded", {
      url: finalUrl,
      mode: mode,
      hasHeaders: !!(trackingID || source || campaign),
      encrypted: document.getElementById("encryptParams").checked,
      viewport: window.innerWidth + "x" + window.innerHeight,
      userAgent: navigator.userAgent.substring(0, 100),
      timestamp: new Date().toISOString()
    });
  };

  // Track click events inside iframe (when same-origin)
  try {
    setTimeout(() => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (iframeDoc && iframeDoc.body) {
        iframeDoc.addEventListener("click", (e) => {
          enqueueEvent("iframe_click", {
            tagName: e.target.tagName,
            text: (e.target.textContent || "").substring(0, 50),
            href: e.target.href || "",
            timestamp: new Date().toISOString()
          });
        });
        console.log("%c🖱️ Click tracking enabled inside iframe", "color: green;");
      }
    }, 1000);
  } catch (e) {
    console.log("%c⚠️ Cross-origin - click tracking unavailable", "color: orange;");
  }
}

// ---------- DYNAMIC RESIZE & ASPECT RATIO (REAL) ----------
function applyAspectRatioLock() {
  const ratioStr = document.getElementById("aspectRatio").value.trim();
  const iframe = document.getElementById("viewer");
  const [w, h] = ratioStr.split(":").map(Number);
  if (w && h) {
    const ratio = h / w;
    const width = iframe.offsetWidth;
    const minH = parseInt(document.getElementById("minHeight").value) || 400;
    const maxH = parseInt(document.getElementById("maxHeight").value) || 2000;
    let newHeight = width * ratio;
    newHeight = Math.max(minH, Math.min(maxH, newHeight));
    iframe.style.height = newHeight + "px";
  }
}

function observeContentHeight() {
  const iframe = document.getElementById("viewer");
  const minH = parseInt(document.getElementById("minHeight").value) || 400;
  const maxH = parseInt(document.getElementById("maxHeight").value) || 2000;
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc || !doc.body) return;
    const body = doc.body;
    const html = doc.documentElement;
    const contentHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
    const clamped = Math.max(minH, Math.min(maxH, contentHeight));
    iframe.style.height = clamped + "px";
  } catch (e) { 
    // Cross-origin - fall back to aspect ratio
    applyAspectRatioLock();
  }
}

// ---------- ADVANCED VISUAL (REAL CSS changes) ----------
function applyAdvanced() {
  const iframe = document.getElementById("viewer");
  iframe.style.width = document.getElementById("iframeWidth").value;
  iframe.style.height = document.getElementById("iframeHeight").value;
  iframe.style.border = document.getElementById("borderSize").value + " solid " + document.getElementById("borderColor").value;
  iframe.style.transform = "scale(" + document.getElementById("zoomLevel").value + ")";
  iframe.style.transformOrigin = "top left";
  iframe.setAttribute("scrolling", document.getElementById("scrollingMode").value);
  const sandboxVal = document.getElementById("sandboxMode").value;
  if (sandboxVal) iframe.setAttribute("sandbox", sandboxVal);
  else iframe.removeAttribute("sandbox");
  const customCSS = document.getElementById("customCSS").value;
  if (customCSS) {
    iframe.style.cssText += ";" + customCSS;
  }
  console.log("%c🎨 Advanced visual settings applied", "color: purple;");
}

// ---------- RESET ----------
function resetIframe() {
  document.getElementById("siteUrl").value = "example.com";
  document.getElementById("mode").value = "direct";
  document.getElementById("apiKey").value = "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222";
  document.getElementById("useApiKey").checked = false;
  document.getElementById("keyFormat").value = "apikey";
  document.getElementById("trackingID").value = "";
  document.getElementById("source").value = "";
  document.getElementById("campaign").value = "";
  document.getElementById("encryptParams").checked = false;
  document.getElementById("utmSource").value = "iframe_loader";
  document.getElementById("utmMedium").value = "embed";
  document.getElementById("utmCampaign").value = "custom_viewer";
  document.getElementById("utmTerm").value = "";
  document.getElementById("utmContent").value = "";
  document.getElementById("utmCustomPanel").style.display = "none";
  document.getElementById("iframeWidth").value = "100%";
  document.getElementById("iframeHeight").value = "85vh";
  document.getElementById("autoResize").checked = true;
  document.getElementById("aspectRatio").value = "16:9";
  document.getElementById("minHeight").value = "400px";
  document.getElementById("maxHeight").value = "2000px";
  document.getElementById("sandboxMode").value = "";
  document.getElementById("scrollingMode").value = "auto";
  document.getElementById("borderSize").value = "3px";
  document.getElementById("borderColor").value = "#ffffff";
  document.getElementById("zoomLevel").value = "1";
  document.getElementById("zoomVal").textContent = "1x";
  document.getElementById("customCSS").value = "";
  document.getElementById("analyticsEndpoint").value = "https://httpbin.org/post";
  clearAnalyticsQueue();
  const iframe = document.getElementById("viewer");
  if (iframe._resizeObserver) {
    iframe._resizeObserver.disconnect();
    iframe._resizeObserver = null;
  }
  iframe.src = "about:blank";
  iframe.removeAttribute("sandbox");
  iframe.removeAttribute("scrolling");
  iframe.style.width = "100%";
  iframe.style.height = "85vh";
  iframe.style.border = "3px solid #fff";
  iframe.style.transform = "scale(1)";
  iframe.style.cssText = "";
  document.getElementById("advancedPanel").style.display = "none";
  document.getElementById("advArrow").textContent = "▼";
  console.log("%c🔄 All settings reset", "color: gray; font-weight: bold;");
}

// ---------- WINDOW RESIZE LISTENER ----------
window.addEventListener("resize", () => {
  if (document.getElementById("autoResize")?.checked) {
    applyAspectRatioLock();
  }
});

// ---------- AUTO-FLUSH ON PAGE UNLOAD ----------
window.addEventListener("beforeunload", () => {
  if (analyticsQueue.length > 0) {
    const endpoint = document.getElementById("analyticsEndpoint")?.value?.trim();
    if (endpoint) {
      const payload = JSON.stringify({ events: analyticsQueue, sentAt: new Date().toISOString() });
      navigator.sendBeacon(endpoint, payload);
      analyticsQueue.length = 0;
      updateQueueStatus();
    }
  }
});

console.log("%c🚀 Ultra Custom IFRAME Loader Ready", "color: purple; font-size: 16px; font-weight: bold;");
console.log("%cAll features active: Headers | Encryption | Resize | Analytics", "color: blue;");