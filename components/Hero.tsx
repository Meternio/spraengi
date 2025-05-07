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
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className={`w-80 h-screen pt-[clamp(200px,35vh,350px)] pb-20 gap-4 mx-auto flex flex-col items-center justify-between text-center`}>
        <Title variant="h1">
          {blok.title}
        </Title>

        <div className="flex flex-col w-64 justify-center gap-4">
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
