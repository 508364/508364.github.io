import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'light',
    customColors: {
      primary: '#409EFF',
      secondary: '#67C23A',
      accent: '#E6A23C'
    }
  }),
  actions: {
    setTheme(themeName) {
      this.currentTheme = themeName
      document.documentElement.setAttribute('data-theme', themeName)
    },
    setCustomColors(colors) {
      this.customColors = colors
      this.updateCustomTheme()
    },
    updateCustomTheme() {
      const root = document.documentElement
      root.style.setProperty('--primary-color', this.customColors.primary)
      root.style.setProperty('--secondary-color', this.customColors.secondary)
      root.style.setProperty('--accent-color', this.customColors.accent)
    }
  }
})