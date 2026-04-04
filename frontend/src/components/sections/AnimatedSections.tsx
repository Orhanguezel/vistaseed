"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  children: React.ReactNode[];
}

export default function AnimatedSections({ children }: Props) {
  return (
    <>
      {children.map((child, i) => (
        <ScrollReveal key={i} delay={i === 0 ? 0 : 0.1} direction={i === 0 ? "none" : "up"}>
          {child}
        </ScrollReveal>
      ))}
    </>
  );
}
