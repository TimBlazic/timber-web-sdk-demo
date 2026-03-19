import { chromium } from "playwright";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { url, headHtml, bodyHtml, width, height, deviceScaleFactor } =
    await req.json();

  if (!url || !bodyHtml) {
    return NextResponse.json(
      { error: "url and bodyHtml are required" },
      { status: 400 }
    );
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
      viewport: { width: width || 1440, height: height || 900 },
      deviceScaleFactor: deviceScaleFactor || 2,
    });

    const page = await context.newPage();

    const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <base href="${url}">
    ${headHtml || ""}
  </head>
  <body>${bodyHtml}</body>
</html>`;

    await page.setContent(fullHtml, { waitUntil: "networkidle" });

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    return new Response(new Uint8Array(screenshot), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Screenshot error:", err);

    return NextResponse.json(
      { error: "Screenshot failed" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
