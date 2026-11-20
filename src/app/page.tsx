/**
 * Home (/) — the reel
 * -------------------
 * Interim: the hero reel only. Phase 2 rebuilds this as the one-screen stage
 * (reel, tagline, client logo banner, "Enter the work").
 */
import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <Hero />;
}
