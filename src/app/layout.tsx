import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aadhi Consulting Services — Overseas Job Placement",
  description:
    "Mangaluru-based job placement consultancy helping people from India find jobs abroad — with visa and emigration support, plus German training and placement for Germany.",
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
