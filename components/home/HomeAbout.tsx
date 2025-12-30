import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/layout/Section";
import { HOME_COPY } from "@/lib/copy/home";

export function HomeAbout() {
  return (
    <Section id="about" className="pt-20">
      <Reveal className="grid gap-8 md:grid-cols-2">
        <header>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {HOME_COPY.about.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {HOME_COPY.about.body}
          </p>
        </header>
        <article className="app-card rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {HOME_COPY.about.focusTitle}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {HOME_COPY.about.focusBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
      </Reveal>
    </Section>
  );
}
