"use client";

import { useEffect, useState } from "react";

export function Greeting() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour > 5 && hour <= 11) setText("Good morning");
    else if (hour > 11 && hour <= 15) setText("Good afternoon");
    else if (hour > 15 && hour <= 22) setText("Good evening");
    else setText("Up late?");
  }, []);

  return (
    <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
      {text}
    </p>
  );
}
