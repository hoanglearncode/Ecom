"use client";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden bg-[#1a1a2e]">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_50%,rgba(99,60,180,0.18),transparent)]" />

      <div className="relative flex items-center gap-12 px-12 py-10">
        {/* Left */}
        <div className="relative flex-1">
          {/* Spinning badge */}
          <div className="absolute -right-3 -top-3 flex h-[72px] w-[72px] animate-spin-slow flex-col items-center justify-center rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]">
            <span className="text-xl font-bold leading-none text-[#1a1a2e]">20%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1a2e]/70">off</span>
          </div>

          {/* Badge */}
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-300">Newsletter</span>
          </div>

          <h3 className="mb-1.5 font-serif text-3xl font-normal leading-tight text-white">
            Get <em className="italic text-violet-300">exclusive</em>
            <br />
            first-order savings.
          </h3>
          <p className="text-[13px] text-white/40">Join 12,000+ subscribers. No spam, ever.</p>
        </div>

        {/* Right */}
        <div className="w-80 shrink-0 space-y-2.5">
          {!submitted ? (
            <>
              <div
                className={`flex items-center gap-2 rounded-[14px] border bg-white/[0.07] p-1 pl-4 transition-colors focus-within:border-violet-500/50 focus-within:bg-white/10 ${
                  error ? "border-red-400/40" : "border-white/12"
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`min-w-0 flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/35 focus:outline-none ${
                    error ? "text-red-400" : ""
                  }`}
                />
                <button
                  onClick={handleSubscribe}
                  className="shrink-0 rounded-[10px] bg-violet-700 px-[18px] py-2.5 text-[13px] font-semibold text-white transition hover:bg-violet-800 active:scale-95"
                >
                  Subscribe →
                </button>
              </div>
              <div className="flex items-center gap-4 px-1">
                <span className="flex items-center gap-1.5 text-[11.5px] text-white/35">
                  🔒 No spam
                </span>
                <div className="h-3 w-px bg-white/12" />
                <span className="flex items-center gap-1.5 text-[11.5px] text-white/35">
                  ✓ Unsubscribe anytime
                </span>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/12 px-4 py-2.5 text-[13px] font-medium text-emerald-400">
              ✓ You're in! Check your inbox for your 20% off code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}