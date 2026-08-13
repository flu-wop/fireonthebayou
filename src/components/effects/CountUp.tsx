"use client";

/**
 * CountUp
 * -------
 * Animates a numeric value counting up from 0 when it scrolls into view.
 * Non-numeric values (e.g. "Telly & Addy") render as static text — this
 * only animates values that start with a parseable number, preserving any
 * prefix/suffix (e.g. "20+" counts up to 20 then appends "+").
 */
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [display, setDisplay] = useState(match ? "0" + match[2] : value);

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1400, bounce: 0 });

  useEffect(() => {
    if (!match || !isInView) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    motionVal.set(target);
    const unsub = spring.on("change", (v) => {
      setDisplay(Math.round(v) + suffix);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  if (!match) return <span ref={ref}>{value}</span>;

  return <motion.span ref={ref}>{display}</motion.span>;
}
