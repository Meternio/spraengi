"use client";

import { Button as ButtonComponent } from "@/components/ui/button";
import { ButtonStoryblok } from "@/component-types-sb";
import { createSlug } from "@/lib/utils";
import { cn, scrollTo } from "@/lib/utils";
import ButtonReserve from "@/components/ButtonReserve";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDatasourcesStore } from "@/components/DatasourcesStoreProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import * as LucideIcons from "lucide-react";
import { EventBookingStoryblok } from "@/component-types-sb";

const Button: React.FC<{ blok: ButtonStoryblok; className?: string }> = ({
  blok,
  className,
}) => {
  const datasources = useDatasourcesStore((state) => state.datasources);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const Icon =
    blok.icon &&
    (LucideIcons[blok.icon as keyof typeof LucideIcons] as React.ElementType);

  const variant =
    blok.variant === "primary"
      ? "default"
      : (blok.variant as
          | "outline"
          | "default"
          | "ghost"
          | "secondary"
          | "destructive"
          | "link"
          | null
          | undefined);
  const sharedClassNames = cn(
    "rounded-full uppercase cursor-pointer",
    className
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const reservationData: EventBookingStoryblok = {
      component: "event_booking",
      _uid: "",
    };
    formData.forEach((value, key) => {
      reservationData[key] = value;
    });

    if (date) {
      reservationData.date = date.toISOString();
    } else {
      setError("Bitte wählen Sie ein Datum aus.");
      setIsSubmitting(false);
      return;
    }

    if (reservationData.people && isNaN(parseInt(reservationData.people, 10))) {
      setError("Bitte geben Sie eine gültige Anzahl Personen ein.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/storyblok/addEventBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Es gab ein Problem bei der Übermittlung."
        );
      }

      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: datasources["event-booking"]?.emailTo,
          replyTo: reservationData.email,
          subject: `Event Booking von ${
            reservationData.name
          } am ${date?.toLocaleDateString("de-DE")} um ${reservationData.time}`,
          content: `Name: ${reservationData.name}<br>Telefon: ${
            reservationData.phone
          }<br>Email: ${reservationData.email}<br>Nachricht: ${
            reservationData.message
          }<br>Anzahl Personen: ${reservationData.people}<br>Uhrzeit: ${
            reservationData.time
          }<br>Datum: ${date?.toLocaleDateString("de-DE")}`,
        }),
      });

      await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error("Es gab ein Problem beim Senden der E-Mail.");
      }

      setSuccess(
        result.message || "Deine Anfrage wurde erfolgreich übermittelt!"
      );
      (e.target as HTMLFormElement).reset();
      setDate(new Date());
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message ||
              "Es gab ein Problem bei der Übermittlung. Bitte versuchen es erneut."
          : "Unbekannter Fehler"
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalScroll = () => {
    if (!blok.href) return;

    const slug = createSlug(blok.href);
    const element = document.getElementById(slug);

    if (element) {
      const compactHeaderHeight = 158;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - compactHeaderHeight;

      scrollTo(offsetPosition, () => {
        window.scrollTo({
          top: offsetPosition - 1,
          behavior: "smooth",
        });
      });
    }
  };

  switch (blok.type) {
    case "localScroll":
      return (
        <ButtonComponent
          variant={variant}
          onClick={handleLocalScroll}
          className={sharedClassNames}
          aria-label={Icon ? blok.title : undefined}
        >
          {!Icon && blok.title}
          {Icon && <Icon className="h-6 w-6" />}
        </ButtonComponent>
      );

    case "reserve":
      return (
        <ButtonReserve
          variant={variant}
          className={sharedClassNames}
          aria-label={Icon ? blok.title : undefined}
        >
          {!Icon && blok.title}
          {Icon && <Icon className="h-6 w-6" />}
        </ButtonReserve>
      );

    case "event":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <ButtonComponent
              variant={variant}
              className={sharedClassNames}
              aria-label={Icon ? blok.title : undefined}
            >
              {!Icon && blok.title}
              {Icon && <Icon className="h-6 w-6" />}
            </ButtonComponent>
          </DialogTrigger>
          <DialogContent className="overflow-y-scroll max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{datasources["event-booking"]?.title}</DialogTitle>
              <DialogDescription>
                {datasources["event-booking"]?.description}
              </DialogDescription>
            </DialogHeader>
            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800">{success}</p>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input name="name" type="text" placeholder="Name *" required />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Telefon *"
                  required
                />
                <Input name="email" type="email" placeholder="Email *" required />
                <Textarea
                  name="message"
                  placeholder="Nachricht"
                  rows={3}
                  className="resize-none"
                />
                <Input
                  name="people"
                  type="number"
                  placeholder="Anzahl Personen *"
                  required
                />
                <Input
                  name="time"
                  type="time"
                  placeholder="Uhrzeit *"
                  required
                />
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-fit"
                  required={true}
                />

                <ButtonComponent
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wird gesendet..." : "Anfragen"}
                </ButtonComponent>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}
              </form>
            )}
          </DialogContent>
        </Dialog>
      );

    default:
      return (
        <ButtonComponent
          variant={variant}
          asChild
          className={sharedClassNames}
          aria-label={Icon ? blok.title : undefined}
        >
          <Link href={blok.href || "#"} passHref>
            {!Icon && blok.title}
            {Icon && <Icon className="h-6 w-6" />}
          </Link>
        </ButtonComponent>
      );
  }
};

export default Button;
