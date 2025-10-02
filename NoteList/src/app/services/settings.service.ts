import { Injectable } from '@angular/core';

export interface AppSettings {
  // Display Settings
  showActiveFilters: boolean;
  
  // UI Customization
  font: 
  | 'Lato' 
  | 'Open Sans' 
  | 'Roboto' 
  | 'SUSE Mono' 
  | 'Playfair Display'
  | 'Montserrat'
  | 'Merriweather'
  | 'Fira Code'
  | 'Pacifico'
  | 'Bebas Neue'
  | 'Crimson Pro'
  | 'Indie Flower'
  | 'Ubuntu';
  theme: 'light' | 'dark' | 'nature' | 'pastel' | 'moon' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  
  // Advanced Settings
  keyboardShortcuts: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  showActiveFilters: true,
  font: 'Lato',
  theme: 'light',
  keyboardShortcuts: true
};

export const THEME_COLORS = {
  light: {
    primary: '#1976D2',
    secondary: '#FFC107',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121'
  },
  dark: {
    primary: '#90CAF9',
    secondary: '#ffc71d',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#E0E0E0'
  },
  nature: {
    primary: '#2E7D32',
    secondary: '#FFB300',
    background: '#F1F8E9',
    surface: '#DCEDC8',
    text: '#33691E'
  },
  pastel: {
    primary: '#F48FB1',
    secondary: '#81D4FA',
    background: '#FFF8E1',
    surface: '#FFE0B2',
    text: '#6D4C41'
  },
  moon: {
    primary: '#FF00FF',
    secondary: '#db8adbff',
    background: '#0D0D0D',
    surface: '#1A1A1A',
    text: '#E6E6E6'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: AppSettings = DEFAULT_SETTINGS;
  private readonly STORAGE_KEY = 'noteList_settings';

  loadSettings(): AppSettings {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
      this.applySettings();
      return this.settings;
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: AppSettings): void {
    try {
      // Log non-theme settings changes
      this.logSettingChanges(settings);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      this.settings = settings;
      this.applySettings();
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
      throw error;
    }
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  private logSettingChanges(newSettings: AppSettings): void {
    const oldSettings = this.settings;
    
    // Display Settings
    if (oldSettings.showActiveFilters !== newSettings.showActiveFilters) {
      console.log('Display Setting - Show Active Filters:', newSettings.showActiveFilters ? 'ON' : 'OFF');
    }
    
    // UI Customization (non-theme)
    if (oldSettings.font !== newSettings.font) {
      console.log('UI Setting - Font changed to:', newSettings.font);
    }
    
    // Advanced Settings
    if (oldSettings.keyboardShortcuts !== newSettings.keyboardShortcuts) {
      console.log('Advanced Setting - Keyboard shortcuts:', newSettings.keyboardShortcuts ? 'ENABLED' : 'DISABLED');
    }
  }

  private applySettings(): void {
    // Apply font
    document.documentElement.style.setProperty('--app-font', this.getFontFamily());
    
    // Apply theme colors
    const colors = this.settings.theme === 'custom' && this.settings.customColors 
      ? this.settings.customColors 
      : THEME_COLORS[this.settings.theme as keyof typeof THEME_COLORS] || THEME_COLORS.light;
    
    // Apply to document root for global access
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply to body for immediate effect
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    document.body.style.fontFamily = this.getFontFamily();
    
    // Apply theme class to body for additional styling
    document.body.className = `theme-${this.settings.theme}`;
    
    console.log('Theme applied globally:', this.settings.theme);
  }

  private getFontFamily(): string {
    switch (this.settings.font) {
        case 'Open Sans': return '"Open Sans", sans-serif';
        case 'Roboto': return '"Roboto", sans-serif';
        case 'SUSE Mono': return '"SUSE Mono", monospace';
        case 'Playfair Display': return '"Playfair Display", serif';
        case 'Montserrat': return '"Montserrat", sans-serif';
        case 'Merriweather': return '"Merriweather", serif';
        case 'Fira Code': return '"Fira Code", monospace';
        case 'Pacifico': return '"Pacifico", cursive';
        case 'Bebas Neue': return '"Bebas Neue", sans-serif';
        case 'Crimson Pro': return '"Crimson Pro", serif';
        case 'Indie Flower': return '"Indie Flower", cursive';
        case 'Ubuntu': return '"Ubuntu", sans-serif';  
        default: return '"Lato", sans-serif';
    }
  }

  // Method to trigger import/export actions
  importData(): void {
    console.log('Advanced Setting - Import Data triggered');
    // TODO: Implement import functionality
  }

  exportData(): void {
    console.log('Advanced Setting - Export Data triggered');
    // TODO: Implement export functionality
  }
}
