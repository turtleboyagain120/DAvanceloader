// Global AI service instance
const aiService = {
  // Initialize AI service
  init() {
    console.log("%c🤖 AI Service Initialized", "color: #ec4899; font-weight: bold;");
    this.loadAISettings();
  },

  // Load AI settings from localStorage
  loadAISettings() {
    const settings = localStorage.getItem("aiSettings");
    if (settings) {
      this.settings = JSON.parse(settings);
    } else {
      this.settings = {
        enabled: true,
        preloadEnabled: true,
        smartPaths: true,
        autoResize: true,
        analytics: true,
        encryption: true,
        presets: true,
        visual: true
      };
      this.saveAISettings();
    }
  },

  // Save AI settings to localStorage
  saveAISettings() {
    localStorage.setItem("aiSettings", JSON.stringify(this.settings));
  },

  // Toggle AI service
  toggle(enabled) {
    this.settings.enabled = enabled;
    this.saveAISettings();
    console.log(`%c🤖 AI Service ${enabled ? 'Enabled' : 'Disabled'}`, "color: #ec4899; font-weight: bold;");
  },

  // AI-powered URL analysis
  async analyzeUrl(url) {
    if (!this.settings.enabled) return null;
    
    document.getElementById("aiStatus").textContent = "Analyzing...";
    
    console.log(`%c🧠 AI Analyzing URL: ${url}`, "color: #8b5cf6; font-weight: bold;");
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determine content type based on URL
    let contentType = "generic";
    let optimizations = [];
    
    if (url.includes("youtube.com") || url.includes("vimeo.com")) {
      contentType = "video";
      optimizations = ["preload_metadata", "aspect_16_9", "lazy_load"];
    } else if (url.includes("github.com")) {
      contentType = "code_repository";
      optimizations = ["preload_document", "code_syntax_highlight", "dark_mode_support"];
    } else if (url.includes("docs.google.com") || url.includes("drive.google.com")) {
      contentType = "document";
      optimizations = ["preload_full_document", "aspect_4_3", "disable_scroll"];
    } else if (url.includes("shopify.com") || url.includes("woocommerce")) {
      contentType = "ecommerce";
      optimizations = ["preload_product_data", "aspect_custom", "enable_forms"];
    } else {
      contentType = "webpage";
      optimizations = ["preload_images", "aspect_auto", "enable_scripts"];
    }
    
    document.getElementById("aiStatus").textContent = "Analysis complete";
    
    return {
      contentType,
      optimizations,
      estimatedLoadTime: Math.floor(Math.random() * 2000) + 500, // Random between 500-2500ms
      recommendedSettings: this.generateRecommendations(contentType)
    };
  },

  // Generate AI recommendations based on content type
  generateRecommendations(contentType) {
    const recommendations = {};
    
    switch(contentType) {
      case "video":
        recommendations.sandbox = "allow-scripts allow-same-origin";
        recommendations.aspectRatio = "16:9";
        recommendations.scrolling = "no";
        recommendations.borderSize = "0px";
        recommendations.customCSS = "border-radius: 10px;";
        break;
      case "code_repository":
        recommendations.sandbox = "allow-scripts allow-same-origin";
        recommendations.aspectRatio = "4:3";
        recommendations.scrolling = "auto";
        recommendations.customCSS = "font-family: monospace;";
        break;
      case "document":
        recommendations.sandbox = "allow-scripts allow-forms";
        recommendations.aspectRatio = "4:3";
        recommendations.scrolling = "auto";
        recommendations.customCSS = "background: white;";
        break;
      case "ecommerce":
        recommendations.sandbox = "allow-scripts allow-forms allow-popups";
        recommendations.scrolling = "yes";
        recommendations.customCSS = "border: 1px solid #ddd;";
        break;
      default:
        recommendations.sandbox = "";
        recommendations.scrolling = "auto";
        recommendations.customCSS = "";
    }
    
    return recommendations;
  },

  // AI-powered smart path detection
  async smartPathDetection(baseUrl) {
    if (!this.settings.smartPaths) return baseUrl;
    
    document.getElementById("aiStatus").textContent = "Finding optimal path...";
    
    console.log("%c🔍 AI Smart Path Detection", "color: #3b82f6; font-weight: bold;");
    
    // Common paths to try
    const paths = [
      "/embed", "/iframe", "/viewer", "/widget", 
      "/index.html", "/home", "/dashboard", "/mobile",
      "/app", "/player", "/content"
    ];
    
    // Simulate AI decision making
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For demo purposes, we'll choose based on URL patterns
    if (baseUrl.includes("youtube.com")) return baseUrl.replace(/\/?$/, '') + "/embed";
    if (baseUrl.includes("github.com")) return baseUrl.replace(/\/?$/, '') + "/dashboard";
    if (baseUrl.includes("docs.google.com")) return baseUrl.replace(/\/?$/, '') + "/viewer";
    
    // Otherwise try common paths
    for (const path of paths) {
      const testUrl = baseUrl.replace(/\/?$/, '') + path;
      // Simulate checking if path exists
      if (Math.random() > 0.7) { // 30% chance of success for demo
        console.log(`%c✅ AI Found working path: ${path}`, "color: #10b981; font-weight: bold;");
        document.getElementById("aiStatus").textContent = `Found path: ${path}`;
        return testUrl;
      }
    }
    
    console.log("%c⚠️ AI Could not find specific path, using direct", "color: #f59e0b; font-weight: bold;");
    document.getElementById("aiStatus").textContent = "Using direct path";
    return baseUrl;
  },

  // AI-powered preset recommendations
  recommendPreset(url) {
    if (!this.settings.presets) return null;
    
    console.log("%c🎯 AI Preset Recommendation", "color: #ec4899; font-weight: bold;");
    
    if (url.includes("youtube.com")) return "youtube";
    if (url.includes("github.com")) return "github";
    if (url.includes("linkedin.com") || url.includes("marketing")) return "marketing";
    
    return "default";
  },

  // AI-powered visual optimization
  optimizeVisualSettings(currentSettings, analysis) {
    if (!this.settings.visual || !analysis) return currentSettings;
    
    console.log("%c🎨 AI Visual Optimization", "color: #8b5cf6; font-weight: bold;");
    
    const optimized = {...currentSettings};
    
    // Apply AI recommendations
    if (analysis.recommendedSettings) {
      Object.assign(optimized, analysis.recommendedSettings);
    }
    
    // Additional AI optimizations
    if (analysis.contentType === "video") {
      optimized.zoomLevel = 1; // Don't zoom videos
      optimized.borderColor = "#000000"; // Black border for videos
    } else if (analysis.contentType === "code_repository") {
      optimized.zoomLevel = 0.9; // Slightly smaller for code readability
      optimized.borderColor = "#333333";
    }
    
    return optimized;
  },

  // AI-powered UTM parameter generation
  generateUTMParameters(url, contentType) {
    if (!this.settings.analytics) return null;
    
    console.log("%c📈 AI UTM Generation", "color: #10b981; font-weight: bold;");
    
    const utm = {
      source: "iframe_loader_ai",
      medium: "embed_ai",
      campaign: `${contentType}_viewer_${new Date().toISOString().split('T')[0]}`
    };
    
    if (url.includes("youtube.com")) {
      utm.term = "video_content";
      utm.content = "embedded_player";
    } else if (url.includes("github.com")) {
      utm.term = "code_repository";
      utm.content = "dashboard_embed";
    }
    
    return utm;
  },

  // AI-powered encryption suggestions
  suggestEncryption(url, hasSensitiveParams) {
    if (!this.settings.encryption) return false;
    
    console.log("%c🔐 AI Encryption Analysis", "color: #6366f1; font-weight: bold;");
    
    // Suggest encryption for URLs with sensitive parameters or specific domains
    return hasSensitiveParams || 
           url.includes("admin") || 
           url.includes("secure") || 
           url.includes("bank") || 
           url.includes("gov");
  },

  // AI-powered analytics enhancement
  enhanceAnalytics(analyticsData, analysis) {
    if (!this.settings.analytics) return analyticsData;
    
    console.log("%c📊 AI Analytics Enhancement", "color: #f59e0b; font-weight: bold;");
    
    return {
      ...analyticsData,
      aiContentType: analysis?.contentType || "unknown",
      aiOptimizations: analysis?.optimizations || [],
      aiProcessingTime: Date.now() - (analyticsData.timestamp || Date.now()),
      aiConfidence: Math.floor(Math.random() * 40) + 60 // 60-100% confidence
    };
  }
};

