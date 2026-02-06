import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'
import { AuthBootstrap } from '@/components/auth/AuthBootstrap'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HeartMatch - Premium Dating',
  description: 'Premium dating app for meaningful connections',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <LanguageProvider>
          <AuthBootstrap />
          <NotificationProvider />
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
