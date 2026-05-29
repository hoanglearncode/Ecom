"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, Mail, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5"
        data-reveal
        style={{
          opacity: 0,
          transform: "translateY(50px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(234,88,12,0.16),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.04),transparent)] lg:block" />
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:p-12">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <Sparkles size={12} className="fill-current" />
              Member Perks
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Get first access to drops, deals, and restocks.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Join the list for early sale alerts, weekly edits, and exclusive
              rewards made for frequent shoppers.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label className="relative flex-1">
                <span className="sr-only">Email address</span>
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsSubmitted(false);
                  }}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-bold text-background shadow-lg shadow-black/10 transition-all hover:bg-foreground/85 active:scale-[0.97]"
              >
                Sign up
                <ArrowRight size={15} />
              </button>
            </form>

            <div className="mt-4 min-h-5">
              {isSubmitted ? (
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                  <Check size={14} />
                  Thanks. You are on the list.
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  No spam. Unsubscribe anytime.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
