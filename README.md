# Timber SDK Demo App!

Reference implementation showing how to integrate the [Timber Web SDK](https://github.com/Justin-Beavers-Dev/timber-web-sdk) into a Next.js application.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Playwright (for server-side screenshot rendering)
- [calda-feedback-sdk](https://github.com/Justin-Beavers-Dev/timber-web-sdk) (Timber Web SDK)

## Getting Started

```bash
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the SDK is Integrated

There are three parts to integrating the Timber Web SDK:

### 1. Install the SDK

The SDK is installed directly from the public GitHub repo:

```json
// package.json
{
  "dependencies": {
    "calda-feedback-sdk": "github:Justin-Beavers-Dev/timber-web-sdk"
  }
}
```

### 2. Widget Component

A client component dynamically imports and initializes the SDK. It lives in `src/components/CaldaWidget.tsx`:

```tsx
"use client";

import { useEffect } from "react";

export function CaldaWidget() {
  useEffect(() => {
    import("calda-feedback-sdk").then(({ init }) => {
      init({
        projectId: "YOUR_PROJECT_ID",
        apiKey: "YOUR_SDK_API_KEY",
        apiUrl: "https://www.timber.report/api/v1",
        screenshotApiUrl: "/api/calda/screenshot",
        position: "bottom-right",
        theme: "auto",
      });
    });

    return () => {
      import("calda-feedback-sdk").then(({ destroy }) => destroy());
    };
  }, []);

  return null;
}
```

**Key points:**
- Uses dynamic `import()` because the SDK accesses `window`/`document` and must run client-side only
- `projectId` and `apiKey` come from the Timber dashboard (project settings → SDK Keys)
- `apiUrl` points to the Timber backend API
- `screenshotApiUrl` is a local API route in your app (see step 3)
- Calls `destroy()` on unmount to clean up the SDK

This component is mounted once in the root layout (`src/app/layout.tsx`):

```tsx
import { CaldaWidget } from "@/components/CaldaWidget";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CaldaWidget />
      </body>
    </html>
  );
}
```

### 3. Screenshot API Route

The SDK captures the page DOM and sends it to a server-side route that renders a PNG screenshot using Playwright. This route lives in `src/app/api/calda/screenshot/route.ts`:

```ts
import { chromium } from "playwright";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url, headHtml, bodyHtml, width, height, deviceScaleFactor } =
    await req.json();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: width || 1440, height: height || 900 },
    deviceScaleFactor: deviceScaleFactor || 2,
  });
  const page = await context.newPage();

  await page.setContent(
    `<!DOCTYPE html><html><head><base href="${url}">${headHtml || ""}</head><body>${bodyHtml}</body></html>`,
    { waitUntil: "networkidle" }
  );

  const screenshot = await page.screenshot({ type: "png", fullPage: false });
  await browser.close();

  return new NextResponse(screenshot, {
    headers: { "Content-Type": "image/png" },
  });
}
```

**Why this is needed:** The SDK runs in the browser and can't take a native screenshot. Instead, it serializes the current DOM (including all CSS) and sends it to this server-side route, which reconstructs the page in a headless browser and takes a real screenshot.

## Project Structure

```
src/
  app/
    layout.tsx                    ← Root layout (mounts CaldaWidget)
    page.tsx                      ← Demo page (invite code UI)
    globals.css                   ← Global styles
    api/calda/screenshot/
      route.ts                    ← Screenshot API route (Playwright)
  components/
    CaldaWidget.tsx               ← SDK initialization component
```

## SDK User Flow

1. A floating Timber button appears in the bottom-right corner
2. Click it → select "Take a Screenshot"
3. The SDK serializes the DOM → sends to `/api/calda/screenshot` → Playwright returns a PNG
4. Annotation overlay opens with draw, text, color picker, and undo/redo tools
5. Click "Report" → a bug report form appears (title, description, expected behaviour, priority, device)
6. Submit → the report with screenshot and console logs is sent to the Timber backend

## Privacy

Add `data-calda-mask` to any element to redact its content from screenshots:

```html
<input type="password" data-calda-mask />
```
