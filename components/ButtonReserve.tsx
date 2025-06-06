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

// Global state to track which modal is open
let globalModalId: string | null = null;
const modalListeners = new Set<() => void>();

const ButtonReserve = ({ children, variant, ...props }: ButtonProps) => {
  const datasources = useDatasourcesStore((state) => state.datasources);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Generate unique ID for this modal instance
  const [modalId] = React.useState(() => Math.random().toString(36).substr(2, 9));

  // Function to update state when global modal changes
  const updateModalState = React.useCallback(() => {
    setIsOpen(globalModalId === modalId);
  }, [modalId]);

  React.useEffect(() => {
    // Add this modal to the listeners set
    modalListeners.add(updateModalState);

    const checkHash = () => {
      if (window.location.hash === '#reserve') {
        // Only open this modal if no other modal is currently open
        if (globalModalId === null) {
          globalModalId = modalId;
          // Notify all modals to update their state
          modalListeners.forEach(listener => listener());
        }
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    return () => {
      // Clean up
      modalListeners.delete(updateModalState);
      window.removeEventListener('hashchange', checkHash);
      
      // If this modal was the open one, clear the global state
      if (globalModalId === modalId) {
        globalModalId = null;
      }
    };
  }, [modalId, updateModalState]);

  // Handle dialog state changes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Only allow opening if no other modal is open
      if (globalModalId === null) {
        globalModalId = modalId;
        setIsOpen(true);
        // Notify other modals
        modalListeners.forEach(listener => listener());
      }
    } else {
      // Close this modal
      if (globalModalId === modalId) {
        globalModalId = null;
        setIsOpen(false);
        
        // Remove hash if present
        if (window.location.hash === '#reserve') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        
        // Notify other modals
        modalListeners.forEach(listener => listener());
      }
    }
  };

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
          replyTo: reservationData.email,
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            <Input name="email" type="email" placeholder="Email *" required/>
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
              required={true}
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