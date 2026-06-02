<img width="570" height="329" alt="image" src="https://github.com/user-attachments/assets/46e5bbff-a77b-4b19-8ea2-f3711b1f517a" />

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/turtleboyagain120/iframe-loader/releases)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![HTML5](https://img.shields.io/badge/HTML5-yes-orange.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![CSS3](https://img.shields.io/badge/CSS3-yes-blue.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![Analytics](https://img.shields.io/badge/Analytics-Event%20Queue-purple.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![Encryption](https://img.shields.io/badge/Encryption-SHA256-red.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![Contributors](https://img.shields.io/badge/Contributors-Welcome-blueviolet.svg)](https://github.com/turtleboyagain120/iframe-loader)

# ✨ Ultra Custom IFRAME Loader

**Big, flexible iframe with advanced tracking, encryption, resize & analytics**

A production-ready tool for embedding and controlling iframes with custom headers, UTM parameters, dynamic resizing, encryption, and event-based analytics.

---

## Features

- 🎯 **Multiple Loading Modes** — Direct, paths (`/embed`, `/home`, `/dashboard`), query parameters, custom UTM
- 🔐 **Custom Headers & Encryption** — Inject X-headers, SHA-256 parameter encryption, prevent DevTools tampering
- 📐 **Dynamic Resize** — Auto-resize based on content, aspect ratio locking, min/max height constraints
- 📊 **Analytics Queue** — Event buffering, exponential backoff retry (up to 5 retries), network resilience
- 🔑 **API Key Support** — Multiple key format options (`apikey`, `token`, `access_token`, `key`)
- 💾 **Settings Persistence** — LocalStorage save/load for quick configuration switching
- 🎨 **Advanced Visual Options** — Custom CSS, zoom, border styling, sandbox controls, scrolling modes
- ⚛️ **TypeScript Ready** — Full React component blueprint + type interfaces included

---

## Quick Start

### 1. Open the Tool
```bash
# Just open index.html in your browser
open index.html
```

### 2. Enter a Website URL
```
example.com
youtube.com
tumblr.com
github.com
```

### 3. Choose a Loading Path
- **Direct Load** — Load the site as-is
- **Path: /embed** — Try the embed endpoint
- **Query: Custom UTM** — Add marketing parameters
- Other paths: `/home`, `/dashboard`, `/mobile`, `/viewer`, `/index.html`

### 4. Click "Load Site"
The iframe loads in the panel below with all your settings applied.

### 5. (Optional) Save Settings
Click **💾 Save Settings** to persist your config to localStorage.

---

## How It Works

### Loading Modes
Each mode constructs the URL differently:

| Mode | Example |
|------|---------|
| Direct | `https://example.com` |
| Path: /embed | `https://example.com/embed` |
| Path: /dashboard | `https://example.com/dashboard` |
| Query: ?iframe=true | `https://example.com?iframe=true` |
| Query: Custom UTM | `https://example.com?utm_source=X&utm_medium=Y&utm_campaign=Z` |

### Custom Headers
Headers like `X-Tracking-ID`, `X-Source`, `X-Campaign` are injected via postMessage proxy — they don't appear in the URL, keeping them invisible to basic inspection.

### Encryption
Enable **SHA-256 encryption** to hash all UTM and query parameters. This prevents DevTools tampering and keeps tracking data secure.

### Dynamic Resize
With **Auto-resize** enabled, the iframe grows/shrinks based on content height while respecting aspect ratio and min/max constraints. Great for eliminating layout shift.

### Analytics Queue
Events are buffered and sent in batches. If the network fails:
1. Event is queued
2. Retries with exponential backoff (1s → 2s → 4s → 8s → 16s)
3. Max 5 retries before dropping
4. Manually flush with **Flush Queue Now** button

---

## Configuration

### Basic Settings
- **Website URL** — The site to embed (https:// added automatically)
- **Choose Loading Path** — How to construct the URL
- **API Key** — Optional authentication token
- **How to attach the key** — Format (apikey=KEY, token=KEY, etc.)

### Custom Headers & Encryption
- **X-Tracking-ID** — Custom tracking identifier
- **X-Source** — Source of traffic
- **X-Campaign** — Campaign identifier
- **Encrypt UTM & query parameters** — Enable SHA-256 hashing

### Dynamic Resize & Aspect Ratio
- **Auto-resize based on content** — Dynamically adjust height
- **Aspect Ratio** — Lock ratio (e.g., 16:9, 4:3)
- **Min Height / Max Height** — Constraints (e.g., 400px, 2000px)

### Advanced Visual Options
- **Width / Height** — Custom dimensions (px, %, vh, vw)
- **Sandbox** — Security restrictions (scripts, forms, same-origin)
- **Scrolling** — auto / yes / no
- **Border Size & Color** — Custom styling
- **Zoom Level** — Scale the iframe (0.5x to 2x)
- **Custom CSS** — Inject CSS directly into iframe styling

### Analytics
- **Analytics Endpoint** — Where to send events (default: httpbin.org/post)
- **Flush Queue Now** — Manually send buffered events
- **Clear Queue** — Empty all pending events

---

## File Structure

```
.
├── index.html          # Main UI
├── styles.css          # Styling (gradient, responsive, animations)
├── utils.js            # Helpers (debounce, throttle, Storage wrapper)
├── script.js           # Core logic (URL building, iframe management, analytics)
├── app.tsx             # React/TypeScript blueprint (for reference/porting)
├── yml.yml             # Configuration presets & schema
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## Usage Examples

### Example 1: Load YouTube with UTM Tracking
```
1. URL: youtube.com
2. Path: Query: Custom UTM
3. utm_source: my_website
4. utm_medium: embedded
5. utm_campaign: q4_content
6. Click: Load Site
```

**Result:** `https://www.youtube.com?utm_source=my_website&utm_medium=embedded&utm_campaign=q4_content`

### Example 2: Embed Dashboard with API Key
```
1. URL: dashboard.company.com
2. Path: Path: /dashboard
3. API Key: your_secret_token_here
4. Key Format: token
5. Check: Append key to URL
6. Click: Load Site
```

**Result:** `https://dashboard.company.com/dashboard?token=your_secret_token_here`

### Example 3: Custom Headers + Encryption
```
1. URL: example.com
2. X-Tracking-ID: campaign-abc-123
3. X-Source: linkedin-outreach
4. X-Campaign: q4-enterprise
5. Check: Encrypt UTM & query parameters
6. Click: Load Site
```

Headers are injected invisibly; parameters are SHA-256 hashed.

---

## Keyboard Shortcuts

- **Load Site** — Loads the configured iframe
- **Learn About Paths** — Opens help popup
- **Reset** — Clears all settings and reloads blank iframe

---

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Some sites may refuse to load in iframes due to `X-Frame-Options: DENY` headers. This is a site security feature, not a bug.

---

## Advanced: React Integration

The project includes a **TypeScript component blueprint** (`app.tsx`):

```typescript
import { IframeLoaderEngine, defaultState } from './app';

const engine = new IframeLoaderEngine();
const url = await engine.buildUrl(config);
engine.enqueueEvent('page_viewed', { url, timestamp: Date.now() });
```

To use with React:
```bash
npx create-react-app iframe-loader --template typescript
cp app.tsx src/
```

---

## Configuration Presets (YAML)

The `yml.yml` file contains preset configurations:

```yaml
presets:
  youtube:
    site_url: "youtube.com"
    mode: "pathEmbed"
    resize:
      aspect_ratio: "16:9"
  
  github:
    site_url: "github.com"
    mode: "pathDashboard"
    api:
      key_format: "token"
```

Load presets by editing the JavaScript or extending the UI.

---

## Performance Tips

1. **Auto-Resize** — Disable if the iframe content doesn't change height
2. **Analytics Queue** — Batching reduces network overhead
3. **Zoom** — Keep at 1x unless you have a specific reason
4. **Sandbox** — Restrict permissions only if needed (impacts functionality)
5. **Custom CSS** — Minimize; heavy filters (blur, shadow) impact performance

---

## Troubleshooting

### "Site refused to connect"
- The site has `X-Frame-Options: DENY` headers
- Try a different loading path (e.g., `/embed` instead of direct)
- Some sites intentionally block iframe embedding for security

### "Iframe is blank"
- Check browser console (F12 → Console tab) for errors
- Verify the URL is correct and reachable
- Try removing API key or custom headers
- Use a CORS proxy if the site blocks cross-origin requests

### "Custom headers not working"
- Headers are injected via postMessage — only effective if the site listens for them
- Most public sites don't read custom headers from iframes
- For authenticated APIs, use API Key instead

### "Events not sending to analytics endpoint"
- Check that the endpoint URL is correct
- Verify CORS is enabled on your analytics backend
- Use **Flush Queue Now** to manually trigger sending
- Check browser Network tab (F12) to see the request

### "Settings not saving"
- LocalStorage might be disabled or full
- Check browser settings → Privacy → Cookies
- Clear browser cache and try again

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this tool with attribution.

---

## Contributing

Found a bug? Have a feature idea? Feel free to:
1. Open an issue
2. Fork and submit a pull request
3. Discuss improvements

---

## Credits

Built with ❤️ for developers, marketers, and anyone who needs flexible iframe control.

---

## See Also

- [MDN: HTMLIFrameElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [OWASP: Clickjacking](https://owasp.org/www-community/attacks/Clickjacking)
- [Web.dev: Iframes Best Practices](https://web.dev/iframe-best-practices/)
