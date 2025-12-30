import type { ComponentPropsWithoutRef } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siDocker,
  siGraphql,
  siMui,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siRedux,
  siRubyonrails,
  siTypescript,
} from "simple-icons/icons";

const ICONS: Record<string, SimpleIcon> = {
  React: siReact,
  Redux: siRedux,
  TypeScript: siTypescript,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  Docker: siDocker,
  Rails: siRubyonrails,
  "Next.js": siNextdotjs,
  Prisma: siPrisma,
  GraphQL: siGraphql,
  MySQL: siMysql,
  "Material UI": siMui,
  MUI: siMui,
};

function normalize(name: string) {
  return name.trim();
}

export function TechIcon(
  props: Omit<ComponentPropsWithoutRef<"svg">, "children"> & { name: string }
) {
  const { name, ...svgProps } = props;
  const icon = ICONS[name] ?? ICONS[normalize(name)];
  if (!icon) return null;

  return (
    <svg
      {...svgProps}
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

export function hasTechIcon(name: string) {
  return Boolean(ICONS[name] ?? ICONS[normalize(name)]);
}
