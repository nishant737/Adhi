import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aadhi Consulting Services — Nursing Careers in Germany",
  description:
    "Mangaluru-based consultancy that trains Indian nurses in German and guides them to hospital jobs in Germany — language training, recognition, interviews, visa and relocation.",
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
