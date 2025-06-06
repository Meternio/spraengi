import React from "react";
import { cn } from "@/lib/utils"

const Title: React.FC<{
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  subvariant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}> = ({ variant, subvariant, children, className }) => {
  switch (variant) {
    case "h1":
      return <h1 className={cn("text-5xl md:text-7xl uppercase font-bold font-mono", className)}>{children}</h1>;
    case "h2":
      return <h2 className={cn("text-3xl md:text-5xl uppercase font-semibold font-mono", className)}>{children}</h2>;
    case "h3":
      return <h3 className={cn("text-2xl md:text-3xl uppercase font-medium font-mono", `${subvariant === 'secondary' ? 'text-2xl' : ''}`, className)}>{children}</h3>;
    case "h4":
      return <h4 className={cn("text-xl uppercase font-normal font-mono", className)}>{children}</h4>;
    case "h5":
      return <h5 className={cn("text-lg uppercase font-light font-mono", className)}>{children}</h5>;
    case "h6":
      return <h6 className={cn("text-base uppercase font-thin font-mono", className)}>{children}</h6>;
    default:
      return <p className={className}>{children}</p>;
  }
};

export default Title;
