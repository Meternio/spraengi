"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Bitte gib eine gültige E-Mail-Adresse ein.")
      return
    }

    setStatus("loading")

    const result = await fetch("/api/newsletter/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    const data = await result.json()
    if (!result.ok || result.status !== 200) {
      setStatus("error")
      setMessage(data.error || "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.")
      return
    }

    setStatus("success")
    setMessage("Vielen Dank! Du wirst schnellst möglichst benachrichtigt.")
    setEmail("")
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          id="email"
          type="email"
          placeholder="E-Mail Adresse eingeben"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full placeholder-gray-400 rounded-full py-6"
          disabled={status === "loading" || status === "success"}
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-[5px] rounded-full h-10 w-10"
          disabled={status === "loading" || status === "success"}
          aria-label="Submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
            <AlertCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}
