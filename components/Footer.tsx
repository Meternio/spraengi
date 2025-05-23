"use client";

import Title from "@/components/Title";
import Button from "@/components/Button";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { ISbStoryData } from "@storyblok/react/rsc";
import { PageStoryblok, ButtonStoryblok } from "@/component-types-sb";
import IconBlock from "@/components/IconBlock";
import Link from "next/link";
import Image from "next/image";

export default function Footer({ pageData }: { pageData: ISbStoryData }) {
  const footerData = pageData?.content as PageStoryblok;

  return (
    <footer className="bg-card-muted text-white m-6 lg:mx-16 -mt-10 p-6 lg:p-16 rounded-lg">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <Title variant="h2">&quot;{footerData?.title}&quot;</Title>
            </div>

            <div className="flex space-x-6">
              {footerData?.social_buttons &&
                footerData.social_buttons.map((entry: ButtonStoryblok) => (
                  <Button key={entry._uid} blok={entry} />
                ))}
            </div>

            <Button
              blok={{
                component: "button",
                _uid: "reserve-button",
                title: "Jetzt reservieren",
                variant: "primary",
                type: "reserve",
              }}
            />
          </div>

          <div className="space-y-6">
            <Title variant="h3">Öffnungszeiten</Title>

            <ul className="flex flex-col gap-2">
              {footerData?.opening_hours &&
                footerData.opening_hours.map((entry) => (
                  <li key={entry._uid}>
                    {entry.day}: {entry.time}
                  </li>
                ))}
            </ul>
          </div>

          <div className="space-y-8">
            <Title variant="h3">Kontakt</Title>

            {footerData?.icon_blocks &&
              footerData.icon_blocks.map((entry) => (
                <IconBlock
                  key={entry._uid}
                  _uid={entry._uid}
                  component={entry.component}
                  blok={entry}
                />
              ))}
          </div>

          <div className="border-t-1 border-white pt-8 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <Title variant="h3" className="mb-6">
                Hauptsponsor
              </Title>
              {footerData?.main_sponsor_image?.filename && (
                <Link
                  href={footerData?.main_sponsor_link?.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hauptsponsor"
                >
                  <Image
                    src={`${footerData?.main_sponsor_image?.filename}/m/200x0`}
                    alt={footerData?.main_sponsor_image?.alt || "Hauptsponsor"}
                    width={200}
                    height={48}
                    loading="lazy"
                    unoptimized
                  />
                </Link>
              )}
            </div>

            <div className="md:col-span-2">
              <Title variant="h3" className="mb-6">
                Nichts verpassen
              </Title>
              <p className="mb-4">Melde dich für unseren Newsletter an.</p>

              <div className="flex max-w-md">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
