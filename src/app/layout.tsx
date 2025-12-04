import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Events & Activities Platform",
  description: "Connect with people for events and activities",
  icons: {
    icon: '/logo-eventhub.svg',
    shortcut: '/logo-eventhub.svg',
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
              style: { zIndex: 12000, marginTop: '60px' },
            }}
            containerStyle={{ zIndex: 12000, marginTop: 60 }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
