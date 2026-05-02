import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

// تم حذف استيراد Geist المسبب للمشاكل

export const metadata: Metadata = {
  title: "Cyber-Matrix | Advanced Cybersecurity Defense",
  description: "Secure sign-in, quiz access, and leaderboard management for @estin users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body style={{ fontFamily: "'Roboto Mono', monospace" }} className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}