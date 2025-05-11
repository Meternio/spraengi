"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  modifiersClassNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const CustomNavigation = ({
    onPreviousClick,
    onNextClick,
    className,
    nextMonth,
    previousMonth,
  }: {
    onPreviousClick?: React.MouseEventHandler<HTMLButtonElement>
    onNextClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    nextMonth?: Date
    previousMonth?: Date
  }) => (
    <div className={cn("flex items-center justify-between absolute right-0 -top-1", className)}>
      <button
        type="button"
        onClick={(event) => onPreviousClick?.(event)}
        disabled={!previousMonth}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "p-2 opacity-75 hover:opacity-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={(event) => onNextClick?.(event)}
        disabled={!nextMonth}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "p-2 opacity-75 hover:opacity-100"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      styles={{
        months: { display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" },
        month: { display: "flex", flexDirection: "column", gap: "1rem" },
        caption: { display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
        nav: { display: "flex", alignItems: "center", gap: "0.25rem" },
        nav_button: { opacity: 0.5, padding: "0.5rem" },
        table: { width: "100%", borderCollapse: "collapse" },
        head_row: { display: "flex" },
        head_cell: { textAlign: "center", fontSize: "0.8rem", fontWeight: "normal" },
        row: { display: "flex", marginTop: "0.5rem" },
        cell: { position: "relative", textAlign: "center", fontSize: "0.875rem" },
        day: { padding: "0.5rem", fontWeight: "normal", textAlign: "center", cursor: "pointer" },
        day_button: { cursor: "pointer" },
        ...props.styles,
      }}
      modifiersClassNames={{
        selected: "bg-primary text-primary-foreground rounded",
        today: "bg-accent text-accent-foreground rounded",
        outside: "text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        ...modifiersClassNames,
      }}
      components={{
        Nav: CustomNavigation,
      }}
      {...props}
    />
  )
}

export { Calendar }