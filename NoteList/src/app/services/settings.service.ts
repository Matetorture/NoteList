import { Injectable } from '@angular/core';

export interface FontOption {
  name: string;
  fontFamily: string;
  cssClass: string;
}

export interface AppSettings {
  showActiveFilters: boolean;
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
  keyboardShortcuts: boolean;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { name: 'Lato', fontFamily: "'Lato', sans-serif", cssClass: 'font-option-lato' },
  { name: 'Open Sans', fontFamily: "'Open Sans', sans-serif", cssClass: 'font-option-open-sans' },
  { name: 'Roboto', fontFamily: "'Roboto', sans-serif", cssClass: 'font-option-roboto' },
  { name: 'SUSE Mono', fontFamily: "'SUSE Mono', monospace", cssClass: 'font-option-suse-mono' },
  { name: 'Playfair Display', fontFamily: "'Playfair Display', serif", cssClass: 'font-option-playfair-display' },
  { name: 'Montserrat', fontFamily: "'Montserrat', sans-serif", cssClass: 'font-option-montserrat' },
  { name: 'Merriweather', fontFamily: "'Merriweather', serif", cssClass: 'font-option-merriweather' },
  { name: 'Fira Code', fontFamily: "'Fira Code', monospace", cssClass: 'font-option-fira-code' },
  { name: 'Pacifico', fontFamily: "'Pacifico', cursive", cssClass: 'font-option-pacifico' },
  { name: 'Bebas Neue', fontFamily: "'Bebas Neue', sans-serif", cssClass: 'font-option-bebas-neue' },
  { name: 'Crimson Pro', fontFamily: "'Crimson Pro', serif", cssClass: 'font-option-crimson-pro' },
  { name: 'Indie Flower', fontFamily: "'Indie Flower', cursive", cssClass: 'font-option-indie-flower' },
  { name: 'Ubuntu', fontFamily: "'Ubuntu', sans-serif", cssClass: 'font-option-ubuntu' }
];

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
    
    if (oldSettings.showActiveFilters !== newSettings.showActiveFilters) {
      console.log('Display Setting - Show Active Filters:', newSettings.showActiveFilters ? 'ON' : 'OFF');
    }
    
    if (oldSettings.font !== newSettings.font) {
      console.log('UI Setting - Font changed to:', newSettings.font);
    }
    
    if (oldSettings.keyboardShortcuts !== newSettings.keyboardShortcuts) {
      console.log('Advanced Setting - Keyboard shortcuts:', newSettings.keyboardShortcuts ? 'ENABLED' : 'DISABLED');
    }
  }

  private applySettings(): void {
    document.documentElement.style.setProperty('--app-font', this.getFontFamily());
    
    const colors = this.settings.theme === 'custom' && this.settings.customColors 
      ? this.settings.customColors 
      : THEME_COLORS[this.settings.theme as keyof typeof THEME_COLORS] || THEME_COLORS.light;
    
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    document.body.style.fontFamily = this.getFontFamily();
    
    document.body.className = `theme-${this.settings.theme}`;
    
    this.updateSvgFilter(colors.text);
    
    console.log('Theme applied globally:', this.settings.theme);
  }

  private getFontFamily(): string {
    const fontOption = this.getFontOption(this.settings.font);
    return fontOption ? fontOption.fontFamily : '"Lato", sans-serif';
  }

  private updateSvgFilter(textColor: string): void {
    const brightness = this.getColorBrightness(textColor);
    const invertValue = brightness > 128 ? 90 : 10;
    const svgFilter = `brightness(0) saturate(100%) invert(${invertValue}%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1) contrast(100%)`;
    document.documentElement.style.setProperty('--svg-filter', svgFilter);
    console.log(`SVG filter calculated: text brightness ${brightness}, invert ${invertValue}% (matching text color)`);
  }

  getAvailableFonts(): FontOption[] {
    return AVAILABLE_FONTS;
  }

  getFontOption(fontName: string): FontOption | undefined {
    return AVAILABLE_FONTS.find(font => font.name === fontName);
  }

  private getColorBrightness(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }
}
