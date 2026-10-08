"use client";

/**
 * CreditsRoll
 * -----------
 * End credits that crawl upward as you scroll — role on the left of the
 * center line, name on the right, the way they run at the end of a film.
 * The frame is pinned while the credits pass through it.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Credit } from "@/lib/projects";

export default function CreditsRoll({ credits }: { credits: Credit[] }) {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDListElement>(null);
  const [dims, setDims] = useState({ list: 0, view: 800 });
  useEffect(() => {
    const measure = () =>
      setDims({
        list: listRef.current?.offsetHeight ?? 0,
        view: window.innerHeight,
      });
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Credits start just below center and travel until the closing card
  // (40vh of padding above the list's bottom) sits in the middle of the frame.
  const y = useTransform(scrollYProgress, (p) => {
    const start = dims.view * 0.62;
    const end = dims.view * 0.95 - dims.list;
    return start + (end - start) * p;
  });

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ height: `${160 + credits.length * 12}vh` }}
      aria-label="Credits"
    >
      <div
        className="sticky top-0 flex h-[100svh] justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
        }}
      >
        <motion.dl ref={listRef} style={{ y }} className="absolute top-0 w-full max-w-3xl px-6">
          {credits.map((c, i) => (
            <div
              key={`${c.role}-${i}`}
              className="grid grid-cols-2 items-baseline gap-6 py-4 md:gap-10"
            >
              <dt className="text-right font-mono text-[13px] tracking-wide text-ash">
                {c.role}
              </dt>
              <dd className="font-display text-2xl font-light text-cream md:text-3xl">
                {c.name}
              </dd>
            </div>
          ))}

          {/* Closing card */}
          <div className="pb-[40vh] pt-[20vh] text-center">
            <p className="font-display text-5xl font-light italic text-cream md:text-6xl">
              Fire on the Bayou
            </p>
            <p className="mt-4 font-mono text-[13px] tracking-wide text-flame">
              Made in New Orleans
            </p>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