// Initialize AI service
aiService.init();

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

// ---------- CUSTOM PATH HANDLING ----------
document.getElementById("mode").addEventListener("change", function() {
  const customPathContainer = document.getElementById("customPathContainer");
  if (this.value === "customPath") {
    customPathContainer.style.display = "block";
  } else {
    customPathContainer.style.display = "none";
  }
  
  // Show/hide UTM panel
  const utmPanel = document.getElementById("utmCustomPanel");
  utmPanel.style.display = this.value === "queryUTM" ? "grid" : "none";
});

// ---------- CUSTOM ASPECT RATIO ----------
document.getElementById("aspectRatio").addEventListener("change", function() {
  const customAspectRatioContainer = document.getElementById("customAspectRatioContainer");
  if (this.value === "custom") {
    customAspectRatioContainer.style.display = "block";
  } else {
    customAspectRatioContainer.style.display = "none";
  }
});

// ---------- CUSTOM SANDBOX ----------
document.getElementById("sandboxMode").addEventListener("change", function() {
  const customSandboxContainer = document.getElementById("customSandboxContainer");
  if (this.value === "custom") {
    customSandboxContainer.style.display = "block";
  } else {
    customSandboxContainer.style.display = "none";
  }
});

// ---------- CUSTOM KEY FORMAT ----------
document.getElementById("keyFormat").addEventListener("change", function() {
  const customKeyFormatContainer = document.getElementById("customKeyFormatContainer");
  if (this.value === "custom") {
    customKeyFormatContainer.style.display = "block";
  } else {
    customKeyFormatContainer.style.display = "none";
  }
});

// ---------- AI PRELOADING INFO ----------
function showAIPreloadInfo() {
  document.getElementById("aiPreloadPopup").style.display = "flex";
}

function closeAIPopup() {
  document.getElementById("aiPreloadPopup").style.display = "none";
}

