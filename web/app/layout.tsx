import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/auth-provider";
import SocketProvider from "@/providers/socket-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import MarketingProvider from "@/providers/marketing-provider";

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Modern E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <QueryProvider>
            <MarketingProvider>
              <AuthProvider>
                <SocketProvider>
                  <Toaster position="top-right" reverseOrder={false} />
                  {children}
                </SocketProvider>
              </AuthProvider>
            </MarketingProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
    </html>
  );
}
