import type { Metadata } from "next";
import { Noto_Sans_Tamil } from "next/font/google";
import { Providers } from "@/providers";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CIVICFLOW v0.9",
  description: "AI-powered civic grievance resolution platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className={`${notoSansTamil.className} antialiased text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
