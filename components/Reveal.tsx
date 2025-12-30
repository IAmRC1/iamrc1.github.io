"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "nav";
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function Reveal({ children, className, as = "div" }: Props) {
  const id = useId();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { root: null, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = as;

  return (
    <Comp
      // @ts-expect-error - JSX typing differs across intrinsic elements.
      ref={ref}
      data-reveal={id}
      data-state={visible ? "shown" : "hidden"}
      className={className}
    >
      {children}
    </Comp>
  );
}
