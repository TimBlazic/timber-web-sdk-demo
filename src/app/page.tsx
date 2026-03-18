"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!code.trim()) return;
    setIsVerifying(true);
    console.log(`[Auth] Verifying invite code: ${code}`);
    setTimeout(() => {
      setIsVerifying(false);
      console.log("[Auth] Verification complete");
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background watermark text */}
      <div className="pointer-events-none absolute inset-0 flex select-none items-end justify-center pb-16">
        <span className="whitespace-nowrap text-[clamp(80px,12vw,180px)] font-bold tracking-tight text-[#e8ecf2]">
          Welcome to Timber
        </span>
      </div>

      {/* Decorative vertical line */}
      <div
        className="pointer-events-none fixed right-[calc(50%-230px)] top-[137px] h-[144px] w-px"
        style={{ background: "linear-gradient(to bottom, transparent, #bac6fb, transparent)" }}
      />

      {/* Main card */}
      <div className="w-full max-w-[658px] rounded-2xl border border-[#bac6fb] p-2.5">
        {/* Product illustration area */}
        <div className="flex flex-col items-center rounded-2xl bg-white px-8 pb-10 pt-12">
          {/* Avatars with speech bubbles */}
          <div className="relative mb-8 flex items-end justify-center">
            {/* "Thanks!" bubble */}
            <div className="absolute -left-16 top-1 z-10 rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-medium text-[#64748b] shadow-sm">
              Thanks!
            </div>

            {/* Avatar 1 */}
            <div className="relative z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#93b4f8] bg-[#dbeafe]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#93b4f8" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#93b4f8" />
              </svg>
            </div>

            {/* Avatar 2 */}
            <div className="relative -ml-3 z-0 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#f5d0b0] bg-[#fef3c7]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#f5d0b0" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#f5d0b0" />
              </svg>
            </div>

            {/* "Love it!" bubble */}
            <div className="absolute -right-14 -top-1 z-10 rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-medium text-[#7c3aed] shadow-sm">
              Love it!
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-xl font-bold tracking-tight text-[#0f172a]">
            Enter Invite Code
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-xs text-center text-sm leading-5 text-[#64748b]">
            Only invited users can access the product.
            <br />
            Enter your code to continue
          </p>

          {/* Form */}
          <div className="w-full max-w-sm">
            <label
              htmlFor="invite-code"
              className="mb-1.5 block text-xs font-medium text-[#64748b]"
            >
              Enter code
            </label>
            <input
              id="invite-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Ex: Pw66+34"
              className="mb-3 h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#0f172a] outline-none placeholder:text-[#cbd5e1] focus:border-[#93b4f8] focus:ring-2 focus:ring-[#93b4f8]/20"
            />
            <button
              onClick={handleVerify}
              disabled={!code.trim() || isVerifying}
              className="h-11 w-full rounded-lg bg-[#e2e8f0] text-sm font-medium text-[#94a3b8] transition-all hover:bg-[#cbd5e1] hover:text-[#64748b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : "Verify Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
