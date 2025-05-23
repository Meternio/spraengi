"use client";

import React, { useState } from "react";

import { storyblokEditable } from "@storyblok/react/rsc";
import type {
  CarouselStoryblok,
  ProductStoryblok,
  GamesStoryblok,
  TeamStoryblok,
  PartnerStoryblok,
} from "@/component-types-sb";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { fetchContentType } from "@/lib/storyblok_utils";
import {
  Carousel as CarouselComponent,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Title from "@/components/Title";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { useDatasourcesStore } from "@/components/DatasourcesStoreProvider";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductStoryblok }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[630px] rounded-lg overflow-hidden group">
      {product.image && (
        <Image
          src={
            `${product.image.filename}/m/0x630/filters:quality(75)` ||
            "/placeholder.svg"
          }
          alt={product.image.alt || product.name || "Product image"}
          fill
          className="object-cover"
          loading="lazy"
        />
      )}
      <div className="relative z-20 h-full inset-0 flex flex-col justify-end items-center text-center p-6 bg-gradient-to-t from-primary/80 via-primary/20 md:from-primary/80 md:via-primary/5 to-transparent">
        <Title variant="h3">{product.name || "Product"}</Title>
        <p className="text-sm opacity-90 mb-4">{product.description || ""}</p>
      </div>
    </div>
  );
};

const GameCard = ({ game }: { game: GamesStoryblok }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[630px] rounded-lg overflow-hidden group">
      {game.image && (
        <Image
          src={
            `${game.image.filename}/m/0x630/filters:quality(75)` ||
            "/placeholder.svg"
          }
          alt={game.image.alt || game.name || "Product image"}
          fill
          className="object-cover"
          loading="lazy"
        />
      )}
      <div className="relative z-20 h-full inset-0 flex flex-col justify-end items-center text-center p-6 bg-gradient-to-t from-primary/80 via-primary/20 md:from-primary/80 md:via-primary/5 to-transparent">
        <Title variant="h3">{game.name || "Product"}</Title>
        <p className="text-sm opacity-90 mb-4">{game.description || ""}</p>
      </div>
    </div>
  );
};

const TeamCard = ({ team }: { team: TeamStoryblok }) => {
  const [isHovered, setIsHovered] = useState(false);
  const youtubeEmbedUrl = team.youtube_video_id
    ? `https://www.youtube.com/embed/${team.youtube_video_id}?autoplay=1&mute=1&loop=1&controls=0&playlist=${team.youtube_video_id}&enablejsapi=1`
    : "";

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[630px] rounded-lg overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {team.image && (
        <Image
          src={
            `${team.image.filename}/m/0x630/filters:quality(75)` ||
            "/placeholder.svg"
          }
          alt={team.image.alt || team.name || "Product image"}
          fill
          className="object-cover"
          loading="lazy"
        />
      )}
      {isHovered && youtubeEmbedUrl && (
        <iframe
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto aspect-[16/9] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src={`${youtubeEmbedUrl}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      )}
      <div className="relative z-20 h-full inset-0 flex flex-col justify-end items-center text-center p-6 bg-gradient-to-t from-primary/80 via-primary/20 md:from-primary/80 md:via-primary/5 to-transparent">
        <Title variant="h3">{team.name || "Product"}</Title>
        <p className="text-sm opacity-90 mb-4">{team.description || ""}</p>
      </div>
    </div>
  );
};

const PartnerCard = ({ partner, duplicate }: { partner: PartnerStoryblok; duplicate: boolean }) => {
  return (
    <div className="relative w-full max-w-[150px] h-[100px] mx-auto">
      {partner.link?.url && (
        <Link
          href={partner.link?.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Besuche die ${partner.name || 'partner'} Webseite`}
          className="absolute inset-0 flex z-10"
          tabIndex={duplicate ? -1 : undefined}
        />
      )}
      {partner.image && (
        <Image
          src={`${partner.image.filename}/m/150x0/filters:quality(75)`}
          alt={partner.image.alt || partner.name || "Partner logo"}
          fill
          className="object-contain"
          loading="lazy"
          aria-hidden={duplicate ? true : undefined}
          unoptimized
        />
      )}
    </div>
  );
};

