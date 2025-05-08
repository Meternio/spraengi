"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, CalendarRange, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonReserve from "@/components/ButtonReserve";

export default function Header({
  datasources,
}: {
  datasources: Record<string, Record<string, string>>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCompact, setShowCompact] = useState(false);
  console.log(scrolled, showCompact);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = 150;

      if (currentScrollY > headerHeight) {
        setScrolled(true);

        // Show compact header when scrolling up after passing header height
        if (currentScrollY < lastScrollY) {
          setShowCompact(true);
        } else {
          setShowCompact(false);
        }
      } else {
        setScrolled(false);
        setShowCompact(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50 border-b-1 border-white">
        <div className={`py-8 px-4 grid grid-cols-3`}>
          <ul className="pl-[0.625rem] flex flex-col gap-1 justify-center">
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
      </header>
    </>
  );
}
