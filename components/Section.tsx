"use client";

import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import React, { useEffect, useRef, useState } from "react";
import { SectionStoryblok } from "@/component-types-sb";
import { createSlug } from "@/lib/utils";

const Section: React.FunctionComponent<SectionStoryblok> = ({ blok }) => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const sectionElement = sectionRef.current;
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isInView) {
        const scrollSpeedFactor = 0.2;
        const scrollAmount = window.scrollY * scrollSpeedFactor;

        if (topScrollRef.current) {
          topScrollRef.current.scrollLeft = scrollAmount;
        }
        if (bottomScrollRef.current) {
          bottomScrollRef.current.scrollLeft = scrollAmount;
        }
      }
    };

    if (isInView) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      {...storyblokEditable(blok)}
      id={createSlug(blok.name)}
      className={`min-h-screen relative p-4 py-16 lg:p-16`}
    >
      {blok.show_moving_name && (
        <div
          ref={topScrollRef}
          className="absolute top-5 left-0 w-full whitespace-nowrap overflow-hidden flex items-center justify-center gap-4"
        >
          {Array(30)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="text-md uppercase flex gap-4">
                {blok.name}
                <span>•</span>
              </div>
            ))}
        </div>
      )}
      <div className="relative z-10">
        {blok?.body?.map((nestedBlok: SbBlokData) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
      {blok.show_moving_name && (
        <div
          ref={bottomScrollRef}
          className="absolute bottom-5 left-0 w-full whitespace-nowrap overflow-hidden flex items-center justify-center gap-4"
        >
          {Array(30)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="text-md uppercase flex gap-4">
                {blok.name}
                <span>•</span>
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default Section;