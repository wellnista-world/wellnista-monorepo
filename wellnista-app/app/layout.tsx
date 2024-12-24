import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="p-4 bg-blue-500 text-white">
          <h1 className="text-xl font-bold text-center">Wellnista</h1>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
