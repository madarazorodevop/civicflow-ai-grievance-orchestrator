import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CIVICFLOW",
  description: "AI-powered civic grievance resolution platform",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-gray-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
