// ========== REACT TYPESCRIPT COMPONENT (for reference/future use) ==========
// This file provides TypeScript interfaces and a React component blueprint
// for the Ultra Custom IFRAME Loader. Use with React + TypeScript setup.

// ---------- TYPES ----------
interface UTMConfig {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

interface HeaderConfig {
  trackingID: string;
  source: string;
  campaign: string;
}

interface ResizeConfig {
  enabled: boolean;
  aspectRatio: string;
  minHeight: string;
  maxHeight: string;
}

interface VisualConfig {
  width: string;
  height: string;
  sandbox: string;
  scrolling: string;
  borderSize: string;
  borderColor: string;
  zoomLevel: number;
  customCSS: string;
}

interface AnalyticsEvent {
  eventType: string;
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

interface IframeLoaderState {
  siteUrl: string;
  mode: string;
  apiKey: string;
  keyFormat: string;
  useApiKey: boolean;
  headers: HeaderConfig;
  utm: UTMConfig;
  encryptParams: boolean;
  resize: ResizeConfig;
  visual: VisualConfig;
  analyticsEndpoint: string;
  queue: AnalyticsEvent[];
  failedRetries: number;
}

// Default values
const defaultState: IframeLoaderState = {
  siteUrl: "example.com",
  mode: "direct",
  apiKey: "",
  keyFormat: "apikey",
  useApiKey: false,
  headers: {
    trackingID: "",
    source: "",
    campaign: ""
  },
  utm: {
    source: "iframe_loader",
    medium: "embed",
    campaign: "custom_viewer",
    term: "",
    content: ""
  },
  encryptParams: false,
  resize: {
    enabled: true,
    aspectRatio: "16:9",
    minHeight: "400px",
    maxHeight: "2000px"
  },
  visual: {
    width: "100%",
    height: "85vh",
    sandbox: "",
    scrolling: "auto",
    borderSize: "3px",
    borderColor: "#ffffff",
    zoomLevel: 1,
    customCSS: ""
  },
  analyticsEndpoint: "https://httpbin.org/post",
  queue: [],
  failedRetries: 0
};

// ---------- HELPER CLASS ----------
class IframeLoaderEngine {
  private queue: AnalyticsEvent[] = [];
  private failedRetries = 0;
  private queueTimer: number | null = null;
  private isFlushing = false;

  // SHA-256 encryption
  async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // Build URL with all parameters
  async buildUrl(config: IframeLoaderState): Promise<string> {
    let url = config.siteUrl.trim();
    if (!url) return "about:blank";

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Apply path mode
    switch(config.mode) {
      case "pathHome": url = url.replace(/\/?$/, "") + "/home"; break;
      case "pathIndex": url = url.replace(/\/?$/, "") + "/index.html"; break;
      case "pathEmbed": url = url.replace(/\/?$/, "") + "/embed"; break;
      case "pathDashboard": url = url.replace(/\/?$/, "") + "/dashboard"; break;
      case "pathMobile": url = url.replace(/\/?$/, "") + "/mobile"; break;
      case "pathViewer": url = url.replace(/\/?$/, "") + "/viewer"; break;
      case "queryIframe":
        url = url + (url.includes("?") ? "&" : "?") + "iframe=true";
        break;
      case "queryEmbed":
        url = url + (url.includes("?") ? "&" : "?") + "embed=true";
        break;
      case "queryUTM": {
        const sep = url.includes("?") ? "&" : "?";
        url = `${url}${sep}utm_source=${encodeURIComponent(config.utm.source)}`;
        url += `&utm_medium=${encodeURIComponent(config.utm.medium)}`;
        url += `&utm_campaign=${encodeURIComponent(config.utm.campaign)}`;
        if (config.utm.term) url += `&utm_term=${encodeURIComponent(config.utm.term)}`;
        if (config.utm.content) url += `&utm_content=${encodeURIComponent(config.utm.content)}`;
        break;
      }
    }

    // API key
    if (config.useApiKey && config.apiKey) {
      const sep = url.includes("?") ? "&" : "?";
      url += `${sep}${config.keyFormat}=${encodeURIComponent(config.apiKey)}`;
    }

    // Encryption
    if (config.encryptParams && url.includes("?")) {
      const [base, qs] = url.split("?");
      const hash = await this.sha256(qs);
      url = `${base}?h=${hash}&qs=${encodeURIComponent(qs)}`;
    }

    return url;
  }

  // Enqueue analytics event
  enqueueEvent(eventType: string, data: Record<string, unknown>): void {
    this.queue.push({ eventType, data, timestamp: Date.now(), retries: 0 });
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.queueTimer) return;
    this.queueTimer = window.setTimeout(() => {
      this.queueTimer = null;
      this.flushQueue("https://httpbin.org/post");
    }, 2000);
  }

  async flushQueue(endpoint: string): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing) return;
    this.isFlushing = true;

    const batch = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: batch, sentAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      this.failedRetries = Math.max(0, this.failedRetries - batch.length);
    } catch (err) {
      this.failedRetries += batch.length;
      batch.forEach(ev => {
        ev.retries++;
        if (ev.retries < 5) {
          const delay = Math.min(60000, 1000 * Math.pow(2, ev.retries));
          setTimeout(() => {
            this.queue.push(ev);
            this.scheduleFlush();
          }, delay);
        }
      });
    }
    this.isFlushing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getFailedRetries(): number {
    return this.failedRetries;
  }

  clearQueue(): void {
    this.queue = [];
    this.failedRetries = 0;
  }
}

// Export for bundlers
export { IframeLoaderEngine, defaultState };
export type { IframeLoaderState, UTMConfig, HeaderConfig, ResizeConfig, VisualConfig, AnalyticsEvent };

console.log("%c⚛️ React/TypeScript blueprint loaded (app.tsx)", "color: cyan; font-weight: bold;");
console.log("%cUse this with: npx create-react-app --template typescript", "color: teal;");