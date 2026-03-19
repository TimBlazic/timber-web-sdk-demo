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

      <div className="w-full max-w-[540px] rounded-xl border border-[#d6e6ff] p-2.5">
        <div className="flex items-center justify-center rounded-xl bg-white px-2.5 py-10">
          <div className="flex w-[342px] flex-col items-center gap-11">
            <div className="flex w-full flex-col items-center gap-6">
              <img
                src="/peoples.png"
                alt="People chatting"
                className="h-[72px] object-contain"
              />

              <div className="flex w-full flex-col items-center gap-3">
                <h1 className="text-[30px] leading-none text-[#0f172a]">
                  Enter Invite Code
                </h1>
                <p className="text-center text-sm leading-5 text-[#0f172a]">
                  Only invited users can access the product.
                  <br />
                  Enter your code to continue.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="invite-code"
                  className="pl-1 text-sm font-medium text-[#111827]"
                >
                  Enter code
                </label>
                <input
                  id="invite-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="Enter the code you received"
                  className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm text-[#0f172a] shadow-sm outline-none placeholder:text-[#9ca3af] focus:border-[#93b4f8] focus:ring-2 focus:ring-[#93b4f8]/20"
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={!code.trim() || isVerifying}
                className="h-11 w-full rounded-lg bg-[#0f172a] text-sm font-medium text-[#f8fafc] transition-colors enabled:hover:bg-[#1e293b] disabled:opacity-20"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
