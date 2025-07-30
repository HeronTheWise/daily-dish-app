
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Header } from '@/components/food-app/header';
import '@/lib/firebase';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Daily Dish',
  description: 'Your daily food suggestion.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#F97316" />
      </head>
      <body className={cn("font-sans antialiased")}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col bg-muted/20">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
