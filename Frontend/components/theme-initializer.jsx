'use client'

import { useEffect } from 'react'
import { applyTheme, getSelectedTheme, getCustomBackground } from '@/lib/theme-manager'

export default function ThemeInitializer() {
  useEffect(() => {
    // Apply saved theme on mount
    const savedTheme = getSelectedTheme()
    applyTheme(savedTheme)

    // Apply custom background if exists
    const customBg = getCustomBackground()
    if (customBg) {
      document.documentElement.style.backgroundImage = `url('${customBg}')`
      document.documentElement.style.backgroundSize = 'cover'
      document.documentElement.style.backgroundPosition = 'center'
      document.documentElement.style.backgroundAttachment = 'fixed'
    }
  }, [])

  return null
}
