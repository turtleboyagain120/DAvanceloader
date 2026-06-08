<img width="652" height="646" alt="image" src="https://github.com/user-attachments/assets/c213c0a5-5bad-4836-9c0b-1f4100858820" />


[![MIT License](https://img.shields.io/badge/License-FomPsl-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/turtleboyagain120/iframe-loader/releases)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![HTML5](https://img.shields.io/badge/HTML5-yes-orange.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![CSS3](https://img.shields.io/badge/CSS3-yes-blue.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![Analytics](https://img.shields.io/badge/Analytics-Event%20Queue-purple.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![Encryption](https://img.shields.io/badge/Encryption-SHA256-red.svg)](https://github.com/turtleboyagain120/iframe-loader)
[![Contributors](https://img.shields.io/badge/Contributors-Welcome-blueviolet.svg)](https://github.com/turtleboyagain120/iframe-loader)

# DAvanceloader: V1 → V2 Upgrade Guide

**Version 2.0.0** brings a major refactor from **vanilla HTML/JS to React + TypeScript**, with production-ready backend integration and improved architecture.

---

## 🎯 What Changed: At a Glance

| Aspect | V1 | V2 |
|--------|----|----|
| **Framework** | Vanilla JS | React + TypeScript |
| **Architecture** | Single HTML file + scripts | Component-based + engine class |
| **Type Safety** | None | Full TypeScript interfaces |
| **Backend** | None (analytics only) | Spring Boot scaffold included |
| **Code Organization** | Inline functions | Modular, reusable components |
| **Maintainability** | Manual DOM manipulation | React state management |
| **React Ready** | Blueprint only | Production component |

---

## 📋 Core Feature Parity

**All V1 features are preserved in V2:**

✅ 10+ loading modes (direct, paths, query, UTM)  
✅ Custom headers (X-Tracking-ID, X-Source, X-Campaign)  
✅ SHA-256 parameter encryption  
✅ Dynamic iframe resizing with aspect ratio lock  
✅ Analytics queue with exponential backoff retry (5 max)  
✅ Settings persistence (localStorage)  
✅ API key injection (multiple formats)  
✅ Advanced visual options (zoom, border, sandbox, scrolling)  
✅ YAML config + presets  

---

## 🔧 What's New in V2

### 1. **React Component Architecture**
```typescript
// V1: Vanilla functions
function loadSite() { ... }
function buildUrl() { ... }

// V2: Component-based
<IframeLoader />  // Single drop-in component
```

**Benefits:**
- Reusable across projects
- State management built-in
- Composable with other React apps
- Hot reload support

---

### 2. **TypeScript Engine Class**
```typescript
// V2: Fully typed engine
class IframeLoaderEngine {
  async buildUrl(config: IframeLoaderState): Promise<string>
  async flushQueue(endpoint: string): Promise<void>
  enqueueEvent(eventType: string, data: Record<string, unknown>): void
}
```

**Benefits:**
- Type hints in IDE
- Compile-time error checking
- Self-documenting code
- Better for teams

---

### 3. **TypeScript Interfaces (Complete Type System)**
```typescript
interface IframeLoaderState {
  siteUrl: string;
  mode: string;
  headers: HeaderConfig;
  utm: UTMConfig;
  resize: ResizeConfig;
  visual: VisualConfig;
  // ... more
}
```

All configuration objects are fully typed — no guessing required.

---

### 4. **Backend Integration (Spring Boot)**
```java
@SpringBootApplication
public class BackendApplication {
  // Ready for extending with:
  // - REST endpoints for analytics
  // - User authentication
  // - Iframe policy management
  // - Event logging
}
```

V2 includes a basic Spring Boot scaffold for building production backends.

---

### 5. **Improved File Structure**
```
V1:
├── index.html       (everything in one file)
├── styles.css
├── script.js
└── utils.js

V2:
├── App (1).tsx          (React entry point)
├── IframeLoader.tsx     (main component)
├── app.tsx              (TypeScript engine + interfaces)
├── utils.js             (shared helpers)
├── styles.css
├── BackendApplication.java  (Spring Boot)
└── yml.yml              (config presets)
```

---

### 6. **IframeLoaderEngine Class (Reusable)**
V2 exports `IframeLoaderEngine` as a standalone class that can be used outside React:

```typescript
import { IframeLoaderEngine, defaultState } from './app';

const engine = new IframeLoaderEngine();
const url = await engine.buildUrl(config);
await engine.flushQueue('https://your-analytics.com/events');
```

Perfect for:
- Next.js / Vue / Angular
- Node.js backends
- CLI tools
- Testing

---

## 📚 Migration Path

### Scenario 1: **Using V1 as HTML file**
```bash
# V1: Open index.html directly
open index.html

# V2: Use as React component
npm install
npm start
```

### Scenario 2: **Using V1 TypeScript types (from app.tsx)**
```typescript
// V1: Blueprint only
export type { IframeLoaderState }

// V2: Full implementation ready to use
import IframeLoaderEngine from './app';
const engine = new IframeLoaderEngine();
```

### Scenario 3: **Integrating into existing React app**
```typescript
// V2: Drop-in component
import IframeLoader from './IframeLoader';

function MyApp() {
  return (
    <div>
      <h1>My App</h1>
      <IframeLoader />  // Just add this
    </div>
  );
}
```

---

## 🚀 Breaking Changes

**None.** ✨

All URL building logic, analytics, and encryption work identically between V1 and V2. The internal implementation is the same — just reorganized.

If you were using the V1 vanilla JS directly, the API contract is preserved:
- Same config object shape
- Same event queue behavior
- Same URL output
- Same localStorage keys

---

## 📖 Usage Comparison

### Loading a Site

**V1:**
```html
<!-- Fill form, click "Load Site" button -->
```

**V2:**
```typescript
import IframeLoader from './IframeLoader';

function App() {
  return <IframeLoader />;
}
```

Same UI, cleaner code.

---

### Programmatic URL Building

**V1:**
```javascript
async function buildUrl(config) {
  let url = config.siteUrl;
  if (config.mode === "pathEmbed") {
    url = url + "/embed";
  }
  // ... etc
}
```

**V2:**
```typescript
import { IframeLoaderEngine } from './app';

const engine = new IframeLoaderEngine();
const url = await engine.buildUrl(config);
```

Same logic, better organization.

---

### Analytics

**V1 & V2 (identical):**
```javascript
engine.enqueueEvent('page_viewed', { url: 'example.com' });
engine.flushQueue('https://analytics.example.com/events');
```

No changes needed.

---

## 🔄 Backward Compatibility

**V2 localStorage keys are identical to V1:**
```javascript
// Both V1 and V2 use:
localStorage.getItem('iframeLoaderSettings')

// Same object shape:
{
  siteUrl: "example.com",
  mode: "direct",
  utm: { ... },
  // ... etc
}
```

Migrate from V1 to V2 and your saved settings load automatically. ✅

---

## 📊 Performance

**V1:** Vanilla JS — direct DOM manipulation  
**V2:** React — virtual DOM diffing, optimal updates

For a single iframe loader, performance is identical. React overhead is negligible at this scale.

---

## 🛠️ For Developers

### Use V2 Engine in Node.js / CLI
```typescript
import { IframeLoaderEngine, defaultState } from './app';

const engine = new IframeLoaderEngine();
const config = { ...defaultState, siteUrl: 'github.com' };
const url = await engine.buildUrl(config);
console.log(url);  // https://github.com
```

### Extend the Component
```typescript
import IframeLoader from './IframeLoader';

export function CustomIframeLoader() {
  return (
    <div className="my-custom-wrapper">
      <IframeLoader />
    </div>
  );
}
```

### Use in Next.js / Remix
```typescript
import dynamic from 'next/dynamic';

const IframeLoader = dynamic(() => import('./IframeLoader'), {
  ssr: false  // Client-side only
});

export default IframeLoader;
```

---

## 🎁 What You Get

**V2 Includes:**

- ✅ React component (`IframeLoader.tsx`)
- ✅ TypeScript engine + full interfaces (`app.tsx`)
- ✅ Spring Boot backend scaffold (`BackendApplication.java`)
- ✅ Same HTML UI, styled as before (`index.html`, `styles.css`)
- ✅ Utility helpers (`utils.js`)
- ✅ Config presets (`yml.yml`)
- ✅ React entry point (`App (1).tsx`)

**All in one package.** Pick and use what you need.

---

## 📦 Version History

| Version | Type | Major Changes |
|---------|------|---------------|
| **V1** | Vanilla JS | Initial release, full-featured |
| **V2** | React + TypeScript | Component refactor, type safety, backend scaffold |

---

## ❓ FAQ

### "Should I upgrade from V1?"

- **If you're building a React app:** Yes. Use V2 component directly.
- **If you're using V1 as a standalone HTML file:** No need. V1 works great.
- **If you want TypeScript:** Yes. V2 has full types.
- **If you want a backend:** Yes. V2 includes Spring Boot scaffold.

### "Will my V1 settings load in V2?"

Yes. localStorage keys are identical.

### "Can I use V2 engine outside React?"

Yes. Import `IframeLoaderEngine` and use it anywhere (Node, CLI, vanilla JS).

### "Is V1 still supported?"

V1 is feature-complete and stable. V2 is the new direction for React projects.

---

## 🚀 Getting Started with V2

```bash
# Clone/download V2 files
cd dadvanceloader-v2

# Install dependencies
npm install

# Start dev server
npm start

# Opens http://localhost:3000 with IframeLoader component
```

Same features. Better code. Ready for teams.

---
**Made with ❤️ for developers who love flexibility.**
---
## See Also

- [MDN: HTMLIFrameElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [OWASP: Clickjacking](https://owasp.org/www-community/attacks/Clickjacking)
- [Web.dev: Iframes Best Practices](https://web.dev/iframe-best-practices/)
