import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "homERP - Home Finance Manager",
  description: "Manage your home finances with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}