"use client";

import { storyblokEditable } from "@storyblok/react";
import { CardStoryblok } from "@/component-types-sb";
import Image from "next/image";
import Title from "@/components/Title";
import Button from "@/components/Button";

const Card: React.FC<{
  blok: CardStoryblok;
  isLoading?: boolean;
  fullWidth?: boolean;
}> = ({ blok, isLoading = false, fullWidth = true }) => {
  if (isLoading) {
    return (
      <div
        {...storyblokEditable(blok)}
        className={`relative w-full lg:aspect-[1.5/1] rounded-lg overflow-hidden group h-full min-h-100 lg:h-100 ${
          fullWidth ? "md:col-span-2" : ""
        }`}
      >
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        <div className="relative h-full inset-0 flex flex-col justify-end p-6">
          <div className="text-white flex flex-col h-full gap-4">
            <div className="h-4 bg-gray-400 rounded w-1/3 animate-pulse mb-2"></div>
            <div className="flex-grow">
              <div className="h-6 bg-gray-400 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-400 rounded-full w-28 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className={`relative w-full lg:aspect-[1.5/1] rounded-lg overflow-hidden group h-full min-h-100 lg:h-100
              ${fullWidth ? "md:col-span-2" : ""}`}
    >
      {blok.image && (
        <Image
          src={String(
            `${blok.image.filename}/m/${
              fullWidth ? "1600x0" : "800x0"
            }/filters:quality(75)`
          )}
          alt={String(blok.image.title)}
          fill
          sizes={blok.fullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover"
          loading="lazy"
        />
      )}
      <div className="relative h-full min-h-[inherit] inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
        {blok.variant === "event" && (
          <div className="text-white flex flex-col h-full gap-4">
            <p className="text-sm mb-2">
              {blok.date
                ? new Date(blok.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : new Date().getFullYear().toString()}
            </p>
            <Title variant="h2" className="flex-grow xl:max-w-1/2">
              {blok.title}
            </Title>
            {blok.buttons?.map((button) => (
              <Button
                key={button._uid}
                blok={{
                  _uid: "button_" + button._uid,
                  component: "button",
                  title: button.title,
                  variant: button.variant,
                  type: button.type,
                }}
                className="w-fit"
              />
            ))}
          </div>
        )}
        {blok.variant === "default" && (
          <div className="text-white flex flex-col h-full justify-end gap-4 md:max-w-1/2">
            <Title variant="h2">{blok.title}</Title>
            <p>{blok.description}</p>
            {blok.buttons?.map((button) => (
              <Button
                key={button._uid}
                blok={{
                  _uid: "button_" + button._uid,
                  component: "button",
                  title: button.title,
                  variant: button.variant,
                  type: button.type,
                }}
                className="w-fit"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
