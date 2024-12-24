"use client";
import "./globals.css";
import { useLiff } from "./lib/api/use-liff";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLiffReady, error, isInLineApp } = useLiff();

  if (!isLiffReady) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen">Loading...</div>
        </body>
      </html>
    );
  }

  if (error) {
    return (
      <html lang="en">
        <body>
          <div className="text-red-500 text-center">{error}</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="p-4 bg-blue-500 text-white">
          <h1 className="text-xl font-bold text-center">Wellnista</h1>
          {isInLineApp && <p className="text-sm text-center">Running inside LINE</p>}
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
