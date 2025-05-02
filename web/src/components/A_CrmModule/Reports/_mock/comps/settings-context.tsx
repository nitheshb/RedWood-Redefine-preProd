import { createContext, useContext } from 'react'

//

// ----------------------------------------------------------------------

export const SettingsContext = createContext({} as SettingsContextProps)

export const useSettingsContext = () => {
  const context = useContext(SettingsContext)

  if (!context)
    throw new Error('useSettingsContext must be use inside SettingsProvider')

  return context
}

// ----------------------------------------------------------------------

export type SettingsValueProps = {
  themeStretch: boolean
  themeMode: 'light' | 'dark'
  themeDirection: 'rtl' | 'ltr'
  themeContrast: 'default' | 'bold'
  themeLayout: 'vertical' | 'horizontal' | 'mini'
  themeColorPresets: 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
}

export type SettingsContextProps = SettingsValueProps & {
  // Update
  onUpdate: (name: string, value: string | boolean) => void
  // Direction by lang
  onChangeDirectionByLang: (lang: string) => void
  // Reset
  canReset: boolean
  onReset: VoidFunction
  // Drawer
  open: boolean
  onToggle: VoidFunction
  onClose: VoidFunction
}
