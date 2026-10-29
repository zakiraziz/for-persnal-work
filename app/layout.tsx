import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoobiToon AI Studio | Creator Dashboard",
  description:
    "A calm, organized home for your YouTube creator workflow. Live channel data will be available when you connect your channel.",
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
