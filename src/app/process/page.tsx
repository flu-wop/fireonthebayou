import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Statement from "@/components/sections/Statement";
import Faq from "@/components/sections/Faq";

export const metadata: Metadata = {
  alternates: { canonical: "/process" },
  title: "Process",
  description:
    "How Fire on the Bayou works — discovery, treatment, production, sound, and finish — plus answers to common questions about working with us.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={<>From spark<br />to <span className="text-flame">screen.</span></>}
        lede="A deliberate, five-stage process built so the people who pitch the film are the people who make it."
      />
      <ProcessSteps />
      <Statement text="No middlemen. No handoffs that lose the vision. One team carries your project from the first conversation to the final frame." />
      <Faq />
    </>
  );
}