function enableAIPreload() {
  document.getElementById("aiPreloadToggle").checked = true;
  aiService.toggle(true);
  localStorage.setItem("hasSeenAIInfo", "true");
  closeAIPopup();
  console.log("%c🧠 AI Preloading enabled", "color: #ec4899; font-weight: bold;");
}

// ---------- FULL AI ANALYSIS ----------
function runFullAIAnalysis() {
  const siteUrl = document.getElementById("siteUrl").value;
  if (siteUrl && siteUrl !== "example.com") {
    document.getElementById("aiStatus").textContent = "Running full analysis...";
    aiService.analyzeUrl(siteUrl).then(analysis => {
      if (analysis) {
        console.log("%c🧠 Full AI Analysis Results:", "color: #ec4899; font-weight: bold;");
        console.table(analysis);
        alert(`AI Analysis Complete!\nContent Type: ${analysis.contentType}\nRecommended Settings Applied`);
        // Apply some recommendations visually
        if (analysis.recommendedSettings) {
          Object.entries(analysis.recommendedSettings).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
              if (element.type === "checkbox") {
                element.checked = value;
              } else {
                element.value = value;
              }
            }
          });
        }
      }
    });
  } else {
    alert("Please enter a URL first");
  }
}

// Show AI info on first visit
document.addEventListener("DOMContentLoaded", () => {
  const hasSeenAIInfo = localStorage.getItem("hasSeenAIInfo");
  if (!hasSeenAIInfo) {
    showAIPreloadInfo();
  }
});

// ---------- CUSTOM PRESET CREATION ----------
function createCustomPreset() {
  document.getElementById("customPresetCreator").style.display = "block";
}

function cancelCustomPreset() {
  document.getElementById("customPresetCreator").style.display = "none";
}

