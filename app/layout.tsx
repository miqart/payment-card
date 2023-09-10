import "./globals.css";

import type { Metadata } from "next";
import { Rubik } from "next/font/google";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Payment",
  description: "Add a card to make your payment!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${rubik.className} flexCenter bg-zinc-100`}>{children}</body>
    </html>
  );
}
