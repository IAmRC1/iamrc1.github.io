import {
  DOCKER,
  GRAPHQL,
  MATERIAL_UI,
  MYSQL,
  NEXTJS,
  NODEJS,
  POSTGRESQL,
  PRISMA,
  RAILS,
  REACT,
  REDUX,
  TYPESCRIPT,
} from "@/lib/tech";

export type Project = {
  title: string;
  href?: string;
  description: string;
  tags?: string[];
  impact?: string;
  decisions?: string;
  stack?: string;
  unlockKey?: string;
  funFact?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "EiQ Analyze",
    href: "https://analyze.eiq.ai/",
    description:
      "An analytics platform with React on the frontend and Rails + PostgreSQL on the backend. Containerized with Docker.",
    tags: [REACT, RAILS, POSTGRESQL, DOCKER],
    impact: "Built reliable analytics workflows with a strong focus on performance and clear UI states.",
    decisions: "Kept the frontend pragmatic (React) while leaning on Rails conventions for speed and maintainability.",
    stack: "React + Rails + PostgreSQL + Docker.",
  },
  {
    title: "Zenith",
    href: "https://zenith.lextegrity.com/",
    description:
      "A CMS replacement with RBAC and multi-tenant architecture; TypeScript frontend with a Node backend.",
    tags: [TYPESCRIPT, NODEJS, POSTGRESQL],
    impact: "Shipped a multi-tenant platform with clean permissions and a UI that stays fast as complexity grows.",
    decisions: "Invested early in RBAC modeling and predictable UI patterns to avoid a brittle permission maze.",
    stack: "TypeScript UI + Node services + PostgreSQL.",
    unlockKey: "zenith",
    funFact: "Unlocked: this project shipped with a guided ‘admin safety’ checklist to prevent accidental misconfig.",
  },
  {
    title: "Better Together",
    description:
      "A habit-tracker with daily/weekly/monthly milestones. (Lorem ipsum placeholder — replace with your real story.)",
    tags: [NEXTJS, PRISMA, GRAPHQL],
    impact: "Designed UX around momentum: quick input, clear streak feedback, minimal friction.",
    decisions: "Kept it feature-light and focused on habit loops rather than dashboards.",
    stack: "Next.js + Prisma + GraphQL.",
  },
  {
    title: "InteCgrate",
    description:
      "A B2B app with user/admin panels and data management. (Lorem ipsum placeholder.)",
    tags: [REACT, MATERIAL_UI, GRAPHQL],
    impact: "Improved admin throughput with bulk workflows and safer defaults.",
    decisions: "Separated user/admin UX paths to keep the core flow uncluttered.",
    stack: "React + MUI + GraphQL.",
  },
  {
    title: "CIP (Customer Information Portal)",
    description: "A data analytics dashboard for businesses. (Lorem ipsum placeholder.)",
    tags: [REACT, REDUX, MYSQL],
    impact: "Delivered a dashboard that stays readable under real-world data density.",
    decisions: "Standardized state management patterns to keep screens consistent.",
    stack: "React + Redux + MySQL.",
  },
];
