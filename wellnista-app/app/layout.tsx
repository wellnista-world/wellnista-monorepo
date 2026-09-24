"use client";
import "./globals.css";
import { useLiff } from "./lib/api/use-liff";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './lib/context/AuthContext';
import AddToHomeScreen from './components/AddToHomeScreen';
import { I18nProvider } from '../i18n';
import { CartProvider } from './lib/context/CartContext';
import { CoinProvider } from './lib/context/CoinContext';
import TabBar from './components/TabBar';
import CoinDisplay from './components/CoinDisplay';
import { getAppName } from '../config/app';

//import { Kanit } from "next/font/google";
//import { Leckerli_One } from "next/font/google";

//const kanit = Kanit({
  //subsets: ["thai"],
  //weight: ["300", "400", "500", "700"],
  //display: "swap",
//});

//export const leckerli = Leckerli_One({
  //subsets: ["latin"],
  //weight: "400",
  //display: "swap",
//});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLiffReady, error } = useLiff();
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = pathname !== "/" && pathname !== "/home";
  const hideHeader = pathname.startsWith('/product/');

  if (!isLiffReady) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="theme-color" content="#0a0e0b" />
          <meta name="description" content="Wellnista AI - your personal nutrition assistant" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-QTTCWH3PP4"
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-QTTCWH3PP4');
              `,
            }}
          />
        </head>
        <body>
          <div className="flex items-center justify-center min-h-screen bg-secondary text-neutral font-kanit">
            <div className="text-center">
              <div className="loading primary mb-4" />
              <p>Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (error) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="theme-color" content="#0a0e0b" />
          <meta name="description" content="Wellnista AI - your personal nutrition assistant" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-QTTCWH3PP4"
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-QTTCWH3PP4');
              `,
            }}
          />
        </head>
        <body>
          <div className="flex items-center justify-center min-h-screen bg-secondary text-red-600 font-kanit text-lg">
            <p className="text-center">{error}</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0a0e0b" />
        <meta name="description" content="Wellnista AI - your personal nutrition assistant" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QTTCWH3PP4"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QTTCWH3PP4');
            `,
          }}
        />
      </head>
      <body className="bg-bg text-ink">
        <I18nProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <CartProvider>
                <CoinProvider>
                  {!hideHeader && (
                    <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-md">
                      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
                        {/* Left side - Back button or spacer */}
                        <div className="flex w-20 items-center">
                          {showBackButton && (
                            <button
                              onClick={() => {
                                if (pathname === '/product' || pathname.startsWith('/product/')) {
                                  router.push('/home');
                                } else {
                                  window.history.back();
                                }
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink ring-1 ring-line"
                              aria-label="Back"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Center - Brand wordmark */}
                        <button
                          onClick={() => router.push('/home')}
                          className="text-lg font-semibold tracking-tight text-ink"
                          aria-label={getAppName()}
                        >
                          Wellnista <span className="wa-gradient-text">AI</span>
                        </button>

                        {/* Right side - Coin display */}
                        <div className="flex w-20 items-center justify-end">
                          <CoinDisplay className="wa-chip py-1" />
                        </div>
                      </div>
                    </header>
                  )}
                  <main className={`${!hideHeader ? "px-4 py-5" : ""}`}>{children}</main>
                  <AddToHomeScreen />
                  <TabBar />
                </CoinProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
