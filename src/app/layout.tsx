import "./globals.css"                    // ✅ IMPORTANTE: garante tokens no bundle
import type { ReactNode } from "react"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { CharacterProvider } from "@/contexts/CharacterContext"
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Inicializa o accent antes de hidratar para evitar flash */}
        <Script id="accent-init" strategy="beforeInteractive">
          {`try {
            var a = localStorage.getItem('accent') || 'default';
            document.documentElement.setAttribute('data-accent', a);
          } catch (e) {}`}
        </Script>
      </head>
      <body>
        <Providers>
          <CharacterProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </CharacterProvider>
        </Providers>
      </body>
    </html>
  )
}