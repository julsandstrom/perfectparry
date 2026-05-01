import type { Metadata } from "next";

import { Girassol } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const neohellenic = localFont({
  src: [
    {
      path: "../public/fonts/GFS_Neohellenic/GFSNeohellenic-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GFS_Neohellenic/GFSNeohellenic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neohellenic",
  preload: false,
  display: "swap",
});

const girassol = Girassol({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-girassol",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Perfect Parry",
  description: "A timing based combat game",
  icons: {
    icon: "/favicon.ico",
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
      className={`${girassol.variable} ${neohellenic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
