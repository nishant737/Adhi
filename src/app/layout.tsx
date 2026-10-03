import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aadhi Consulting Services | Job Placement & HR Consultancy in Mangalore",
  description:
    "Job placement consultancy in Moodbidri, Mangalore. Jobs in India and abroad, HR services for employers, training, career guidance and visa application support.",
  keywords: [
    "job placement consultancy Mangalore",
    "overseas job consultancy Mangalore",
    "jobs abroad from India",
    "HR services Mangalore",
    "recruitment agency Moodbidri",
    "career guidance Mangalore",
    "visa application assistance",
    "Aadhi Consulting Services",
  ],
  openGraph: {
    title: "Aadhi Consulting Services | Job Placement in India & Abroad",
    description:
      "Job placement, HR services, training, career guidance and visa application support from Moodbidri, Mangalore.",
    type: "website",
    locale: "en_IN",
    siteName: "Aadhi Consulting Services",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
