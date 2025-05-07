import { storyblokEditable } from "@storyblok/react/rsc";
import { HeroStoryblok } from "@/component-types-sb";
import Button from "@/components/Button";
import Title from "@/components/Title";
import React from "react";

const Hero: React.FC<{ blok: HeroStoryblok }> = ({ blok }) => {
  const backgroundImage = blok.asset?.filename
    ? `${blok.asset.filename}/m/1600x0/filters:quality(75)`
    : "";
    
  return (
    <section
      {...storyblokEditable(blok)}
      className="relative min-h-screen w-full flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-100 mx-auto text-center">
        <Title variant="h1">
          {blok.title || "Welcome to Sprängi"}
        </Title>

        <div className="flex flex-col justify-center gap-4 mt-8 max-w-64 mx-auto">
          {blok.buttons &&
            blok.buttons.map((button) => (
              <Button key={button._uid} blok={button} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
