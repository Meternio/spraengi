import React from "react";

const Title: React.FC<{
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  children: React.ReactNode;
}> = ({ variant, children }) => {
  switch (variant) {
    case "h1":
      return <h1 className="text-7xl uppercase font-bold">{children}</h1>;
    case "h2":
      return <h2 className="text-5xl uppercase font-semibold">{children}</h2>;
    case "h3":
      return <h3 className="text-3xl uppercase font-medium">{children}</h3>;
    case "h4":
      return <h4 className="text-xl uppercase font-normal">{children}</h4>;
    case "h5":
      return <h5 className="text-lg uppercase font-light">{children}</h5>;
    case "h6":
      return <h6 className="text-base uppercase font-thin">{children}</h6>;
    default:
      return <p>{children}</p>;
  }
};

export default Title;
