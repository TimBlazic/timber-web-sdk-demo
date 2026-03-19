import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import { chromium as playwrightChromium } from "playwright-core";

export const runtime = "nodejs";
export const maxDuration = 30;

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar";

export async function POST(req: NextRequest) {
  const { url, headHtml, bodyHtml, width, height, deviceScaleFactor } =
    await req.json();

  if (!url || !bodyHtml) {
    return NextResponse.json(
      { error: "url and bodyHtml are required" },
      { status: 400 },
    );
  }

  let browser;
  try {
    const isDev = process.env.NODE_ENV === "development";
    const executablePath = isDev
      ? undefined
      : await chromium.executablePath(CHROMIUM_PACK_URL);

    const prodArgs = chromium.args.filter(
      (arg: string) => !arg.startsWith("--headless"),
    );

    browser = await playwrightChromium.launch({
      args: isDev ? [] : prodArgs,
      executablePath,
      headless: true,
    });

    const vw = width || 1440;
    const vh = height || 900;

    const context = await browser.newContext({
      viewport: { width: vw, height: vh },
      deviceScaleFactor: deviceScaleFactor || 2,
    });

    const page = await context.newPage();

    const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <base href="${url}">
    ${headHtml || ""}
    <style>html, body { margin: 0; padding: 0; min-width: ${vw}px; min-height: ${vh}px; }</style>
  </head>
  <body>${bodyHtml}</body>
</html>`;

    await page.setContent(fullHtml, { waitUntil: "networkidle" });

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: vw, height: vh },
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
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
