import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Redemption: Free help in Texas",
    template: "%s · Redemption",
  },
  description:
    "Every person has worth. Find free food, shelter, showers, ID help, phones, churches, clinics, jobs, and more across Texas. Private and free.",
  icons: { icon: "/icon.svg" },
  // Other sites only ever see our site's address (never the page), which
  // OpenStreetMap needs in order to serve map pictures.
  referrer: "strict-origin-when-cross-origin",
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
            <noscript>
              <div className="mx-auto max-w-4xl px-4 pt-6">
                <p className="rounded-2xl border-2 border-sun bg-dawn p-4 text-lg">
                  This page needs JavaScript to search. You can still see every place on the <a href="/map/">Map page</a>, or call{" "}
                  <a href="tel:211">2-1-1</a> for free help any time.
                </p>
              </div>
            </noscript>
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
