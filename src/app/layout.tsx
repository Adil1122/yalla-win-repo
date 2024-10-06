'use client'

import "./globals.css"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { AuthProvider } from '@/components/AuthContext'

export default function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   return (
     <html lang="en">
         <head>
            <title>Yalla Draw</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
         </head>
         <body className="relative min-h-screen"><AuthProvider>
          {children}
        </AuthProvider></body>
     </html>
   );
 }