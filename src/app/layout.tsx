import type { Metadata } from "next";
import { Cinzel, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Algorithm of the Future — Pawel Kozycz | Solson Publications",
  description:
    "Algorithm of the Future: Algorithm for Acquiring Properties of Matter and Life Processes. A bold neo-evolutionary manifesto by Pawel Kozycz proposing that humanity can consciously redesign the cosmos. EvmDNA < Eskm1DAA.",
  keywords: [
    "Algorithm of the Future",
    "Pawel Kozycz",
    "neo-evolution",
    "futurism",
    "cosmic administration",
    "Dynamic Active Administration",
    "DAA",
    "moonbots",
    "Solson Publications",
    "philosophy of science",
    "Eskm1DAA",
    "Selective Economy",
  ],
  authors: [{ name: "Pawel Kozycz" }],
  creator: "Pawel Kozycz",
  publisher: "Solson Publications",
  openGraph: {
    title: "Algorithm of the Future — Pawel Kozycz",
    description:
      "A bold neo-evolutionary manifesto. From smartphone-controlled moonbots to the total administration of life and the cosmos. The central equation: EvmDNA < Eskm1DAA.",
    siteName: "Algorithm of the Future",
    type: "book",
    locale: "en_US",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1344,
        height: 768,
        alt: "Algorithm of the Future by Pawel Kozycz — a neo-evolutionary manifesto. Available on Amazon.",
      },
      {
        url: "/images/book-cover.jpg",
        width: 1200,
        height: 1600,
        alt: "Algorithm of the Future by Pawel Kozycz — book cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Algorithm of the Future — Pawel Kozycz",
    description:
      "A bold neo-evolutionary manifesto. From moonbots to the total administration of the cosmos. EvmDNA < Eskm1DAA.",
    images: ["/images/og-banner.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org structured data for richer search results (Book + Person).
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Algorithm of the Future: Algorithm for Acquiring Properties of Matter and Life Processes",
    author: {
      "@type": "Person",
      name: "Pawel Kozycz",
      nationality: "Poland",
      homeLocation: "Denmark",
      url: "https://moonnowcom.wordpress.com",
      jobTitle: "Neo-Evolutionary Philosopher",
    },
    publisher: {
      "@type": "Organization",
      name: "Solson Publications",
    },
    datePublished: "2026",
    isbn: "978-82-59738-55-4",
    numberOfPages: 246,
    bookFormat: "https://schema.org/Paperback",
    inLanguage: ["en", "pl", "de", "es"],
    genre: ["Futurism", "Neo-Evolutionary Philosophy", "Science", "Economics", "Technology"],
    description:
      "A bold neo-evolutionary manifesto proposing that humanity can consciously redesign the cosmos. Central equation: EvmDNA < Eskm1DAA. From smartphone-controlled moonbots to the total administration of life and the cosmos.",
    offers: {
      "@type": "Offer",
      url: "https://www.amazon.com/dp/B0GY9JKG1Q",
      availability: "https://schema.org/InStock",
    },
    thumbnailUrl: "https://algorithmofthefuture.com/images/book-cover.jpg",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
        />
        {/* Apply saved theme before paint to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('aotf:theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${cinzel.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-cosmos text-stardust overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
