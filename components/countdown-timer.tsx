"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 text-center w-full max-w-lg mx-auto">
      <div className="flex flex-col items-center">
        <div className="bg-secondary/80 w-full aspect-square rounded-lg flex items-center justify-center">
          <span className="text-xl sm:text-2xl md:text-4xl font-bold">{timeLeft.days}</span>
        </div>
        <span className="mt-2 text-xs sm:text-sm uppercase">Tage</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-secondary w-full aspect-square rounded-lg flex items-center justify-center">
          <span className="text-xl sm:text-2xl md:text-4xl font-bold">{timeLeft.hours}</span>
        </div>
        <span className="mt-2 text-xs sm:text-sm uppercase">Stunden</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-primary/90 w-full aspect-square rounded-lg flex items-center justify-center">
          <span className="text-xl sm:text-2xl md:text-4xl font-bold">{timeLeft.minutes}</span>
        </div>
        <span className="mt-2 text-xs sm:text-sm uppercase">Minuten</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-primary w-full aspect-square rounded-lg flex items-center justify-center">
          <span className="text-xl sm:text-2xl md:text-4xl font-bold">{timeLeft.seconds}</span>
        </div>
        <span className="mt-2 text-xs sm:text-sm uppercase">Sekunden</span>
      </div>
    </div>
  )
}