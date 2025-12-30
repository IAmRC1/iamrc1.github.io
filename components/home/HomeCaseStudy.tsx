import { CaseStudyHotspots } from "@/components/CaseStudyHotspots";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/layout/Section";

export function HomeCaseStudy() {
  return (
    <Section id="case-study" className="pt-20">
      <Reveal>
        <CaseStudyHotspots />
      </Reveal>
    </Section>
  );
}