const Carousel: React.FC<{ blok: CarouselStoryblok }> = ({ blok }) => {
  const version = useDatasourcesStore((state) => state.version);
  const countStories = Number(blok.count_items) || 3;
  const itemsPerView = Number(blok.count_items_per_view) || 3;

  const {
    data: stories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [blok.type],
    queryFn: () =>
      fetchContentType(
        `${blok.type}/`,
        version,
        countStories,
        undefined,
        undefined
      ),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div {...storyblokEditable(blok)} className="w-full">
        {blok.type === "partner" ? (
          <div className="w-full overflow-hidden">
            <CarouselComponent className="w-full">
              <CarouselContent>
                {[...Array(8)].map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 xs:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8 min-w-[120px] flex-grow-0"
                  >
                    <div className="relative w-full max-w-[150px] h-[100px] mx-auto">
                      <div className="absolute inset-0 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </CarouselComponent>
          </div>
        ) : (
          <CarouselComponent
            {...storyblokEditable(blok)}
            className="w-[calc(100%+3rem)] lg:w-full relative -ml-6 lg:-ml-0"
          >
            <CarouselContent>
              {[...Array(4)].map((_, index) => (
                <CarouselItem
                  key={index}
                  className={cn(
                    itemsPerView === 4
                      ? "basis-3/4 md:basis-1/4"
                      : itemsPerView === 3
                      ? "basis-4/5 md:basis-2/5 lg:basis-1/3"
                      : itemsPerView === 2
                      ? "basis-4/5 md:basis-1/2"
                      : "basis-full",
                    "transition-opacity duration-300",
                    index === 0 ? "ml-6 lg:ml-0" : "",
                    index === countStories - 1 ? "pr-6 lg:pr-0" : ""
                  )}
                >
                  <div className="relative w-full h-[400px] md:h-[500px] lg:h-[630px] rounded-lg overflow-hidden">
                    {/* Skeleton loader */}
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </CarouselComponent>
        )}
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
          <p>Error loading {blok.type}</p>
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div
        {...storyblokEditable(blok)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-[200px] place-items-center"
      >
        <div className="col-span-full text-center text-gray-500">
          <p>No {blok.type} found</p>
        </div>
      </div>
    );
  }

  return (
    <div {...storyblokEditable(blok)}>
      {blok.type === "partner" ? (
        <CarouselComponent
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-[calc(100%+3rem)] lg:w-[calc(100%+8rem)] relative -ml-6 lg:-ml-16"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="flex">
            {[...Array(5)].flatMap((_, outerIndex) =>
              stories.map((story, index: number) => (
                <CarouselItem
                  key={`${index} - ${outerIndex}`}
                  className="basis-1/2 xs:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8 min-w-[120px] flex-grow-0"
                >
                  <PartnerCard
                    partner={{
                      ...(story.content as PartnerStoryblok),
                      name: story.name,
                    }}
                    duplicate={outerIndex > 0}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </CarouselComponent>
      ) : (
        <CarouselComponent
          opts={{
            align: (viewSize, snapSize, index) =>
              index === 0
                ? 0
                : index === stories.length - 1
                ? viewSize - snapSize
                : (viewSize - snapSize) / 2,
          }}
          className="w-[calc(100%+3rem)] lg:w-full relative -ml-6 lg:-ml-0"
        >
          <CarouselContent>
            {stories.map((story, index: number) => (
              <CarouselItem
                key={story.content._uuid || index}
                className={cn(
                  itemsPerView === 4
                    ? "basis-3/4 md:basis-1/4"
                    : itemsPerView === 3
                    ? "basis-4/5 md:basis-2/5 lg:basis-1/3"
                    : itemsPerView === 2
                    ? "basis-4/5 md:basis-1/2"
                    : "basis-full",
                  "transition-opacity duration-300",
                  index === 0 ? "ml-6 lg:ml-0" : "",
                  index === stories.length - 1 ? "pr-6 lg:pr-0" : ""
                )}
              >
                {blok.type === "games" && (
                  <GameCard
                    game={{
                      ...(story.content as GamesStoryblok),
                      name: story.name,
                    }}
                  />
                )}
                {(blok.type === "food" || blok.type === "drinks") && (
                  <ProductCard
                    product={{
                      ...(story.content as ProductStoryblok),
                      name: story.name,
                    }}
                  />
                )}
                {blok.type === "team" && (
                  <TeamCard
                    team={{
                      ...(story.content as TeamStoryblok),
                      name: story.name,
                    }}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="disabled:hidden left-0 cursor-pointer" />
          <CarouselNext className="disabled:hidden right-0 cursor-pointer" />
        </CarouselComponent>
      )}
    </div>
  );
};

export default Carousel;
