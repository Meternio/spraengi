"use client";

import { Button as ButtonComponent } from "@/components/ui/button";
import { ButtonStoryblok } from "@/component-types-sb";
import { createSlug } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ButtonReserve from "@/components/ButtonReserve";
import Link from "next/link";

const Button: React.FC<{ blok: ButtonStoryblok, className?: string }> = ({ blok, className }) => {
  const variant = blok.variant === "primary" ? "default" : blok.variant as "outline" | "default" | "ghost" | "secondary" | "destructive" | "link" | null | undefined;
  const sharedClassNames = cn('rounded-full uppercase cursor-pointer', className);

  const handleLocalScroll = () => {
    if (!blok.href) return;

    const slug = createSlug(blok.href);

    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  switch (blok.type) {
    case "localScroll":
      return (
        <ButtonComponent
          variant={variant}
          onClick={handleLocalScroll}
          className={sharedClassNames}
        >
          {blok.title}
        </ButtonComponent>
      );

    case "reserve":
      return (
        <ButtonReserve
          variant={variant}
          className={sharedClassNames}
        >
          {blok.title}
        </ButtonReserve>
      );

    default:
      return (
        <ButtonComponent variant={variant} asChild className={sharedClassNames}>
          <Link href={blok.url || "#"} passHref>
            {blok.title}
          </Link>
        </ButtonComponent>
      );
  }
};

export default Button;
