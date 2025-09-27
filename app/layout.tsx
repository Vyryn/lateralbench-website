import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "LateralBench",
  description: "Multi-turn lateral thinking questions"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient min-h-screen">{children}</body>
    </html>
  );
}