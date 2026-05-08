import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ThemeInitializer from '@/components/theme-initializer'
import FloatingChatbot from '@/components/floating-chatbot'

export const metadata: Metadata = {
  title: "CodePath",
  description: "CodePath - Your AI Learning Companion",
  generator: "CodePath",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeInitializer />
          <FloatingChatbot />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
