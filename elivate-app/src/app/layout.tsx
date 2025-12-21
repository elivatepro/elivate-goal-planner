import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elivate Goal Planner",
  description: "Plan your yearly and monthly goals for the Elivate Network.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-arp="true" suppressHydrationWarning>
      <body className={`${lexend.variable} antialiased bg-page text-ink`}>
        {children}
      </body>
    </html>
  );
}
