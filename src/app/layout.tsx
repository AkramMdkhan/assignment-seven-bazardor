import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import ToasterProvider from "@/components/ToasterProvider";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${notoSerifBengali.className} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-green-50">
        <ToasterProvider />

        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar />
          <PriceTicker />
        </div>

        <div className="flex-1">{children}</div>

        <Footer />
      </body>
    </html>
  );
}