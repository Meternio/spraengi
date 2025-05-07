import {
    SbBlokData,
    storyblokEditable,
    StoryblokServerComponent,
  } from "@storyblok/react/rsc";
  import React from "react";
  
  interface SbSectionData extends SbBlokData {
    body: SbBlokData[];
  }
  
  interface SectionProps {
    blok: SbSectionData;
  }
  
  const Section: React.FunctionComponent<SectionProps> = ({ blok }) => {
    return (
      <section {...storyblokEditable(blok)}>
        {blok.body.map((nestedBlok) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </section>
    );
  };
  
  export default Section;