import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Apply theme class to body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme'
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const value = {
    isDarkMode,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider