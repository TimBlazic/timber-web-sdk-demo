"use client";

import { useEffect } from "react";

async function captureTab(): Promise<Blob> {
  document.documentElement.style.cursor = "default";

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: "browser", cursor: "never" },
    preferCurrentTab: true,
  } as DisplayMediaStreamOptions);

  const video = document.createElement("video");
  video.srcObject = stream;
  await video.play();

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")!.drawImage(video, 0, 0);

  stream.getTracks().forEach((t) => t.stop());
  document.documentElement.style.cursor = "";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });
}

function patchScreenshotFetch(screenshotApiUrl: string) {
  const originalFetch = window.fetch;

  window.fetch = async function patchedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ) {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;

    if (url.includes(screenshotApiUrl) && init?.method === "POST") {
      const timberRoots = document.querySelectorAll("[data-timber-root]");
      timberRoots.forEach(
        (el) => ((el as HTMLElement).style.visibility = "hidden"),
      );

      await new Promise((r) => requestAnimationFrame(r));

      const blob = await captureTab();

      timberRoots.forEach(
        (el) => ((el as HTMLElement).style.visibility = ""),
      );

      return new Response(blob, {
        status: 200,
        headers: { "Content-Type": "image/png" },
      });
    }

    return originalFetch.call(window, input, init);
  };

  return () => {
    window.fetch = originalFetch;
  };
}

export function TimberWidget() {
  useEffect(() => {
    const screenshotApiUrl =
      process.env.NEXT_PUBLIC_TIMBER_SCREENSHOT_API_URL!;

    const unpatchFetch = patchScreenshotFetch(screenshotApiUrl);

    import("timber-feedback-sdk").then(({ init }) => {
      init({
        projectId: process.env.NEXT_PUBLIC_TIMBER_PROJECT_ID!,
        apiKey: process.env.NEXT_PUBLIC_TIMBER_API_KEY!,
        apiUrl: process.env.NEXT_PUBLIC_TIMBER_API_URL!,
        screenshotApiUrl,
        position: "bottom-right",
        theme: "auto",
      });
    });

    return () => {
      unpatchFetch();
      import("timber-feedback-sdk").then(({ destroy }) => destroy());
    };
  }, []);

  return null;
}
