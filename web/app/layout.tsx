import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/auth-provider";
import SocketProvider from "@/providers/socket-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import MarketingProvider from "@/providers/marketing-provider";
import { Suspense } from "react";
import Loader from "@/components/common/Loader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Premium E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider>
          <QueryProvider>
            <Suspense
              fallback={
                <div>
                  <Loader />
                </div>
              }
            >
              <MarketingProvider>
                <AuthProvider>
                  <SocketProvider>
                    <Toaster position="top-right" reverseOrder={false} />
                    {children}
                  </SocketProvider>
                </AuthProvider>
              </MarketingProvider>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
    </html>
  );
}
