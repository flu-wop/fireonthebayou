import PageHeader from "@/components/sections/PageHeader";
import ProcessSteps from "@/components/sections/ProcessSteps";
import ProcessTabs from "@/components/sections/ProcessTabs";
import PostProduction from "@/components/sections/PostProduction";
import Statement from "@/components/sections/Statement";
import Faq from "@/components/sections/Faq";
import NextStep from "@/components/sections/NextStep";
import { getFaq, getPostSteps, getProcessSteps, getSettings } from "@/lib/content";

export default async function ProcessView({ draft }: { draft?: boolean }) {
  const [steps, post, faq, settings] = await Promise.all([getProcessSteps({ draft }), getPostSteps({ draft }), getFaq({ draft }), getSettings({ draft })]);
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title={<>From spark<br />to <span className="text-flame">screen.</span></>}
        lede="A deliberate, five-stage process built so the people who pitch the film are the people who make it."
      />
      <ProcessTabs
        process={
          <>
            <ProcessSteps steps={steps.map((s) => s.data)} />
            <Statement text="No middlemen. No handoffs that *lose* *the* *vision.* One team carries your project from the *first* *conversation* to the final frame." />
          </>
        }
        post={<PostProduction heading={settings.postHeading} intro={settings.postIntro} steps={post.map((s) => s.data)} />}
      />
      <Faq items={faq.map((f) => f.data)} />
      <NextStep line="Ready when you are." />
    </>
  );
}
