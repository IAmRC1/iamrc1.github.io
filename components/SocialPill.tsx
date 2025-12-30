import { SocialIcon, type SocialIconName } from "@/components/SocialIcon";

export function SocialPill(props: {
  href: string;
  label: string;
  icon: SocialIconName;
}) {
  return (
    <a
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
      href={props.href}
      target="_blank"
      rel="noreferrer"
      aria-label={props.label}
      title={props.label}
    >
      <SocialIcon name={props.icon} className="h-5 w-5" />
    </a>
  );
}
