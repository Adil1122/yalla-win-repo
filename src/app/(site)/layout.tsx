'use client';
import type { Metadata } from "next"
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <section className="flex flex-col h-full">
         <header className="w-full px-4 lg:px-12 lg-mid:px-20 lg-py-2 lg-mid:py-4 py-2 bg-white">
            <Header />
         </header>
         <main className="flex flex-grow">{children}</main>
         <footer className="w-full w-full px-12 lg:px-20 lg:py-16 py-4 bg-white">
            <Footer />
         </footer>
      </section>
  )
}
