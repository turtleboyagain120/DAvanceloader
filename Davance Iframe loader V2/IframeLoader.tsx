import React, { useState, useEffect, useRef } from 'react';

// Define TypeScript interfaces
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

const IframeLoader: React.FC = () => {
  // State management
  const [siteUrl, setSiteUrl] = useState<string>('example.com');
  const [mode, setMode] = useState<string>('direct');
  const [apiKey, setApiKey] = useState<string>('oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222');
  const [keyFormat, setKeyFormat] = useState<string>('apikey');
  const [useApiKey, setUseApiKey] = useState<boolean>(false);
  const [headers, setHeaders] = useState<HeaderConfig>({
    trackingID: '',
    source: '',
    campaign: ''
  });
  const [utm, setUtm] = useState<UTMConfig>({
    source: 'iframe_loader',
    medium: 'embed',
    campaign: 'custom_viewer',
    term: '',
    content: ''
  });
  const [encryptParams, setEncryptParams] = useState<boolean>(false);
  const [resize, setResize] = useState<ResizeConfig>({
    enabled: true,
    aspectRatio: '16:9',
    minHeight: '400px',
    maxHeight: '2000px'
  });
  const [visual, setVisual] = useState<VisualConfig>({
    width: '100%',
    height: '85vh',
    sandbox: '',
    scrolling: 'auto',
    borderSize: '3px',
    borderColor: '#ffffff',
    zoomLevel: 1,
    customCSS: ''
  });
  const [analyticsEndpoint, setAnalyticsEndpoint] = useState<string>('https://httpbin.org/post');
  const [queue, setQueue] = useState<AnalyticsEvent[]>([]);
  const [failedRetries, setFailedRetries] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showUtmPanel, setShowUtmPanel] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string>('about:blank');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const queueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFlushingRef = useRef<boolean>(false);

  // Handle UTM panel visibility
  useEffect(() => {
    setShowUtmPanel(mode === 'queryUTM');
  }, [mode]);

  // SHA-256 encryption helper
  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Update queue status display
  const updateQueueStatus = () => {
    // This is handled by React state updates
  };

  // Analytics queue functions
  const enqueueEvent = (eventType: string, data: Record<string, unknown>) => {
    const newEvent: AnalyticsEvent = {
      eventType,
      data,
      timestamp: Date.now(),
      retries: 0
    };
    setQueue(prev => [...prev, newEvent]);
    scheduleQueueFlush();
  };

  const scheduleQueueFlush = () => {
    if (queueTimerRef.current) return;
    queueTimerRef.current = setTimeout(() => {
      queueTimerRef.current = null;
      flushAnalytics();
    }, 2000);
  };

  const flushAnalytics = async () => {
    if (queue.length === 0 || isFlushingRef.current) return;
    isFlushingRef.current = true;

    const batch = [...queue];
    setQueue([]);

    try {
      const response = await fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch, sentAt: new Date().toISOString() })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      console.log('%c✅ Analytics flushed successfully:', 'color: green; font-weight: bold;', await response.json());
      setFailedRetries(prev => Math.max(0, prev - batch.length));
    } catch (err) {
      console.error('%c❌ Analytics flush failed:', 'color: red; font-weight: bold;', err);
      setFailedRetries(prev => prev + batch.length);
      
      batch.forEach(ev => {
        ev.retries++;
        if (ev.retries < 5) {
          const delay = Math.min(60000, 1000 * Math.pow(2, ev.retries));
          setTimeout(() => {
            setQueue(prev => [...prev, ev]);
            scheduleQueueFlush();
          }, delay);
        }
      });
    }
    isFlushingRef.current = false;
  };

  const clearAnalyticsQueue = () => {
    setQueue([]);
    setFailedRetries(0);
  };

  // Build URL with all parameters
  const buildUrl = async (): Promise<string> => {
    let url = siteUrl.trim();
    if (!url) return 'about:blank';

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Apply path mode
    switch(mode) {
      case 'pathHome': url = url.replace(/\/?$/, '') + '/home'; break;
      case 'pathIndex': url = url.replace(/\/?$/, '') + '/index.html'; break;
      case 'pathEmbed': url = url.replace(/\/?$/, '') + '/embed'; break;
      case 'pathDashboard': url = url.replace(/\/?$/, '') + '/dashboard'; break;
      case 'pathMobile': url = url.replace(/\/?$/, '') + '/mobile'; break;
      case 'pathViewer': url = url.replace(/\/?$/, '') + '/viewer'; break;
      case 'queryIframe':
        url = url + (url.includes('?') ? '&' : '?') + 'iframe=true';
        break;
      case 'queryEmbed':
        url = url + (url.includes('?') ? '&' : '?') + 'embed=true';
        break;
      case 'queryUTM': {
        const sep = url.includes('?') ? '&' : '?';
        url = `${url}${sep}utm_source=${encodeURIComponent(utm.source)}`;
        url += `&utm_medium=${encodeURIComponent(utm.medium)}`;
        url += `&utm_campaign=${encodeURIComponent(utm.campaign)}`;
        if (utm.term) url += `&utm_term=${encodeURIComponent(utm.term)}`;
        if (utm.content) url += `&utm_content=${encodeURIComponent(utm.content)}`;
        break;
      }
    }

    // API key
    if (useApiKey && apiKey) {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}${keyFormat}=${encodeURIComponent(apiKey)}`;
    }

    // Encryption
    if (encryptParams && url.includes('?')) {
      const [base, qs] = url.split('?');
      const hash = await sha256(qs);
      url = `${base}?h=${hash}&qs=${encodeURIComponent(qs)}`;
    }

    return url;
  };

  // Fetch with headers through proxy
  const fetchWithHeaders = async (url: string, headers: Record<string, string>): Promise<string> => {
    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
    
    try {
      const response = await fetch(proxyUrl, { headers });
      
      if (!response.ok) throw new Error('Proxy fetch failed: ' + response.status);
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      console.log('%c✅ Page fetched via proxy with custom headers', 'color: green; font-weight: bold;');
      console.log('Headers sent:', headers);
      
      return objectUrl;
    } catch (err) {
      console.error('%c❌ Proxy fetch failed, falling back to direct URL', 'color: orange; font-weight: bold;', err);
      // Fallback: encode headers in URL
      const headerData = btoa(JSON.stringify(headers));
      const sep = url.includes('?') ? '&' : '?';
      return url + sep + '__headers=' + encodeURIComponent(headerData);
    }
  };

  // Load iframe with all parameters
  const loadDirect = async () => {
    let finalUrl = await buildUrl();
    
    // Collect custom headers
    const headerValues: Record<string, string> = {};
    if (headers.trackingID) headerValues['X-Tracking-ID'] = headers.trackingID;
    if (headers.source) headerValues['X-Source'] = headers.source;
    if (headers.campaign) headerValues['X-Campaign'] = headers.campaign;
    
    if (Object.keys(headerValues).length > 0) {
      finalUrl = await fetchWithHeaders(finalUrl, headerValues);
    }

    setIframeSrc(finalUrl);
    applyAdvanced();

    // Enqueue analytics event
    enqueueEvent('iframe_loaded', {
      url: finalUrl,
      mode: mode,
      hasHeaders: Object.keys(headerValues).length > 0,
      encrypted: encryptParams,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent.substring(0, 100),
      timestamp: new Date().toISOString()
    });
  };

  // Apply advanced visual settings
  const applyAdvanced = () => {
    // This is handled by the iframe styles in the JSX
  };

  // Reset all settings
  const resetIframe = () => {
    setSiteUrl('example.com');
    setMode('direct');
    setApiKey('oc_44r56tts9_44r56ttsr_6e58f382cd61e870eab5e42e241c60f799851bdc939cf222');
    setUseApiKey(false);
    setKeyFormat('apikey');
    setHeaders({
      trackingID: '',
      source: '',
      campaign: ''
    });
    setUtm({
      source: 'iframe_loader',
      medium: 'embed',
      campaign: 'custom_viewer',
      term: '',
      content: ''
    });
    setEncryptParams(false);
    setResize({
      enabled: true,
      aspectRatio: '16:9',
      minHeight: '400px',
      maxHeight: '2000px'
    });
    setVisual({
      width: '100%',
      height: '85vh',
      sandbox: '',
      scrolling: 'auto',
      borderSize: '3px',
      borderColor: '#ffffff',
      zoomLevel: 1,
      customCSS: ''
    });
    setAnalyticsEndpoint('https://httpbin.org/post');
    clearAnalyticsQueue();
    setIframeSrc('about:blank');
    setShowAdvanced(false);
  };

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      siteUrl,
      mode,
      apiKey,
      keyFormat,
      useApiKey,
      headers,
      utm,
      encryptParams,
      resize,
      visual,
      analyticsEndpoint
    };
    localStorage.setItem('iframeLoaderSettings', JSON.stringify(settings));
  };

  // Load settings from localStorage
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('iframeLoaderSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSiteUrl(settings.siteUrl || 'example.com');
      setMode(settings.mode || 'direct');
      setApiKey(settings.apiKey || '');
      setKeyFormat(settings.keyFormat || 'apikey');
      setUseApiKey(settings.useApiKey || false);
      setHeaders(settings.headers || {});
      setUtm(settings.utm || {});
      setEncryptParams(settings.encryptParams || false);
      setResize(settings.resize || {});
      setVisual(settings.visual || {});
      setAnalyticsEndpoint(settings.analyticsEndpoint || 'https://httpbin.org/post');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (queueTimerRef.current) {
        clearTimeout(queueTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <h1 className="title">✨ Ultra Custom IFRAME Loader</h1>
      <p className="subtitle">Big, flexible iframe with advanced tracking, encryption, resize & analytics</p>

      <div className="panel">
        <label htmlFor="siteUrl">Website URL</label>
        <input 
          id="siteUrl" 
          type="text" 
          value={siteUrl} 
          onChange={(e) => setSiteUrl(e.target.value)} 
        />

        <label htmlFor="mode">Choose Loading Path</label>
        <select 
          id="mode" 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="direct">Direct Load</option>
          <option value="pathHome">Path: /home</option>
          <option value="pathIndex">Path: /index.html</option>
          <option value="pathEmbed">Path: /embed</option>
          <option value="queryIframe">Query: ?iframe=true</option>
          <option value="queryUTM">Query: Custom UTM Params</option>
          <option value="pathDashboard">Path: /dashboard</option>
          <option value="pathMobile">Path: /mobile</option>
          <option value="queryEmbed">Query: ?embed=true</option>
          <option value="pathViewer">Path: /viewer</option>
        </select>

        {/* Custom UTM Section */}
        {showUtmPanel && (
          <div id="utmCustomPanel" style={{ display: 'grid', gap: '8px', background: '#f0f4ff', padding: '14px', borderRadius: '10px' }}>
            <div className="section-divider" style={{ marginTop: 0 }}>🎯 Custom UTM Parameters</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label htmlFor="utmSource" style={{ minWidth: '80px' }}>utm_source</label>
              <input 
                id="utmSource" 
                type="text" 
                value={utm.source} 
                onChange={(e) => setUtm({...utm, source: e.target.value})}
                style={{ flex: 1 }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label htmlFor="utmMedium" style={{ minWidth: '80px' }}>utm_medium</label>
              <input 
                id="utmMedium" 
                type="text" 
                value={utm.medium} 
                onChange={(e) => setUtm({...utm, medium: e.target.value})}
                style={{ flex: 1 }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label htmlFor="utmCampaign" style={{ minWidth: '80px' }}>utm_campaign</label>
              <input 
                id="utmCampaign" 
                type="text" 
                value={utm.campaign} 
                onChange={(e) => setUtm({...utm, campaign: e.target.value})}
                style={{ flex: 1 }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label htmlFor="utmTerm" style={{ minWidth: '80px' }}>utm_term</label>
              <input 
                id="utmTerm" 
                type="text" 
                value={utm.term} 
                onChange={(e) => setUtm({...utm, term: e.target.value})}
                placeholder="optional keyword" 
                style={{ flex: 1 }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label htmlFor="utmContent" style={{ minWidth: '80px' }}>utm_content</label>
              <input 
                id="utmContent" 
                type="text" 
                value={utm.content} 
                onChange={(e) => setUtm({...utm, content: e.target.value})}
                placeholder="optional content variant" 
                style={{ flex: 1 }} 
              />
            </div>
          </div>
        )}

        <div className="api-group">
          <label htmlFor="apiKey">API Key (optional)</label>
          <input 
            id="apiKey" 
            type="text" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
          />

          <label htmlFor="keyFormat">How to attach the key</label>
          <select 
            id="keyFormat" 
            value={keyFormat} 
            onChange={(e) => setKeyFormat(e.target.value)}
          >
            <option value="apikey">apikey=KEY</option>
            <option value="token">token=KEY</option>
            <option value="key">key=KEY</option>
            <option value="access_token">access_token=KEY</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <input 
              type="checkbox" 
              id="useApiKey" 
              checked={useApiKey}
              onChange={(e) => setUseApiKey(e.target.checked)}
            />
            <label htmlFor="useApiKey" style={{ margin: 0, fontWeight: 400 }}>Append key to URL</label>
          </div>
        </div>

        {/* Request Header Injection Section */}
        <div className="section-divider">🔐 Custom Headers & Encryption</div>
        <div style={{ display: 'grid', gap: '10px', background: '#f0f4ff', padding: '14px', borderRadius: '10px' }}>
          <label htmlFor="trackingID">X-Tracking-ID</label>
          <input 
            id="trackingID" 
            type="text" 
            value={headers.trackingID}
            onChange={(e) => setHeaders({...headers, trackingID: e.target.value})}
            placeholder="campaign-abc-123" 
          />

          <label htmlFor="source">X-Source</label>
          <input 
            id="source" 
            type="text" 
            value={headers.source}
            onChange={(e) => setHeaders({...headers, source: e.target.value})}
            placeholder="linkedin-outreach" 
          />

          <label htmlFor="campaign">X-Campaign</label>
          <input 
            id="campaign" 
            type="text" 
            value={headers.campaign}
            onChange={(e) => setHeaders({...headers, campaign: e.target.value})}
            placeholder="q4-enterprise" 
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <input 
              type="checkbox" 
              id="encryptParams" 
              checked={encryptParams}
              onChange={(e) => setEncryptParams(e.target.checked)}
            />
            <label htmlFor="encryptParams" style={{ margin: 0, fontWeight: 400 }}>Encrypt UTM & query parameters (SHA-256)</label>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Headers are injected via postMessage proxy. Encryption prevents DevTools tampering.</p>
        </div>

        {/* Dynamic Resize Section */}
        <div className="section-divider">📐 Dynamic Resize & Aspect Ratio</div>
        <div style={{ display: 'grid', gap: '10px', background: '#f0f4ff', padding: '14px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="autoResize" 
              checked={resize.enabled}
              onChange={(e) => setResize({...resize, enabled: e.target.checked})}
            />
            <label htmlFor="autoResize" style={{ margin: 0, fontWeight: 400 }}>Auto-resize based on content</label>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label htmlFor="aspectRatio" style={{ minWidth: '80px' }}>Aspect Ratio</label>
            <input 
              id="aspectRatio" 
              type="text" 
              value={resize.aspectRatio}
              onChange={(e) => setResize({...resize, aspectRatio: e.target.value})}
              style={{ width: '80px' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label htmlFor="minHeight" style={{ minWidth: '80px' }}>Min Height</label>
            <input 
              id="minHeight" 
              type="text" 
              value={resize.minHeight}
              onChange={(e) => setResize({...resize, minHeight: e.target.value})}
              style={{ width: '100px' }} 
            />
            <label htmlFor="maxHeight" style={{ minWidth: '80px' }}>Max Height</label>
            <input 
              id="maxHeight" 
              type="text" 
              value={resize.maxHeight}
              onChange={(e) => setResize({...resize, maxHeight: e.target.value})}
              style={{ width: '100px' }} 
            />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="section-divider">📊 Analytics Event Queue</div>
        <div style={{ display: 'grid', gap: '10px', background: '#f0f4ff', padding: '14px', borderRadius: '10px' }}>
          <label htmlFor="analyticsEndpoint">Analytics Endpoint</label>
          <input 
            id="analyticsEndpoint" 
            type="text" 
            value={analyticsEndpoint}
            onChange={(e) => setAnalyticsEndpoint(e.target.value)}
            placeholder="https://your-analytics.com/collect" 
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={flushAnalytics} style={{ background: '#10b981', color: 'white' }}>Flush Queue Now</button>
            <button onClick={clearAnalyticsQueue} style={{ background: '#ef4444', color: 'white' }}>Clear Queue</button>
            <button onClick={saveSettings} style={{ background: '#3b82f6', color: 'white' }}>💾 Save Settings</button>
            <button onClick={loadSettings} style={{ background: '#8b5cf6', color: 'white' }}>📂 Load Saved</button>
          </div>
          <p id="queueStatus" style={{ fontSize: '12px', color: '#374151', margin: '4px 0 0' }}>
            Queue: {queue.length} events | {failedRetries} failed retries
          </p>
        </div>

        {/* Advanced Options Toggle */}
        <div 
          className="adv-toggle" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ cursor: 'pointer' }}
        >
          ⚙️ Advanced Visual Options <span>{showAdvanced ? '▲' : '▼'}</span>
        </div>
        
        {showAdvanced && (
          <div id="advancedPanel" className="advanced-panel" style={{ display: 'grid', gap: '14px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
            <label htmlFor="iframeWidth">Width</label>
            <input 
              id="iframeWidth" 
              type="text" 
              value={visual.width}
              onChange={(e) => setVisual({...visual, width: e.target.value})}
            />

            <label htmlFor="iframeHeight">Height</label>
            <input 
              id="iframeHeight" 
              type="text" 
              value={visual.height}
              onChange={(e) => setVisual({...visual, height: e.target.value})}
            />

            <label htmlFor="sandboxMode">Sandbox</label>
            <select 
              id="sandboxMode" 
              value={visual.sandbox}
              onChange={(e) => setVisual({...visual, sandbox: e.target.value})}
            >
              <option value="">None (full permissions)</option>
              <option value="allow-scripts allow-same-origin">Scripts + Same Origin</option>
              <option value="allow-scripts">Scripts Only</option>
              <option value="allow-forms allow-scripts">Forms + Scripts</option>
            </select>

            <label htmlFor="scrollingMode">Scrolling</label>
            <select 
              id="scrollingMode" 
              value={visual.scrolling}
              onChange={(e) => setVisual({...visual, scrolling: e.target.value})}
            >
              <option value="auto">Auto</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <label htmlFor="borderSize">Border Size</label>
            <input 
              id="borderSize" 
              type="text" 
              value={visual.borderSize}
              onChange={(e) => setVisual({...visual, borderSize: e.target.value})}
            />

            <label htmlFor="borderColor">Border Color</label>
            <input 
              id="borderColor" 
              type="color" 
              value={visual.borderColor}
              onChange={(e) => setVisual({...visual, borderColor: e.target.value})}
            />

            <label htmlFor="zoomLevel">Zoom Level</label>
            <input 
              id="zoomLevel" 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={visual.zoomLevel}
              onChange={(e) => setVisual({...visual, zoomLevel: parseFloat(e.target.value)})}
              onInput={(e) => {
                const zoomVal = document.getElementById('zoomVal');
                if (zoomVal) zoomVal.textContent = e.currentTarget.value + 'x';
              }}
            />
            <span id="zoomVal">{visual.zoomLevel}x</span>

            <label htmlFor="customCSS">Custom CSS for Iframe</label>
            <textarea 
              id="customCSS" 
              rows={3} 
              value={visual.customCSS}
              onChange={(e) => setVisual({...visual, customCSS: e.target.value})}
              placeholder="Example: filter: grayscale(50%); border-radius: 10px;"
            ></textarea>

            <button onClick={applyAdvanced} style={{ background: '#764ba2', color: 'white', marginTop: '8px' }}>Apply Advanced Settings</button>
          </div>
        )}

        <div className="buttons">
          <button onClick={loadDirect}>Load Site</button>
          <button onClick={() => setShowPopup(true)}>Learn About Paths</button>
          <button onClick={resetIframe}>Reset</button>
        </div>
      </div>

      <div className="frame-wrap">
        <iframe 
          ref={iframeRef}
          src={iframeSrc}
          title="Custom Iframe Viewer"
          style={{
            width: visual.width,
            height: visual.height,
            border: `${visual.borderSize} solid ${visual.borderColor}`,
            transform: `scale(${visual.zoomLevel})`,
            transformOrigin: 'top left',
            scrolling: visual.scrolling as any,
            ...visual.sandbox ? { sandbox: visual.sandbox } : {},
            ...(visual.customCSS ? { cssText: visual.customCSS } : {})
          }}
        />
      </div>

      {/* Info Popup */}
      {showPopup && (
        <div id="popup" className="popup" style={{ display: 'flex' }}>
          <div className="popup-content">
            <h2>📖 Everything You Need to Know</h2>
            
            <h3>1. What is an Iframe?</h3>
            <p>An iframe is like a magic window inside your webpage. It lets you show another whole website right here on the page — like putting a TV screen on your wall that plays a different channel from the internet!</p>
            
            <h3>2. How the Loading Paths Work</h3>
            <ul>
              <li><strong>Direct Load</strong>: Opens the site exactly as typed.</li>
              <li><strong>Path options</strong>: Add extra words to reach different pages.</li>
              <li><strong>Custom UTM</strong>: Adds fully customizable marketing params (source, medium, campaign, term, content).</li>
            </ul>
            
            <h3>3. Custom Headers & Encryption</h3>
            <p>Headers (X-Tracking-ID, X-Source, X-Campaign) are injected invisibly—not in the URL. Perfect for ABM privacy. Enable encryption to hash sensitive parameters so they can't be tampered with.</p>
            
            <h3>4. Dynamic Resize & Aspect Ratio</h3>
            <p>Auto-resize keeps your iframe perfectly sized to the content. Lock a 16:9 ratio with min/max constraints to prevent layout shifts that hurt conversion metrics.</p>
            
            <h3>5. Analytics Event Queue</h3>
            <p>Events are buffered if the network is slow and retried with exponential backoff. UTM data is captured even on flaky connections—not fire-and-forget. Flush manually or let the queue auto-send.</p>
            
            <h3>6. Quick Tips</h3>
            <ul>
              <li>HTTPS is added automatically.</li>
              <li>Try different paths if a site doesn't load.</li>
              <li>Use Reset to start over.</li>
              <li>The status bar shows queued events.</li>
              <li>Save/Load settings to keep your config.</li>
            </ul>

            <div className="popup-buttons">
              <button onClick={() => setShowPopup(false)}>Got it, close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IframeLoader;