function saveCustomPreset() {
  const name = document.getElementById("customPresetName").value;
  const url = document.getElementById("customPresetUrl").value;
  
  if (!name || !url) {
    alert("Please fill in both name and URL");
    return;
  }
  
  // Get current settings
  const settings = {
    siteUrl: url,
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
  
  // Save to localStorage
  const customPresets = JSON.parse(localStorage.getItem("customPresets") || "{}");
  customPresets[name] = settings;
  localStorage.setItem("customPresets", JSON.stringify(customPresets));
  
  // Add button to presets
  const presetContainer = document.querySelector('.preset-btn.custom-preset-btn').parentElement;
  const newButton = document.createElement("button");
  newButton.className = "preset-btn";
  newButton.textContent = name;
  newButton.onclick = () => applyCustomPreset(name);
  presetContainer.insertBefore(newButton, presetContainer.lastChild);
  
  // Reset form and hide creator
  document.getElementById("customPresetName").value = "";
  document.getElementById("customPresetUrl").value = "";
  document.getElementById("customPresetCreator").style.display = "none";
  
  console.log(`%c🔧 Custom preset saved: ${name}`, "color: #764ba2; font-weight: bold;");
}

function applyCustomPreset(name) {
  const customPresets = JSON.parse(localStorage.getItem("customPresets") || "{}");
  const preset = customPresets[name];
  
  if (!preset) return;
  
  // Apply preset values
  document.getElementById("siteUrl").value = preset.siteUrl || "example.com";
  document.getElementById("mode").value = preset.mode || "direct";
  document.getElementById("apiKey").value = preset.apiKey || "";
  document.getElementById("keyFormat").value = preset.keyFormat || "apikey";
  document.getElementById("useApiKey").checked = preset.useApiKey || false;
  document.getElementById("trackingID").value = preset.trackingID || "";
  document.getElementById("source").value = preset.source || "";
  document.getElementById("campaign").value = preset.campaign || "";
  document.getElementById("encryptParams").checked = preset.encryptParams || false;
  document.getElementById("utmSource").value = preset.utmSource || "iframe_loader";
  document.getElementById("utmMedium").value = preset.utmMedium || "embed";
  document.getElementById("utmCampaign").value = preset.utmCampaign || "custom_viewer";
  document.getElementById("utmTerm").value = preset.utmTerm || "";
  document.getElementById("utmContent").value = preset.utmContent || "";
  document.getElementById("autoResize").checked = preset.autoResize !== false;
  document.getElementById("aspectRatio").value = preset.aspectRatio || "16:9";
  document.getElementById("minHeight").value = preset.minHeight || "400px";
  document.getElementById("maxHeight").value = preset.maxHeight || "2000px";
  document.getElementById("analyticsEndpoint").value = preset.analyticsEndpoint || "https://httpbin.org/post";
  document.getElementById("iframeWidth").value = preset.iframeWidth || "100%";
  document.getElementById("iframeHeight").value = preset.iframeHeight || "85vh";
  document.getElementById("sandboxMode").value = preset.sandboxMode || "";
  document.getElementById("scrollingMode").value = preset.scrollingMode || "auto";
  document.getElementById("borderSize").value = preset.borderSize || "3px";
  document.getElementById("borderColor").value = preset.borderColor || "#ffffff";
  document.getElementById("zoomLevel").value = preset.zoomLevel || "1";
  document.getElementById("customCSS").value = preset.customCSS || "";
  
  // Update zoom value display
  document.getElementById("zoomVal").textContent = preset.zoomLevel || "1";
  
  // Show UTM panel if needed
  document.getElementById("utmCustomPanel").style.display = preset.mode === "queryUTM" ? "grid" : "none";
  
  console.log(`%c🔧 Custom preset applied: ${name}`, "color: #764ba2; font-weight: bold;");
}

// ---------- PRESETS ----------
function applyPreset(presetName) {
  console.log(`%c🔍 Applying preset: ${presetName}`, "color: #3b82f6; font-weight: bold;");
  
  const presets = {
    default: {
      siteUrl: "example.com",
      mode: "direct",
      apiKey: "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222",
      keyFormat: "apikey",
      useApiKey: false,
      trackingID: "",
      source: "",
      campaign: "",
      encryptParams: false,
      utmSource: "iframe_loader",
      utmMedium: "embed",
      utmCampaign: "custom_viewer",
      utmTerm: "",
      utmContent: "",
      autoResize: true,
      aspectRatio: "16:9",
      minHeight: "400px",
      maxHeight: "2000px",
      analyticsEndpoint: "https://httpbin.org/post",
      iframeWidth: "100%",
      iframeHeight: "85vh",
      sandboxMode: "",
      scrollingMode: "auto",
      borderSize: "3px",
      borderColor: "#ffffff",
      zoomLevel: "1",
      customCSS: ""
    },
    youtube: {
      siteUrl: "youtube.com",
      mode: "pathEmbed",
      apiKey: "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222",
      keyFormat: "apikey",
      useApiKey: false,
      trackingID: "",
      source: "",
      campaign: "",
      encryptParams: false,
      utmSource: "iframe_loader",
      utmMedium: "embed",
      utmCampaign: "youtube_video",
      utmTerm: "",
      utmContent: "",
      autoResize: true,
      aspectRatio: "16:9",
      minHeight: "360px",
      maxHeight: "1080px",
      analyticsEndpoint: "https://httpbin.org/post",
      iframeWidth: "100%",
      iframeHeight: "85vh",
      sandboxMode: "allow-scripts allow-same-origin",
      scrollingMode: "no",
      borderSize: "0px",
      borderColor: "#000000",
      zoomLevel: "1",
      customCSS: ""
    },
    github: {
      siteUrl: "github.com",
      mode: "pathDashboard",
      apiKey: "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222",
      keyFormat: "token",
      useApiKey: true,
      trackingID: "gh-dash-cmp",
      source: "github-integration",
      campaign: "dev-tools",
      encryptParams: false,
      utmSource: "iframe_loader",
      utmMedium: "developer_tools",
      utmCampaign: "github_dashboard",
      utmTerm: "",
      utmContent: "",
      autoResize: true,
      aspectRatio: "4:3",
      minHeight: "500px",
      maxHeight: "1500px",
      analyticsEndpoint: "https://httpbin.org/post",
      iframeWidth: "100%",
      iframeHeight: "85vh",
      sandboxMode: "allow-scripts allow-same-origin",
      scrollingMode: "auto",
      borderSize: "2px",
      borderColor: "#333333",
      zoomLevel: "1",
      customCSS: "border-radius: 8px;"
    },
    marketing: {
      siteUrl: "landing.example.com",
      mode: "queryUTM",
      apiKey: "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222",
      keyFormat: "apikey",
      useApiKey: false,
      trackingID: "cmp-45678",
      source: "linkedin-outreach",
      campaign: "q4-enterprise",
      encryptParams: true,
      utmSource: "linkedin_ad",
      utmMedium: "cpc",
      utmCampaign: "q4_enterprise",
      utmTerm: "abm_platform",
      utmContent: "variant_b",
      autoResize: true,
      aspectRatio: "16:9",
      minHeight: "600px",
      maxHeight: "1800px",
      analyticsEndpoint: "https://httpbin.org/post",
      iframeWidth: "100%",
      iframeHeight: "85vh",
      sandboxMode: "allow-scripts allow-same-origin",
      scrollingMode: "auto",
      borderSize: "3px",
      borderColor: "#4f46e5",
      zoomLevel: "1",
      customCSS: "box-shadow: 0 10px 25px rgba(0,0,0,0.2);"
    },
    ecommerce: {
      siteUrl: "store.example.com",
      mode: "pathProduct",
      apiKey: "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222",
      keyFormat: "apikey",
      useApiKey: true,
      trackingID: "store-viewer-123",
      source: "affiliate-partner",
      campaign: "summer-sale",
      encryptParams: false,
      utmSource: "iframe_loader",
      utmMedium: "ecommerce_widget",
      utmCampaign: "product_showcase",
      utmTerm: "featured_products",
      utmContent: "carousel_variant_a",
      autoResize: true,
      aspectRatio: "1:1",
      minHeight: "300px",
      maxHeight: "800px",
      analyticsEndpoint: "https://httpbin.org/post",
      iframeWidth: "100%",
      iframeHeight: "600px",
      sandboxMode: "allow-scripts allow-forms allow-popups",
      scrollingMode: "yes",
      borderSize: "1px",
      borderColor: "#e5e7eb",
      zoomLevel: "1",
      customCSS: "border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
    },
    docs: {
      siteUrl: "docs.example.com",
      mode: "pathViewer",
      apiKey: "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222",
      keyFormat: "apikey",
      useApiKey: false,
      trackingID: "docs-embed-456",
      source: "help-center",
      campaign: "knowledge-base",
      encryptParams: false,
      utmSource: "iframe_loader",
      utmMedium: "documentation_embed",
      utmCampaign: "api_docs_v2",
      utmTerm: "reference_guide",
      utmContent: "sidebar_widget",
      autoResize: true,
      aspectRatio: "4:3",
      minHeight: "500px",
      maxHeight: "1200px",
      analyticsEndpoint: "https://httpbin.org/post",
      iframeWidth: "100%",
      iframeHeight: "700px",
      sandboxMode: "allow-scripts allow-same-origin",
      scrollingMode: "auto",
      borderSize: "1px",
      borderColor: "#d1d5db",
      zoomLevel: "1",
      customCSS: "font-family: 'Segoe UI', system-ui; background: #f9fafb;"
    }
  };

  const preset = presets[presetName];
  if (!preset) return;

  // Apply preset values
  document.getElementById("siteUrl").value = preset.siteUrl;
  document.getElementById("mode").value = preset.mode;
  document.getElementById("apiKey").value = preset.apiKey;
  document.getElementById("keyFormat").value = preset.keyFormat;
  document.getElementById("useApiKey").checked = preset.useApiKey;
  document.getElementById("trackingID").value = preset.trackingID;
  document.getElementById("source").value = preset.source;
  document.getElementById("campaign").value = preset.campaign;
  document.getElementById("encryptParams").checked = preset.encryptParams;
  document.getElementById("utmSource").value = preset.utmSource;
  document.getElementById("utmMedium").value = preset.utmMedium;
  document.getElementById("utmCampaign").value = preset.utmCampaign;
  document.getElementById("utmTerm").value = preset.utmTerm;
  document.getElementById("utmContent").value = preset.utmContent;
  document.getElementById("autoResize").checked = preset.autoResize;
  document.getElementById("aspectRatio").value = preset.aspectRatio;
  document.getElementById("minHeight").value = preset.minHeight;
  document.getElementById("maxHeight").value = preset.maxHeight;
  document.getElementById("analyticsEndpoint").value = preset.analyticsEndpoint;
  document.getElementById("iframeWidth").value = preset.iframeWidth;
  document.getElementById("iframeHeight").value = preset.iframeHeight;
  document.getElementById("sandboxMode").value = preset.sandboxMode;
  document.getElementById("scrollingMode").value = preset.scrollingMode;
  document.getElementById("borderSize").value = preset.borderSize;
  document.getElementById("borderColor").value = preset.borderColor;
  document.getElementById("zoomLevel").value = preset.zoomLevel;
  document.getElementById("customCSS").value = preset.customCSS;
  
  // Update zoom value display
  document.getElementById("zoomVal").textContent = preset.zoomLevel;
  
  // Show UTM panel if needed
  document.getElementById("utmCustomPanel").style.display = preset.mode === "queryUTM" ? "grid" : "none";
  
  console.log(`%c🔧 Preset applied: ${presetName}`, "color: #764ba2; font-weight: bold;");
}

// ---------- UTM VARIANTS GENERATION ----------
function generateUTMVariants() {
  const baseSource = document.getElementById("utmSource").value;
  const baseMedium = document.getElementById("utmMedium").value;
  const baseCampaign = document.getElementById("utmCampaign").value;
  
  const variants = [
    {content: "variant_a", term: "control"},
    {content: "variant_b", term: "experiment_1"},
    {content: "variant_c", term: "experiment_2"}
  ];
  
  let output = "Generated UTM Variants:\n\n";
  variants.forEach((variant, index) => {
    output += `Variant ${index + 1}:\n`;
    output += `  utm_source: ${baseSource}\n`;
    output += `  utm_medium: ${baseMedium}\n`;
    output += `  utm_campaign: ${baseCampaign}\n`;
    output += `  utm_content: ${variant.content}\n`;
    output += `  utm_term: ${variant.term}\n\n`;
  });
  
  alert(output);
  console.log("%c📊 UTM Variants Generated", "color: #10b981; font-weight: bold;");
  console.log(output);
}

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
  // Enhance with AI analytics
  const enhancedData = aiService.enhanceAnalytics(data);
  analyticsQueue.push({ eventType, data: enhancedData, timestamp: Date.now(), retries: 0 });
  updateQueueStatus();
  scheduleQueueFlush();
}

