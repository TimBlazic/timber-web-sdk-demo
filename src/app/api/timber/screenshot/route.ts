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

    const vw = width || 1440;
    const vh = height || 900;
    const dpr = deviceScaleFactor || 2;

    browser = await playwrightChromium.launch({
      args: isDev ? [] : chromium.args,
      executablePath,
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: vw, height: vh },
      deviceScaleFactor: dpr,
    });

    const page = await context.newPage();

    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

    await page.evaluate((html) => {
      document.querySelectorAll("[data-timber-root]").forEach((el) =>
        el.remove(),
      );
      document.body.innerHTML = html;
    }, bodyHtml);

    await page.waitForLoadState("networkidle");

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
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
