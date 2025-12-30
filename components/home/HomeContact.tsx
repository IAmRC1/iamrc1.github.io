import { CopyButton } from "@/components/CopyButton";
import { HeartButton } from "@/components/HeartButton";
import { LocationMap } from "@/components/LocationMap";
import { Reveal } from "@/components/Reveal";
import { SocialPill } from "@/components/SocialPill";
import { Section } from "@/components/layout/Section";
import { HOME_COPY } from "@/lib/copy/home";
import { SITE } from "@/lib/site";

export function HomeContact() {
  return (
    <Section id="contact" className="pb-16 pt-20">
      <Reveal as="article" className="app-card rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {HOME_COPY.contact.title}
        </h2>
        <p className="mt-3 max-w-prose text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {HOME_COPY.contact.body}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--app-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
            href={`mailto:${SITE.author.email}`}
          >
            {HOME_COPY.contact.emailCta}
          </a>
          <CopyButton value={SITE.author.email} />
          {SITE.socialLinks.map((s) => (
            <SocialPill key={s.href} href={s.href} label={s.label} icon={s.icon} />
          ))}
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 md:items-stretch" aria-label={HOME_COPY.contact.title}>
          <article className="app-card h-full rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {HOME_COPY.contact.leaveLoveTitle}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {HOME_COPY.contact.leaveLoveBody}
            </p>
            <div className="mt-4">
              <HeartButton />
            </div>
          </article>

          <section className="h-full" aria-label="Location map">
            <LocationMap />
          </section>
        </section>

        <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} {SITE.author.name}
        </p>
      </Reveal>
    </Section>
  );
}
