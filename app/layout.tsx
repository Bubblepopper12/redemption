import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Redemption: Free help in Austin",
    template: "%s · Redemption",
  },
  description:
    "Every person has worth. Find free food, shelter, showers, ID help, phones, churches, and more in Austin, Texas. Private and free.",
  icons: { icon: "/icon.svg" },
  // Nothing on this site should be tracked or indexed by ad networks.
  other: { referrer: "no-referrer" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