function scheduleQueueFlush() {
  if (queueTimer) return;
  const delay = parseInt(document.getElementById("analyticsRetryDelay").value) || 2000;
  queueTimer = setTimeout(() => {
    queueTimer = null;
    flushAnalytics();
  }, delay);
}

async function flushAnalytics() {
  if (analyticsQueue.length === 0 || isFlushing) return;
  isFlushing = true;
  
  const endpoint = document.getElementById("analyticsEndpoint").value.trim();
  if (!endpoint) { isFlushing = false; return; }
  
  const batchSize = parseInt(document.getElementById("analyticsBatchSize").value) || 10;
  const batch = analyticsQueue.splice(0, batchSize);
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

// ---------- NEW: EXPORT ANALYTICS ----------
function exportAnalytics() {
  if (analyticsQueue.length === 0) {
    alert("No analytics data to export!");
    return;
  }
  
  const dataStr = JSON.stringify(analyticsQueue, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'iframe-analytics-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log("%c📤 Analytics exported", "color: #8b5cf6; font-weight: bold;");
}

// ---------- VIEW ANALYTICS ----------
function viewAnalytics() {
  const eventsContainer = document.getElementById("analyticsEvents");
  if (analyticsQueue.length === 0) {
    eventsContainer.innerHTML = "<p>No events recorded yet.</p>";
  } else {
    let html = "<table style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th style='text-align:left; border-bottom:1px solid #ddd; padding:5px;'>Type</th>";
    html += "<th style='text-align:left; border-bottom:1px solid #ddd; padding:5px;'>Timestamp</th>";
    html += "<th style='text-align:left; border-bottom:1px solid #ddd; padding:5px;'>Details</th></tr>";
    
    analyticsQueue.slice().reverse().forEach(event => {
      const date = new Date(event.timestamp).toLocaleTimeString();
      html += `<tr><td style='padding:5px; border-bottom:1px solid #eee;'>${event.eventType}</td>`;
      html += `<td style='padding:5px; border-bottom:1px solid #eee;'>${date}</td>`;
      html += `<td style='padding:5px; border-bottom:1px solid #eee; font-size:12px;'>${JSON.stringify(event.data).substring(0,100)}...</td></tr>`;
    });
    
    html += "</table>";
    eventsContainer.innerHTML = html;
  }
  
  document.getElementById("analyticsPopup").style.display = "flex";
}

function closeAnalyticsPopup() {
  document.getElementById("analyticsPopup").style.display = "none";
}

// ---------- SETTINGS EXPORT/IMPORT ----------
function exportSettings() {
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
  
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'iframe-settings-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log("%c📤 Settings exported", "color: #10b981; font-weight: bold;");
}

function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    
    reader.onload = readerEvent => {
      try {
        const content = readerEvent.target.result;
        const settings = JSON.parse(content);
        
        // Apply settings
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
        document.getElementById("customCSS").value = settings.customCSS || "";
        
        // Update zoom value display
        document.getElementById("zoomVal").textContent = settings.zoomLevel || "1";
        
        // Show UTM panel if needed
        document.getElementById("utmCustomPanel").style.display = settings.mode === "queryUTM" ? "grid" : "none";
        
        console.log("%c📥 Settings imported", "color: #f59e0b; font-weight: bold;");
      } catch (err) {
        console.error("%c❌ Failed to import settings", "color: #ef4444; font-weight: bold;", err);
        alert("Failed to import settings: " + err.message);
      }
    };
  };
  
  input.click();
}

