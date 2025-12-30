// Tech/tag string constants used across the site.
// Keeping these centralized avoids drift ("Node" vs "Node.js") and makes refactors safe.

export const REACT = "React";
export const NEXTJS = "Next.js";
export const TYPESCRIPT = "TypeScript";
export const NODEJS = "Node.js";
export const POSTGRESQL = "PostgreSQL";
export const MYSQL = "MySQL";
export const DOCKER = "Docker";
export const RAILS = "Rails";
export const PRISMA = "Prisma";
export const GRAPHQL = "GraphQL";
export const REDUX = "Redux";
export const MATERIAL_UI = "Material UI";

export const TECH = {
  REACT,
  NEXTJS,
  TYPESCRIPT,
  NODEJS,
  POSTGRESQL,
  MYSQL,
  DOCKER,
  RAILS,
  PRISMA,
  GRAPHQL,
  REDUX,
  MATERIAL_UI,
} as const;

export type TechTag = (typeof TECH)[keyof typeof TECH];
