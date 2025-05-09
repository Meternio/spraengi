"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, CalendarRange, Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ButtonReserve from "@/components/ButtonReserve"
import Navigation from "@/components/Navigation"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useDatasourcesStore } from "@/components/DatasourcesStoreProvider"
import type { ISbStoryData } from "@storyblok/react/rsc"

export default function Header({
  pageData,
}: {
  pageData: ISbStoryData
}) {
  const datasources = useDatasourcesStore((state) => state.datasources)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showCompact, setShowCompact] = useState(false)
  const compactHeaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const headerHeight = 167

      if (currentScrollY > headerHeight) {
        if (currentScrollY < lastScrollY) {
          setShowCompact(true)
        } else {
          setShowCompact(false)
        }
      } else {
        setShowCompact(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (!compactHeaderRef.current) return

    const header = compactHeaderRef.current
    const focusableElements = header.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (!showCompact) {
      header.setAttribute("aria-hidden", "true")
      header.setAttribute("inert", "")
      focusableElements.forEach((el) => {
        el.setAttribute("tabindex", "-1")
      })
    } else {
      header.removeAttribute("aria-hidden")
      header.removeAttribute("inert")
      focusableElements.forEach((el) => {
        el.removeAttribute("tabindex")
      })
    }
  }, [showCompact])

  return (
    <div className="relative">
      {/* Main header */}
      <header className="absolute top-0 left-0 w-full z-40 border-b-1 border-white">
        <div className="py-8 px-4 grid grid-cols-3">
        <div className="md:hidden flex justify-start items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} aria-label="Öffne Menü" className="cursor-pointer">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader className="w-full flex items-center border-b-1 border-white py-8">
                  <SheetTitle>
                    <p className="sr-only">Menü</p>
                    <Link href="/">
                      <Image
                        src={`${datasources?.theming?.logo}`}
                        alt="Sprängi Bar & Cafe Logo"
                        className="object-contain"
                        width={212}
                        height={103}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <Navigation pageData={pageData} className="flex-grow justify-center"/>
                <ul className="flex flex-col items-center gap-2 border-t-1 border-white py-4 mt-4">
                  {datasources["opening-hours"] &&
                    Object.entries(datasources["opening-hours"]).map(([day, hours]) => (
                      <li key={day}>
                        {day}: {hours}
                      </li>
                    ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          <ul className="hidden md:flex pl-[0.625rem] flex-col gap-1 justify-center">
            {datasources["opening-hours"] &&
              Object.entries(datasources["opening-hours"]).map(([day, hours]) => (
                <li key={day}>
                  {day}: {hours}
                </li>
              ))}
          </ul>

          <div className="flex justify-center items-center">
            <Link href="/">
              <Image
                src={`${datasources?.theming?.logo}`}
                alt="Sprängi Bar & Cafe Logo"
                className="object-contain"
                width={212}
                height={103}
              />
            </Link>
          </div>

          <div className="flex justify-end items-center">
            <Button variant={"ghost"} size={"icon"} aria-label="Rufe uns an" asChild>
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
                  console.log("Reserviere bei uns")
                }}
              >
                <CalendarRange className="w-5 h-5" />
              </ButtonReserve>
              <Button variant={"ghost"} size={"icon"} aria-label="Schreibe uns eine E-Mail" asChild>
                <Link href={`mailto:${datasources["company-details"]?.email}`}>
                  <Mail className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Compact header */}
      <div
        ref={compactHeaderRef}
        role="banner"
        className={`fixed top-0 left-0 w-full z-50 shadow-md bg-background transition-transform duration-300 ease-in-out ${
          showCompact ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="py-8 px-4 grid grid-cols-3">
          <Navigation pageData={pageData} className="hidden md:flex flex-row" />

          <div className="md:hidden flex justify-start items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} aria-label="Öffne Menü" className="cursor-pointer">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader className="w-full flex items-center border-b-1 border-white py-8">
                  <SheetTitle>
                    <p className="sr-only">Menü</p>
                    <Link href="/">
                      <Image
                        src={`${datasources?.theming?.logo}`}
                        alt="Sprängi Bar & Cafe Logo"
                        className="object-contain"
                        width={212}
                        height={103}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <Navigation pageData={pageData} className="flex-grow justify-center"/>
                <ul className="flex flex-col items-center gap-2 border-t-1 border-white py-4 mt-4">
                  {datasources["opening-hours"] &&
                    Object.entries(datasources["opening-hours"]).map(([day, hours]) => (
                      <li key={day}>
                        {day}: {hours}
                      </li>
                    ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex justify-end items-center col-span-2">
            <Link href="/">
              <Image
                src={`${datasources?.theming?.logo}`}
                alt="Sprängi Bar & Cafe Logo"
                className="object-contain"
                width={212}
                height={103}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
