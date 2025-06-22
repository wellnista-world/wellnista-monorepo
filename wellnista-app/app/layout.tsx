"use client";
import "./globals.css";
import { useLiff } from "./lib/api/use-liff";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HamburgerMenu from './components/HamburgerMenu';
import { AuthProvider } from './lib/context/AuthContext';
import AddToHomeScreen from './components/AddToHomeScreen';
import { I18nProvider } from '../i18n';

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
  const { isLiffReady, error, isInLineApp } = useLiff();
  const pathname = usePathname();
  const showBackButton = pathname !== "/" && pathname !== "/home";

  if (!isLiffReady) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="theme-color" content="#9F9260" />
          <meta name="description" content="Your personal nutrition assistant" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <link rel="icon" href="/icons/icon-192x192.png" />
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
          <meta name="theme-color" content="#9F9260" />
          <meta name="description" content="Your personal nutrition assistant" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <link rel="icon" href="/icons/icon-192x192.png" />
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
        <meta name="theme-color" content="#9F9260" />
        <meta name="description" content="Your personal nutrition assistant" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
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
      <body className="bg-secondary text-neutral">
        <I18nProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <header className="p-4 bg-accent text-secondary relative">
                {showBackButton && (
                  <button
                    onClick={() => window.history.back()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-primary/80 text-accent hover:text-white shadow z-10"
                    aria-label="Back"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-leckerli text-center flex-1">Wellnista</h1>
                  <div className="ml-auto w-8">
                    <HamburgerMenu />
                  </div>
                </div>
                {isInLineApp && (
                  <p className="text-sm text-accent text-center">Running inside LINE</p>
                )}
              </header>
              <main className="p-4">{children}</main>
              <AddToHomeScreen />
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
