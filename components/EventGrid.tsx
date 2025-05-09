"use client";

import { storyblokEditable } from "@storyblok/react";
import { EventGridStoryblok } from "@/component-types-sb";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { fetchContentType } from "@/lib/storyblok";
import Image from "next/image";
import Title from "@/components/Title";
import Button from "@/components/Button";

const EventGrid: React.FC<{ blok: EventGridStoryblok }> = ({ blok }) => {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchContentType("events/", 3, undefined, { field: "content.date", order: "asc" }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div
        {...storyblokEditable(blok)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-[200px] place-items-center"
      >
        <div className="col-span-full flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        {...storyblokEditable(blok)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-[200px] place-items-center"
      >
        <div className="col-span-full flex flex-col items-center justify-center text-red-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>Error loading events</p>
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div
        {...storyblokEditable(blok)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-[200px] place-items-center"
      >
        <div className="col-span-full text-center text-gray-500">
          <p>No events found</p>
        </div>
      </div>
    );
  }

  return (
    <div {...storyblokEditable(blok)} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {events.map((event, index) => (
          <div
            key={event.uuid}
            className={`relative w-full lg:aspect-[1.5/1] rounded-lg overflow-hidden group h-full min-h-100 lg:h-100
              ${index === 0 ? "md:col-span-2" : ""}`}
          >
            <Image
              src={event.content.image.filename}
              alt={event.name}
              fill
              sizes={index === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
              className="object-cover"
            />
            <div className="relative h-full inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <div className="text-white flex flex-col h-full gap-4">
                <p className="text-sm mb-2">{new Date(event.content.date).toLocaleDateString("de-DE")}</p>
                <Title variant="h2" className="flex-grow xl:max-w-1/2">{event.name}</Title>
                <Button blok={
                  {
                    _uid: "button_" + event.uuid,
                    component: "button",
                    title: "zum Event",
                    variant: "primary",
                    type: "link",
                  }}
                  className="w-fit"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
