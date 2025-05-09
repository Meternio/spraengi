import {
    SbBlokData,
    storyblokEditable,
    StoryblokServerComponent,
  } from "@storyblok/react/rsc";
  import React from "react";
  import { SectionStoryblok } from "@/component-types-sb";
  import { createSlug } from "@/lib/utils";
  
  const Section: React.FunctionComponent<SectionStoryblok> = ({ blok }) => {
    return (
      <section {...storyblokEditable(blok)} id={createSlug(blok.name)} className="min-h-screen">
        {blok?.body?.map((nestedBlok: SbBlokData) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </section>
    );
  };
  
  export default Section;