import type { Metadata } from "next";
import { Inter, Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/providers/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pinaki Labs | Premium Futuristic Digital & AI Agency",
  description: "Pinaki Labs is a high-end creative agency specializing in Next-Gen Web Development, AI/ML Solutions, custom Automation, and Awwwards-level UI/UX designs that grow businesses.",
  keywords: "Web Development, AI Solutions, Machine Learning, Automation, UI/UX Design, Next.js, Premium Agency, Freelance Development",
  authors: [{ name: "Pinaki Labs" }],
  openGraph: {
    title: "Pinaki Labs | Premium Futuristic Digital & AI Agency",
    description: "We build digital experiences that grow businesses. Next-Gen Web Dev, AI/ML Solutions, Automation, and Awwwards-level Design.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinaki Labs | Premium Futuristic Digital & AI Agency",
    description: "We build digital experiences that grow businesses. Next-Gen Web Dev, AI/ML Solutions, Automation, and Awwwards-level Design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} dark scroll-smooth`}
    >
      <body className="overflow-x-hidden bg-canvas font-sans text-ink antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
