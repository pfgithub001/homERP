import type { Metadata } from "next";
import "./globals.scss";
import { ClientLayout } from "./ClientLayout";

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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}