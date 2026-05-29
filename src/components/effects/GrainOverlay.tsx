"use client";

/**
 * GrainOverlay
 * ------------
 * A fixed, full-viewport film-grain + faint ember vignette that sits above all
 * content (pointer-events: none). This is the texture that stops the site from
 * reading "flat digital" and pushes it toward "shot on film."
 */
export default function GrainOverlay() {
  return (
    <>
      {/* Animated grain */}
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
      />
      {/* Warm ember vignette — subtle heat creeping in from the edges */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(226,69,42,0.06) 100%)",
        }}
      />
    </>
  );
}
