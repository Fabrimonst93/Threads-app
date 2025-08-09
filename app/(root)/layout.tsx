import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "@/components/shared/TopBar";
import LeftsideBar from "@/components/shared/LeftsideBar";
import RightsideBar from "@/components/shared/RightsideBar";
import BottomBar from "@/components/shared/BottomBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Threads',
  description: 'Una aplicacion creada con Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <TopBar/>
            <main className="flex">
              <LeftsideBar />
              <section className="main-container">
                <div className="w-full max-w-4x1">
                  {children}
                </div>
              </section>
              <RightsideBar />
            </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
