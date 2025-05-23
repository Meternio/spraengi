"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button as ButtonComponent } from "@/components/ui/button";
import Button from "@/components/Button";
import Navigation from "@/components/Navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ISbStoryData } from "@storyblok/react/rsc";
import { PageStoryblok, ButtonStoryblok } from "@/component-types-sb";

export default function Header({ pageData }: { pageData: ISbStoryData }) {
  const headerData = pageData?.content as PageStoryblok;
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCompact, setShowCompact] = useState(false);
  const compactHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = 158;

      if (currentScrollY > headerHeight) {
        if (currentScrollY < lastScrollY) {
          setShowCompact(true);
        } else {
          setShowCompact(false);
        }
      } else {
        setShowCompact(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!compactHeaderRef.current) return;

    const header = compactHeaderRef.current;
    const focusableElements = header.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!showCompact) {
      header.setAttribute("aria-hidden", "true");
      header.setAttribute("inert", "");
      focusableElements.forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
    } else {
      header.removeAttribute("aria-hidden");
      header.removeAttribute("inert");
      focusableElements.forEach((el) => {
        el.removeAttribute("tabindex");
      });
    }
  }, [showCompact]);

  return (
    <div className="relative">
      {/* Main header */}
      <header className="absolute top-0 left-0 w-full z-40 border-b-1 border-white">
        <div className="py-4 px-4 lg:px-14 grid grid-cols-[1fr_auto_1fr]">
          <div className="md:hidden flex justify-start items-center">
            <Sheet>
              <SheetTrigger asChild>
                <ButtonComponent
                  variant={"ghost"}
                  size={"icon"}
                  aria-label="Öffne Menü"
                  className="cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </ButtonComponent>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader className="w-full flex items-center border-b-1 border-white py-4">
                  <SheetTitle>
                    <p className="sr-only">Menü</p>
                    <Link href="/">
                      <Image
                        src={`${headerData?.logo?.filename}/m/256x0/filters:quality(100)`}
                        alt="Sprängi Bar & Cafe Logo"
                        className="object-contain"
                        width={256}
                        height={126}
                        unoptimized
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <Navigation
                  pageData={pageData}
                  className="flex-grow justify-center"
                />
                <ul className="flex flex-col items-center gap-2 border-t-1 border-white p-4 text-center">
                  {headerData?.opening_hours &&
                    headerData.opening_hours.map((entry) => (
                      <li key={entry._uid}>
                        {entry.day}: {entry.time}
                      </li>
                    ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          <ul className="hidden md:flex pl-[0.625rem] flex-col gap-1 justify-center">
            {headerData?.opening_hours &&
              headerData.opening_hours.map((entry) => (
                <li key={entry._uid}>
                  {entry.day}: {entry.time}
                </li>
              ))}
          </ul>

          <div className="flex justify-center items-center">
            <Link href="/">
              <Image
                src={`${headerData?.logo?.filename}/m/256x0/filters:quality(100)`}
                alt="Sprängi Bar & Cafe Logo"
                className="object-contain"
                width={256}
                height={126}
                unoptimized
              />
            </Link>
          </div>

          <div className="flex justify-end items-center">
            {headerData.buttons?.[0] && (
              <Button blok={headerData.buttons[0] as ButtonStoryblok} />
            )}
            <div className="hidden md:flex items-center">
              {headerData.buttons?.slice(1).map((button, index) => (
                <Button
                  key={button._uid || index}
                  blok={button as ButtonStoryblok}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Compact header */}
      <div
        ref={compactHeaderRef}
        role="banner"
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 shadow-md bg-background transition-transform duration-300 ease-in-out max-w-[2000px] ${
          showCompact ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="py-4 px-4 lg:px-12 flex items-center justify-between">
          <Navigation pageData={pageData} className="hidden md:flex flex-row" />

          <div className="md:hidden flex justify-start items-center">
            <Sheet>
              <SheetTrigger asChild>
                <ButtonComponent
                  variant={"ghost"}
                  size={"icon"}
                  aria-label="Öffne Menü"
                  className="cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </ButtonComponent>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader className="w-full flex items-center border-b-1 border-white py-4">
                  <SheetTitle>
                    <p className="sr-only">Menü</p>
                    <Link href="/">
                      <Image
                        src={`${headerData?.logo?.filename}/m/256x0/filters:quality(100)`}
                        alt="Sprängi Bar & Cafe Logo"
                        className="object-contain"
                        width={256}
                        height={126}
                        unoptimized
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <Navigation
                  pageData={pageData}
                  className="flex-grow justify-center"
                />
                <ul className="flex flex-col items-center gap-2 border-t-1 border-white p-4 text-center">
                  {headerData?.opening_hours &&
                    headerData.opening_hours.map((entry) => (
                      <li key={entry._uid}>
                        {entry.day}: {entry.time}
                      </li>
                    ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex justify-end items-center pr-4">
            <Link href="/">
              <Image
                src={`${headerData?.logo?.filename}/m/256x0/filters:quality(100)`}
                alt="Sprängi Bar & Cafe Logo"
                className="object-contain"
                width={256}
                height={126}
                unoptimized
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
