import type { ComponentPropsWithoutRef } from "react";
import { Linkedin, Send } from "lucide-react";

export type SocialIconName = "telegram" | "linkedin";

type Props = ComponentPropsWithoutRef<"svg"> & {
  name: SocialIconName;
};

export function SocialIcon({ name, ...props }: Props) {
  switch (name) {
    case "telegram":
      return <Send {...props} aria-hidden="true" />;
    case "linkedin":
      return <Linkedin {...props} aria-hidden="true" />;
  }

  return null;
}
