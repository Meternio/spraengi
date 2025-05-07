"use client";

import { Button as ButtonComponent } from "@/components/ui/button";
import { ButtonStoryblok } from "@/component-types-sb";
import Link from "next/link";

const Button: React.FC<{ blok: ButtonStoryblok }> = ({ blok }) => {
  const variant = blok.variant === "primary" ? "default" : "outline";
  const sharedClassNames = "rounded-full uppercase";

  const handleReservation = () => {
    console.log("Reservation button clicked");
  };

  const handleLocalScroll = () => {
    if (!blok.href) return;

    const element = document.getElementById(blok.href);
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
        <ButtonComponent variant={variant} onClick={handleLocalScroll} className={sharedClassNames}>
          {blok.title}
        </ButtonComponent>
      );

    case "reserve":
      return (
        <>
          <ButtonComponent variant={variant} onClick={handleReservation} className={sharedClassNames}>
            {blok.title}
          </ButtonComponent>
        </>
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
