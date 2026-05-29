import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Statement from "@/components/sections/Statement";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How Fire on the Bayou works — discovery, treatment, production, sound & score, and finish.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={<>From spark<br />to screen.</>}
        lede="A deliberate, five-stage process built so the people who pitch the film are the people who make it."
      />
      <ProcessSteps />
      <Statement text="No middlemen. No handoffs that lose the vision. One team carries your project from the first conversation to the final frame." />
    </>
  );
}
