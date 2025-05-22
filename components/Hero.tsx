"use client";

import { storyblokEditable } from "@storyblok/react/rsc";
import { HeroStoryblok } from "@/component-types-sb";
import Button from "@/components/Button";
import Title from "@/components/Title";
import React, { useEffect, useRef, useState } from "react";

const Hero: React.FC<{ blok: HeroStoryblok }> = ({ blok }) => {
  const backgroundImage = blok.image?.filename
    ? `${blok.image.filename}/m/1600x0/filters:quality(75)`
    : "";

  const youtubeEmbedUrl = blok.youtube_video_id
    ? `https://www.youtube.com/embed/${blok.youtube_video_id}?autoplay=1&mute=1&loop=1&controls=0&playlist=${blok.youtube_video_id}&enablejsapi=1`
    : "";

  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
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
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isInView) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
      }
    }
  }, [isInView]);

  return (
    <div
      ref={sectionRef}
      {...storyblokEditable(blok)}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: blok.youtube_video_id
          ? undefined
          : `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-[1]"></div>
      {blok.youtube_video_id ? (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            ref={iframeRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full pointer-events-none"
            style={{
              width: "calc(100vh * (16 / 9))",
              height: "calc(100vw * (9 / 16))",
            }}
            src={`${youtubeEmbedUrl}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      ) : null}

      {/*
        <div
          className={`w-80 h-screen min-h-fit pt-[clamp(245px,35vh,350px)] pb-20 gap-4 mx-auto flex flex-col items-center justify-between text-center relative z-10 opacity-0 transition-opacity duration-1000 ${
            isInView && "!opacity-100"
          }`}
        >
      */}
      <div
        className={`w-80 h-screen min-h-fit pt-[clamp(245px,35vh,350px)] pb-20 gap-4 mx-auto flex flex-col items-center justify-between text-center relative z-10`}
      >
        <Title variant="h1">{blok.title}</Title>

        <div className="flex flex-col w-64 justify-center gap-4">
          {blok.buttons &&
            blok.buttons.map((button) => (
              <Button key={button._uid} blok={button} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
