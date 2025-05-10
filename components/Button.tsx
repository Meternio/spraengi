"use client";

import { Button as ButtonComponent } from "@/components/ui/button";
import { ButtonStoryblok } from "@/component-types-sb";
import { createSlug } from "@/lib/utils";
import { cn, scrollTo } from "@/lib/utils";
import ButtonReserve from "@/components/ButtonReserve";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Button: React.FC<{ blok: ButtonStoryblok; className?: string }> = ({
  blok,
  className,
}) => {
  const variant =
    blok.variant === "primary"
      ? "default"
      : (blok.variant as
          | "outline"
          | "default"
          | "ghost"
          | "secondary"
          | "destructive"
          | "link"
          | null
          | undefined);
  const sharedClassNames = cn(
    "rounded-full uppercase cursor-pointer",
    className
  );

  const handleLocalScroll = () => {
    if (!blok.href) return;

    const slug = createSlug(blok.href);
    const element = document.getElementById(slug);

    if (element) {
      const compactHeaderHeight = 167;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - compactHeaderHeight;

      scrollTo(offsetPosition, () => {
        window.scrollTo({
          top: offsetPosition - 1,
          behavior: "smooth",
        });
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
        <ButtonReserve variant={variant} className={sharedClassNames}>
          {blok.title}
        </ButtonReserve>
      );

    case "event":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <ButtonComponent variant={variant} className={sharedClassNames}>
              {blok.title}
            </ButtonComponent>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
