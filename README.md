# Timber SDK Demo App

Reference implementation showing how to integrate the [Timber Web SDK](https://github.com/Justin-Beavers-Dev/timber-web-sdk) into a Next.js application.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- [timber-feedback-sdk](https://github.com/Justin-Beavers-Dev/timber-web-sdk) (Timber Web SDK)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the SDK is Integrated

Integration requires just two steps — install the package and add a single component.

### 1. Install the SDK

```json
{
  "dependencies": {
    "timber-feedback-sdk": "github:Justin-Beavers-Dev/timber-web-sdk"
  }
}
```

### 2. Widget Component

A client component in `src/components/TimberWidget.tsx` dynamically imports and initializes the SDK:

```tsx
"use client";

import { useEffect } from "react";

export function TimberWidget() {
  useEffect(() => {
    import("timber-feedback-sdk").then(({ init }) => {
      init({
        projectId: process.env.NEXT_PUBLIC_TIMBER_PROJECT_ID!,
        apiKey: process.env.NEXT_PUBLIC_TIMBER_API_KEY!,
        apiUrl: process.env.NEXT_PUBLIC_TIMBER_API_URL!,
        position: "bottom-right",
        theme: "auto",
      });
    });

    return () => {
      import("timber-feedback-sdk").then(({ destroy }) => destroy());
    };
  }, []);

  return null;
}
```

This component is mounted once in the root layout (`src/app/layout.tsx`):

```tsx
import { TimberWidget } from "@/components/TimberWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <TimberWidget />
      </body>
    </html>
  );
}
```

**Key points:**
- Uses dynamic `import()` because the SDK accesses browser APIs and must run client-side only
- `projectId` and `apiKey` come from the Timber dashboard (project settings → SDK Keys)
- `apiUrl` points to the Timber backend API
- No server-side API route needed — screenshots are captured natively in the browser using the Screen Capture API
- Calls `destroy()` on unmount to clean up the SDK

### 3. Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_TIMBER_PROJECT_ID=your-project-uuid
NEXT_PUBLIC_TIMBER_API_KEY=your-sdk-api-key
NEXT_PUBLIC_TIMBER_API_URL=https://www.timber.report/api/v1
```

## Project Structure

```
src/
  app/
    layout.tsx              ← Root layout (mounts TimberWidget)
    page.tsx                ← Demo page
    globals.css             ← Global styles
  components/
    TimberWidget.tsx        ← SDK initialization component (23 lines)
```

## SDK User Flow

1. A floating Timber button appears in the bottom-right corner
2. Click it → select "Take a Screenshot"
3. The browser's share dialog appears — select the current tab
4. Annotation overlay opens with draw, text, color picker, and undo/redo tools
5. Click "Report" → a bug report form appears (title, description, expected behaviour, priority, device)
6. Submit → the report with screenshot and console logs is sent to the Timber backend

## Privacy

Add `data-timber-mask` to any element to redact its content from screenshots:

```html
<input type="password" data-timber-mask />
```
