"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, CalendarRange, Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonReserve from "@/components/ButtonReserve";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Header({
  datasources,
}: {
  datasources: Record<string, Record<string, string>>;
}) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCompact, setShowCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = 167;

      if (currentScrollY > headerHeight) {

        // Show compact header when scrolling up after passing header height
        if (currentScrollY < lastScrollY) {
          setShowCompact(true);
        } else {
          setShowCompact(false);
        }
      } else {
        setShowCompact(false);
      }

      setLastScrollY(currentScrollY);
      console.log(showCompact);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50 border-b-1 border-white">
        <div className={`py-8 px-4 grid grid-cols-3`}>
          <div className="md:hidden flex justify-start items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  aria-label="Öffne Menü"
                  className="cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader className="w-full flex items-center border-b-1 border-white py-8">
                  <SheetTitle>
                    <p className="sr-only">Menü</p>
                    <Link href="/">
                      <Image
                        src={`${datasources?.theming?.logo}/m/212x0`}
                        alt="Sprängi Bar & Cafe Logo"
                        className="object-contain"
                        width={212}
                        height={103}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col items-center gap-2 mt-4 font-bold">
                  <Link href="/" className="text-lg">
                    Home
                  </Link>
                  <Link href="/menu" className="text-lg">
                    Menü
                  </Link>
                  <Link href="/events" className="text-lg">
                    Events
                  </Link>
                  <Link href="/about" className="text-lg">
                    Über uns
                  </Link>
                  <Link href="/contact" className="text-lg">
                    Kontakt
                  </Link>
                </nav>
                <ul className="flex flex-col items-center gap-2 border-t-1 border-white py-4 mt-4">
                  {datasources["opening-hours"] &&
                    Object.entries(datasources["opening-hours"]).map(
                      ([day, hours]) => (
                        <li key={day}>
                          {day}: {hours}
                        </li>
                      )
                    )}
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          <ul className="hidden md:flex pl-[0.625rem] flex-col gap-1 justify-center">
            {datasources["opening-hours"] &&
              Object.entries(datasources["opening-hours"]).map(
                ([day, hours]) => (
                  <li key={day}>
                    {day}: {hours}
                  </li>
                )
              )}
          </ul>

          <div className="flex justify-center items-center">
            <Link href="/">
              <Image
                src={`${datasources?.theming?.logo}/m/212x0`}
                alt="Sprängi Bar & Cafe Logo"
                className="object-contain"
                width={212}
                height={103}
              />
            </Link>
          </div>

          <div className="flex justify-end items-center">
            <Button
              variant={"ghost"}
              size={"icon"}
              aria-label="Rufe uns an"
              asChild
            >
              <Link href={`tel:${datasources["company-details"]?.phone}`}>
                <Phone className="w-5 h-5" />
              </Link>
            </Button>
            <div className="hidden md:flex items-center">
              <ButtonReserve
                aria-label="Reserviere bei uns"
                variant={"ghost"}
                size={"icon"}
                className="cursor-pointer"
                onClick={() => {
                  console.log("Reserviere bei uns");
                }}
              >
                <CalendarRange className="w-5 h-5" />
              </ButtonReserve>
              <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Schreibe uns eine E-Mail"
                asChild
              >
                <Link href={`mailto:${datasources["company-details"]?.email}`}>
                  <Mail className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
