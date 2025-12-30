import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/layout/Section";
import { HOME_COPY } from "@/lib/copy/home";
import { PROJECTS } from "@/lib/projects";

export function HomeWork() {
  return (
    <Section id="work" className="pt-20">
      <Reveal>
        <header className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {HOME_COPY.work.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {HOME_COPY.work.subtitle}
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label={HOME_COPY.work.title}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </section>
      </Reveal>
    </Section>
  );
}
