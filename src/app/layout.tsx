import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "The Phorum — Photonics Community",
  description:
    "A community for photonics engineers, scientists, and researchers to share questions, findings, and discussions about optics, lasers, and light-based technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <UserProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
