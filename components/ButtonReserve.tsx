"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDatasourcesStore } from "@/components/DatasourcesStoreProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { ReservationStoryblok } from "@/component-types-sb";

type ButtonProps = React.ComponentProps<typeof Button>;

const ButtonReserve = ({ children, variant, ...props }: ButtonProps) => {
  const datasources = useDatasourcesStore((state) => state.datasources);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const reservationData: ReservationStoryblok = {
      component: "reservation",
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
      const response = await fetch("/api/storyblok/addReservation", {
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
          to: datasources?.reserve.emailTo,
          subject: `Reservierung von ${
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
        result.message || "Ihre Reservierung wurde erfolgreich übermittelt!"
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} {...props}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{datasources?.reserve.title}</DialogTitle>
          <DialogDescription>
            {datasources?.reserve.description}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800">{success}</p>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Input name="name" type="text" placeholder="Name *" required />
            <Input name="phone" type="tel" placeholder="Telefon *" required />
            <Input name="email" type="email" placeholder="Email" />
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
            <Input name="time" type="time" placeholder="Uhrzeit *" required />
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-fit"
            />

            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Wird gesendet..." : "Reservieren"}
            </Button>

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
};

export default ButtonReserve;
