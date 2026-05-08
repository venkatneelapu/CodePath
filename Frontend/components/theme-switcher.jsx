'use client'

import { useState, useEffect } from 'react'
import { themes, applyTheme, getSelectedTheme } from '@/lib/theme-manager'
import { Button } from '@/components/ui/button'

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('dracula')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedTheme = getSelectedTheme()
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: themes[currentTheme].keyword }}
        ></div>
        Theme
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-3 w-48">
          <p className="text-sm font-semibold mb-3">Select Theme</p>
          <div className="space-y-2">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`w-full text-left p-3 rounded border-2 transition-all flex items-center gap-3 ${
                  currentTheme === key ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                style={{ backgroundColor: `${theme.background}20` }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: theme.keyword }}></div>
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: theme.string }}></div>
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: theme.function }}></div>
                </div>
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
