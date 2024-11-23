import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "lib/components/header/header";
import "../../public/styles/components.css";
import PageFooter from "lib/components/footer/footer";
import { CartProvider } from "lib/context/cartContext";
import SessionProviderClient from "lib/context/userContex";
import FullPageLoader from "lib/components/fullPageLoader/fullPageLoader";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  favicon: '/favicon.ico',
  appleTouchIcon: '/favicon.ico',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'default',
  appleMobileWebAppTitle: 'Stopak Ambalaža',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderClient>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <FullPageLoader />
            <Header />
            {children}
            <PageFooter />
          </body>
        </html>
      </CartProvider>
    </SessionProviderClient>
  );
}
