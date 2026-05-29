"use client";

/**
 * Statement
 * ---------
 * A big editorial mission paragraph where individual words illuminate from ash
 * to cream as the block scrolls through the viewport — a signature uva.co.uk /
 * silent-house style moment.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <section className="frame py-28 md:py-40">
      <p
        ref={ref}
        className="mx-auto max-w-5xl flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-display text-[clamp(1.8rem,4.5vw,3.6rem)] font-light leading-[1.15] tracking-tight"
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
        })}
      </p>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="text-cream">
      {children}
    </motion.span>
  );
}