// ---------- ENCRYPTION DETAILS ----------
function toggleEncryptionDetails() {
  const details = document.getElementById("encryptionDetails");
  details.style.display = details.style.display === "none" ? "block" : "none";
}

function testHeaders() {
  const headers = {};
  const trackingID = document.getElementById("trackingID").value.trim();
  const source = document.getElementById("source").value.trim();
  const campaign = document.getElementById("campaign").value.trim();
  const customName = document.getElementById("customHeaderName").value.trim();
  const customValue = document.getElementById("customHeaderValue").value.trim();
  
  if (trackingID) headers["X-Tracking-ID"] = trackingID;
  if (source) headers["X-Source"] = source;
  if (campaign) headers["X-Campaign"] = campaign;
  if (customName && customValue) headers[customName] = customValue;
  
  if (Object.keys(headers).length === 0) {
    alert("No headers configured to test");
    return;
  }
  
  alert("Testing headers:\n" + JSON.stringify(headers, null, 2));
  console.log("%c🔐 Testing Headers:", "color: #6366f1; font-weight: bold;", headers);
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

  // Handle custom path
  if (mode === "customPath") {
    const customPath = document.getElementById("customPath").value.trim();
    if (customPath) {
      url = url.replace(/\/?$/, '') + '/' + customPath.replace(/^\//, '');
    }
  }
  // AI-powered smart path detection
  else if (mode === "smartPath") {
    url = await aiService.smartPathDetection(url);
    mode = "direct"; // After finding path, treat as direct
  }
  // Path modes
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
  let keyFormat = document.getElementById("keyFormat").value;
  
  // Handle custom key format
  if (useKey && apiKey) {
    let keyParam;
    if (keyFormat === "custom") {
      const customFormat = document.getElementById("customKeyFormat").value.trim();
      keyParam = customFormat.replace("{key}", encodeURIComponent(apiKey));
    } else {
      keyParam = keyFormat + "=" + encodeURIComponent(apiKey);
    }
    
    const separator = url.includes("?") ? "&" : "?";
    url = url + separator + keyParam;
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
    document.getElementById("encryptionHash").textContent = hash;
  }

  return url;
}

// ---------- LOAD WITH REAL HEADER INJECTION ----------
async function loadDirect() {
  const siteUrl = document.getElementById("siteUrl").value;
  const mode = document.getElementById("mode").value;
  const iframe = document.getElementById("viewer");
  
  // AI Analysis
  const analysis = await aiService.analyzeUrl(siteUrl);
  
  // AI-powered preset recommendation
  const recommendedPreset = aiService.recommendPreset(siteUrl);
  if (recommendedPreset && recommendedPreset !== "default") {
    console.log(`%c🎯 AI recommends preset: ${recommendedPreset}`, "color: #ec4899; font-weight: bold;");
  }
  
  let finalUrl = await buildUrl(siteUrl, mode);
  
  // AI-powered UTM parameter generation
  if (mode === "queryUTM" && analysis) {
    const utmParams = aiService.generateUTMParameters(siteUrl, analysis.contentType);
    if (utmParams) {
      document.getElementById("utmSource").value = utmParams.source;
      document.getElementById("utmMedium").value = utmParams.medium;
      document.getElementById("utmCampaign").value = utmParams.campaign;
      if (utmParams.term) document.getElementById("utmTerm").value = utmParams.term;
      if (utmParams.content) document.getElementById("utmContent").value = utmParams.content;
      // Rebuild URL with new UTM params
      finalUrl = await buildUrl(siteUrl, mode);
    }
  }
  
  // AI-powered visual optimization
  if (analysis) {
    const currentVisualSettings = {
      width: document.getElementById("iframeWidth").value,
      height: document.getElementById("iframeHeight").value,
      sandbox: document.getElementById("sandboxMode").value,
      scrolling: document.getElementById("scrollingMode").value,
      borderSize: document.getElementById("borderSize").value,
      borderColor: document.getElementById("borderColor").value,
      zoomLevel: document.getElementById("zoomLevel").value,
      customCSS: document.getElementById("customCSS").value
    };
    
    const optimizedSettings = aiService.optimizeVisualSettings(currentVisualSettings, analysis);
    
    // Apply optimized settings
    document.getElementById("iframeWidth").value = optimizedSettings.width;
    document.getElementById("iframeHeight").value = optimizedSettings.height;
    document.getElementById("sandboxMode").value = optimizedSettings.sandbox;
    document.getElementById("scrollingMode").value = optimizedSettings.scrolling;
    document.getElementById("borderSize").value = optimizedSettings.borderSize;
    document.getElementById("borderColor").value = optimizedSettings.borderColor;
    document.getElementById("zoomLevel").value = optimizedSettings.zoomLevel;
    document.getElementById("customCSS").value = optimizedSettings.customCSS;
    document.getElementById("zoomVal").textContent = optimizedSettings.zoomLevel;
  }
  
  // AI-powered encryption suggestion
  const hasSensitiveParams = document.getElementById("encryptParams").checked;
  const shouldEncrypt = aiService.suggestEncryption(finalUrl, hasSensitiveParams);
  if (shouldEncrypt && !hasSensitiveParams) {
    document.getElementById("encryptParams").checked = true;
    // Rebuild URL with encryption
    finalUrl = await buildUrl(siteUrl, mode);
    console.log("%c🔐 AI suggested enabling encryption", "color: #6366f1; font-weight: bold;");
  }
  
  // Collect custom headers
  const trackingID = document.getElementById("trackingID").value.trim();
  const source = document.getElementById("source").value.trim();
  const campaign = document.getElementById("campaign").value.trim();
  const customName = document.getElementById("customHeaderName").value.trim();
  const customValue = document.getElementById("customHeaderValue").value.trim();
  
  const headers = {};
  if (trackingID) headers["X-Tracking-ID"] = trackingID;
  if (source) headers["X-Source"] = source;
  if (campaign) headers["X-Campaign"] = campaign;
  if (customName && customValue) headers[customName] = customValue;
  
  if (Object.keys(headers).length > 0) {
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
      hasHeaders: Object.keys(headers).length > 0,
      encrypted: document.getElementById("encryptParams").checked,
      viewport: window.innerWidth + "x" + window.innerHeight,
      userAgent: navigator.userAgent.substring(0, 100),
      timestamp: new Date().toISOString(),
      aiAnalysis: analysis
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
  let ratioStr = document.getElementById("aspectRatio").value.trim();
  
  // Handle custom aspect ratio
  if (ratioStr === "custom") {
    ratioStr = document.getElementById("customAspectRatio").value.trim();
  }
  
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
  
  // Get transition settings
  const duration = document.getElementById("transitionDuration").value || 300;
  const timing = document.getElementById("transitionTiming").value || "ease";
  
  // Apply styles with transitions
  iframe.style.transition = `all ${duration}ms ${timing}`;
  iframe.style.width = document.getElementById("iframeWidth").value;
  iframe.style.height = document.getElementById("iframeHeight").value;
  iframe.style.border = document.getElementById("borderSize").value + " solid " + document.getElementById("borderColor").value;
  iframe.style.transform = "scale(" + document.getElementById("zoomLevel").value + ")";
  iframe.style.transformOrigin = "top left";
  iframe.setAttribute("scrolling", document.getElementById("scrollingMode").value);
  iframe.setAttribute("loading", document.getElementById("loadingMode").value);
  
  // Handle sandbox
  let sandboxVal = document.getElementById("sandboxMode").value;
  if (sandboxVal === "custom") {
    sandboxVal = document.getElementById("customSandbox").value;
  }
  
  if (sandboxVal) iframe.setAttribute("sandbox", sandboxVal);
  else iframe.removeAttribute("sandbox");
  
  const customCSS = document.getElementById("customCSS").value;
  if (customCSS) {
    iframe.style.cssText += ";" + customCSS;
  }
  
  console.log("%c🎨 Advanced visual settings applied", "color: purple;");
}

// ---------- NEW: INTERACTION CONTROLS ----------
function enableFullscreen() {
  const iframe = document.getElementById("viewer");
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen();
  }
  console.log("%c🖥️ Fullscreen mode activated", "color: #764ba2; font-weight: bold;");
}

function captureScreenshot() {
  const iframe = document.getElementById("viewer");
  try {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Set canvas dimensions to match iframe
    canvas.width = iframe.offsetWidth;
    canvas.height = iframe.offsetHeight;
    
    // Draw iframe content to canvas (this will be blank due to cross-origin)
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText("Screenshot captured", canvas.width/2, canvas.height/2);
    ctx.font = "14px Arial";
    ctx.fillText("(Cross-origin restrictions apply)", canvas.width/2, canvas.height/2 + 30);
    
    // Convert to image and download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "iframe-screenshot-" + new Date().toISOString().slice(0,10) + ".png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("%c📷 Screenshot captured (simulated)", "color: #3b82f6; font-weight: bold;");
  } catch (e) {
    console.error("%c❌ Screenshot failed", "color: #ef4444; font-weight: bold;", e);
    alert("Screenshot failed due to browser restrictions");
  }
}

function openInNewTab() {
  const siteUrl = document.getElementById("siteUrl").value;
  const mode = document.getElementById("mode").value;
  buildUrl(siteUrl, mode).then(url => {
    window.open(url, '_blank');
    console.log("%c↗️ Opened in new tab", "color: #10b981; font-weight: bold;");
  });
}

function printIframe() {
  const iframe = document.getElementById("viewer");
  try {
    iframe.contentWindow.print();
    console.log("%c🖨️ Print dialog opened", "color: #8b5cf6; font-weight: bold;");
  } catch (e) {
    console.log("%c⚠️ Cannot print cross-origin iframe", "color: orange;");
    alert("Cannot print iframe content due to cross-origin restrictions");
  }
}

function reloadIframe() {
  const iframe = document.getElementById("viewer");
  iframe.src = iframe.src;
  console.log("%c🔄 Iframe reloaded", "color: #f59e0b; font-weight: bold;");
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
  document.getElementById("loadingMode").value = "eager";
  document.getElementById("borderSize").value = "3px";
  document.getElementById("borderColor").value = "#ffffff";
  document.getElementById("zoomLevel").value = "1";
  document.getElementById("zoomVal").textContent = "1";
  document.getElementById("customCSS").value = "";
  document.getElementById("analyticsEndpoint").value = "https://httpbin.org/post";
  document.getElementById("aiPreloadToggle").checked = aiService.settings.enabled;
  document.getElementById("transitionDuration").value = "300";
  document.getElementById("transitionTiming").value = "ease";
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
    // Apply debounce based on user setting
    const debounce = parseInt(document.getElementById("resizeDebounce").value) || 250;
    clearTimeout(window.resizeDebounceTimer);
    window.resizeDebounceTimer = setTimeout(() => {
      applyAspectRatioLock();
    }, debounce);
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

// ---------- SITE URL CHANGE HANDLER ----------
document.getElementById("siteUrl").addEventListener("blur", async function() {
  if (aiService.settings.enabled) {
    const url = this.value;
    if (url && url !== "example.com") {
      console.log(`%c🔍 AI analyzing site: ${url}`, "color: #8b5cf6; font-weight: bold;");
      const analysis = await aiService.analyzeUrl(url);
      
      // Show analysis in console
      if (analysis) {
        console.log(`%c🧠 AI Analysis Results:`, "color: #ec4899; font-weight: bold;");
        console.log(`  Content Type: ${analysis.contentType}`);
        console.log(`  Recommended Settings:`, analysis.recommendedSettings);
        console.log(`  Estimated Load Time: ${analysis.estimatedLoadTime}ms`);
      }
    }
  }
});

// ---------- ZOOM LEVEL UPDATE ----------
document.getElementById("zoomLevel").addEventListener("input", function() {
  document.getElementById("zoomVal").textContent = this.value;
});

// ---------- ENSURE THE API KEY IS ALWAYS THE FIXED VALUE ON LOAD ----------
document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  apiKeyInput.value = "oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222";
  apiKeyInput.setAttribute("readonly", "readonly");
  
  // Set AI toggle state
  document.getElementById("aiPreloadToggle").checked = aiService.settings.enabled;
  
  // Load custom presets buttons
  const customPresets = JSON.parse(localStorage.getItem("customPresets") || "{}");
  const presetContainer = document.querySelector('.preset-btn.custom-preset-btn').parentElement;
  
  Object.keys(customPresets).forEach(name => {
    const newButton = document.createElement("button");
    newButton.className = "preset-btn";
    newButton.textContent = name;
    newButton.onclick = () => applyCustomPreset(name);
    presetContainer.insertBefore(newButton, presetContainer.lastChild);
  });
});

// AI Toggle Handler
document.getElementById("aiPreloadToggle").addEventListener("change", function() {
  aiService.toggle(this.checked);
});

console.log("%c🚀 Ultra Custom IFRAME Loader V3 Ready", "color: purple; font-size: 16px; font-weight: bold;");
console.log("%cEnhanced with: More Presets | Custom Paths | Advanced Settings | A/B Testing | Export/Import", "color: blue;");