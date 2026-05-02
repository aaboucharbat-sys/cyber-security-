import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="ar" className="h-full antialiased">
      <body 
        style={{ fontFamily: "'Roboto Mono', monospace" }} 
        className="min-h-full flex flex-col bg-black text-white"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}