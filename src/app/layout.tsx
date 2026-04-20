import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyUp — AI-Powered Study Platform",
  description: "Organize courses, generate AI study plans, track progress, and ace your classes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="h-full">{children}</body>
    </html>
  );
}
