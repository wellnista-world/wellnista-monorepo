"use client";
import "./globals.css";
import { useLiff } from "./lib/api/use-liff";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLiffReady, error, isInLineApp } = useLiff();

  if (!isLiffReady) {
    return (
      <html lang="en">
        <head>
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
          <div className="flex items-center justify-center min-h-screen bg-secondary text-neutral font-garet">
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
          <div className="flex items-center justify-center min-h-screen bg-secondary text-red-600 font-garet text-lg">
            <p className="text-center">{error}</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
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
      <body className="bg-secondary text-neutral font-garet">
        <header className="p-4 bg-accent text-secondary">
          <h1 className="text-2xl font-magnolia text-center">Wellnista</h1>
          {isInLineApp && (
            <p className="text-sm text-accent text-center">Running inside LINE</p>
          )}
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
