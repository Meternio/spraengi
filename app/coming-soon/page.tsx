import Image from "next/image"
import CountdownTimer from "@/components/countdown-timer"
import NewsletterSignup from "@/components/NewsletterSignup"
import SocialLinks from "@/components/social-links"

export default function Home() {
  const openingDate = new Date('2025-06-01T00:00:00')
  openingDate.setMonth(openingDate.getMonth())

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="w-full max-w-md mb-12">
          <Image
            src="/images/spraengi_logo_black_no-background.png"
            alt="SPRÄNGI BAR & CAFE Logo"
            width={648}
            height={316}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Coming Soon Text */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Wir öffnen bald unsere Türen</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12 text-center max-w-2xl">
          Die neue Bar Sprängi wird bald ein Ort für Genuss, Geselligkeit und unvergessliche Momente sein. Bleibe
          auf dem Laufenden!
        </p>

        {/* Countdown Timer */}
        <div className="mb-12 w-full">
          <CountdownTimer targetDate={openingDate} />
        </div>

        {/* Newsletter Signup */}
        <div className="mb-12 w-full flex justify-center">
          <NewsletterSignup />
        </div>

        {/* Location Info */}
        <div className="mb-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Besuche uns bald</h2>
          <p className="text-gray-300">Schmittenbachstrasse 2, 8497 Fischenthal</p>
          <p className="text-gray-300">Öffnungszeiten: Folgen noch!</p>
        </div>

        {/* Social Media Links */}
        <SocialLinks />

        {/* Footer */}
        <footer className="mt-16 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SPRÄNGI BAR & CAFE. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
    </main>
  )
}
