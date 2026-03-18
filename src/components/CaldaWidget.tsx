"use client";

import { useEffect } from "react";

export function CaldaWidget() {
  useEffect(() => {
    import("calda-feedback-sdk").then(({ init }) => {
      init({
        projectId: "07d01d0e-8948-4dcd-b62c-d47e0a733edc",
        apiKey: "5e937cad8e1c39537bffd205d336e13410165b5be89d605306f53a3dc73789d8",
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
