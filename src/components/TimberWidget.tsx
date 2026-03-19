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
