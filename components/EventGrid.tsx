"use client";

import { storyblokEditable } from "@storyblok/react";
import { EventGridStoryblok } from "@/component-types-sb";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { fetchContentType } from "@/lib/storyblok";
import Card from "@/components/Card";

const EventGrid: React.FC<{ blok: EventGridStoryblok }> = ({ blok }) => {
  const countEvents = Number(blok.count_events) || 3;
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      fetchContentType("events/", countEvents, undefined, {
        field: "content.date",
        order: "asc",
      }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div {...storyblokEditable(blok)} className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[...Array(countEvents)].map((_, index) => (
            <Card
              key={index}
              isLoading={true}
              fullWidth={index === 0}
              blok={{
                component: "card",
                _uid: `loading-card-${index}`,
              }}
            />
          ))}
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
          <Card
            key={event.uuid}
            fullWidth={index === 0}
            blok={{
              component: "card",
              _uid: event.uuid,
              variant: "event",
              title: event.name,
              date: event.content.date,
              image: event.content.image,
              buttons: [
                {
                  _uid: "button_" + event.uuid,
                  component: "button",
                  title: "zum Event",
                  variant: "primary",
                  type: "link",
                },
              ],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
