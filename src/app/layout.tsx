import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EventHub - Experiences that stick",
    template: "%s | EventHub",
  },
  description: "Connect with people for events and activities. Join or host events in your area.",
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/logo-eventhub.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo-eventhub.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/logo-eventhub.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: "EventHub - Experiences that stick",
    description: "Connect with people for events and activities.",
    siteName: "EventHub",
    images: [
      {
        url: "/logo-eventhub.svg",
        width: 800,
        height: 600,
        alt: "EventHub Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { zIndex: 12000, marginTop: '48px' },
            }}
            containerStyle={{ zIndex: 12000, marginTop: 48 }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
