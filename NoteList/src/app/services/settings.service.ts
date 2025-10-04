import { Injectable } from '@angular/core';

export interface FontOption {
  name: string;
  fontFamily: string;
  cssClass: string;
}

export interface ThemeOption {
  key: string;
  name: string;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface AppSettings {
  showActiveFilters: boolean;
  font: 
  | 'Lato' 
  | 'Open Sans' 
  | 'Roboto' 
  | 'Ubuntu'
  | 'Bebas Neue'
  | 'Oswald'
  | 'Crimson Pro'
  | 'Playfair Display'
  | 'Libre Baskerville'
  | 'Roboto Slab'
  | 'Zilla Slab'
  | 'Source Code Pro'
  | 'Fira Code'
  | 'JetBrains Mono'
  | 'Pacifico'
  | 'Dancing Script'
  | 'Indie Flower'
  | 'Kalam'
  | 'Caveat'
  | 'Cinzel'
  | 'Uncial Antiqua'
  | 'Almendra'
  | 'Creepster'
  | 'Griffy'
  | 'Smokum'
  | 'Special Elite'
  | 'Fredericka the Great';
  theme: 'light' | 'dark' | 'nature' | 'pastel' | 'moon' | 'ocean' | 'sunset' | 'forest' | 'purple' | 'cyberpunk' | 'autumn' | 'winter' | 'galaxy' | 'neon' | 'cherry' | 'matrix' | 'desert' | 'arctic' | 'volcano' | 'mint' | 'custom';
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
  { name: 'Ubuntu', fontFamily: "'Ubuntu', sans-serif", cssClass: 'font-option-ubuntu' },
  { name: 'Bebas Neue', fontFamily: "'Bebas Neue', sans-serif", cssClass: 'font-option-bebas-neue' },
  { name: 'Oswald', fontFamily: "'Oswald', sans-serif", cssClass: 'font-option-oswald' },
  { name: 'Crimson Pro', fontFamily: "'Crimson Pro', serif", cssClass: 'font-option-crimson-pro' },
  { name: 'Playfair Display', fontFamily: "'Playfair Display', serif", cssClass: 'font-option-playfair-display' },
  { name: 'Libre Baskerville', fontFamily: "'Libre Baskerville', serif", cssClass: 'font-option-libre-baskerville' },
  { name: 'Roboto Slab', fontFamily: "'Roboto Slab', serif", cssClass: 'font-option-roboto-slab' },
  { name: 'Zilla Slab', fontFamily: "'Zilla Slab', serif", cssClass: 'font-option-zilla-slab' },
  { name: 'Source Code Pro', fontFamily: "'Source Code Pro', monospace", cssClass: 'font-option-source-code-pro' },
  { name: 'Fira Code', fontFamily: "'Fira Code', monospace", cssClass: 'font-option-fira-code' },
  { name: 'JetBrains Mono', fontFamily: "'JetBrains Mono', monospace", cssClass: 'font-option-jetbrains-mono' },
  { name: 'Pacifico', fontFamily: "'Pacifico', cursive", cssClass: 'font-option-pacifico' },
  { name: 'Dancing Script', fontFamily: "'Dancing Script', cursive", cssClass: 'font-option-dancing-script' },
  { name: 'Indie Flower', fontFamily: "'Indie Flower', cursive", cssClass: 'font-option-indie-flower' },
  { name: 'Kalam', fontFamily: "'Kalam', cursive", cssClass: 'font-option-kalam' },
  { name: 'Caveat', fontFamily: "'Caveat', cursive", cssClass: 'font-option-caveat' },
  { name: 'Cinzel', fontFamily: "'Cinzel', serif", cssClass: 'font-option-cinzel' },
  { name: 'Uncial Antiqua', fontFamily: "'Uncial Antiqua', cursive", cssClass: 'font-option-uncial-antiqua' },
  { name: 'Almendra', fontFamily: "'Almendra', serif", cssClass: 'font-option-almendra' },
  { name: 'Creepster', fontFamily: "'Creepster', cursive", cssClass: 'font-option-creepster' },
  { name: 'Griffy', fontFamily: "'Griffy', cursive", cssClass: 'font-option-griffy' },
  { name: 'Smokum', fontFamily: "'Smokum', cursive", cssClass: 'font-option-smokum' },
  { name: 'Special Elite', fontFamily: "'Special Elite', cursive", cssClass: 'font-option-special-elite' },
  { name: 'Fredericka the Great', fontFamily: "'Fredericka the Great', cursive", cssClass: 'font-option-fredericka' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  showActiveFilters: true,
  font: 'Lato',
  theme: 'dark',
  keyboardShortcuts: true
};

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    key: 'dark',
    name: 'Dark Theme',
    colors: {
      primary: '#90CAF9',
      secondary: '#ffc71d',
      background: '#121212',
      surface: '#1E1E1E',
      text: '#E0E0E0'
    }
  },
  {
    key: 'light',
    name: 'Light Theme',
    colors: {
      primary: '#1976D2',
      secondary: '#FFC107',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#212121'
    }
  },
  {
    key: 'nature',
    name: 'Nature Theme',
    colors: {
      primary: '#2E7D32',
      secondary: '#FFB300',
      background: '#F1F8E9',
      surface: '#DCEDC8',
      text: '#33691E'
    }
  },
  {
    key: 'pastel',
    name: 'Pastel Theme',
    colors: {
      primary: '#F48FB1',
      secondary: '#81D4FA',
      background: '#FFF8E1',
      surface: '#FFE0B2',
      text: '#6D4C41'
    }
  },
  {
    key: 'moon',
    name: 'Moon Theme',
    colors: {
      primary: '#FF00FF',
      secondary: '#db8adb',
      background: '#0D0D0D',
      surface: '#1A1A1A',
      text: '#E6E6E6'
    }
  },
  {
    key: 'ocean',
    name: 'Ocean Theme',
    colors: {
      primary: '#0277BD',
      secondary: '#00ACC1',
      background: '#E3F2FD',
      surface: '#BBDEFB',
      text: '#01579B'
    }
  },
  {
    key: 'sunset',
    name: 'Sunset Theme',
    colors: {
      primary: '#FF6F00',
      secondary: '#FF8A65',
      background: '#FFF3E0',
      surface: '#FFCC80',
      text: '#E65100'
    }
  },
  {
    key: 'forest',
    name: 'Forest Theme',
    colors: {
      primary: '#388E3C',
      secondary: '#66BB6A',
      background: '#E8F5E8',
      surface: '#C8E6C9',
      text: '#1B5E20'
    }
  },
  {
    key: 'purple',
    name: 'Purple Theme',
    colors: {
      primary: '#7B1FA2',
      secondary: '#AB47BC',
      background: '#F3E5F5',
      surface: '#E1BEE7',
      text: '#4A148C'
    }
  },
  {
    key: 'cyberpunk',
    name: 'Cyberpunk Theme',
    colors: {
      primary: '#00FF41',
      secondary: '#FF00FF',
      background: '#0D1117',
      surface: '#161B22',
      text: '#C9D1D9'
    }
  },
  {
    key: 'autumn',
    name: 'Autumn Theme',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#FFF8DC',
      surface: '#FFEAA7',
      text: '#2D3436'
    }
  },
  {
    key: 'winter',
    name: 'Winter Theme',
    colors: {
      primary: '#0288D1',
      secondary: '#29B6F6',
      background: '#F1F8FF',
      surface: '#E3F2FD',
      text: '#01579B'
    }
  },
  {
    key: 'galaxy',
    name: 'Galaxy Theme',
    colors: {
      primary: '#673AB7',
      secondary: '#9C27B0',
      background: '#1A0033',
      surface: '#2D1B69',
      text: '#E1BEE7'
    }
  },
  {
    key: 'neon',
    name: 'Neon Theme',
    colors: {
      primary: '#00E676',
      secondary: '#FF1744',
      background: '#0A0A0A',
      surface: '#1C1C1C',
      text: '#00E676'
    }
  },
  {
    key: 'cherry',
    name: 'Cherry Theme',
    colors: {
      primary: '#E91E63',
      secondary: '#FFC1CC',
      background: '#FFF0F3',
      surface: '#FFE4E6',
      text: '#880E4F'
    }
  },
  {
    key: 'matrix',
    name: 'Matrix Theme',
    colors: {
      primary: '#00FF00',
      secondary: '#39FF14',
      background: '#000000',
      surface: '#0A0A0A',
      text: '#00FF00'
    }
  },
  {
    key: 'desert',
    name: 'Desert Theme',
    colors: {
      primary: '#D2691E',
      secondary: '#F4A460',
      background: '#FDF5E6',
      surface: '#F5DEB3',
      text: '#8B4513'
    }
  },
  {
    key: 'arctic',
    name: 'Arctic Theme',
    colors: {
      primary: '#00CED1',
      secondary: '#B0E0E6',
      background: '#F0F8FF',
      surface: '#E0F6FF',
      text: '#008B8B'
    }
  },
  {
    key: 'volcano',
    name: 'Volcano Theme',
    colors: {
      primary: '#FF4500',
      secondary: '#FF6347',
      background: '#2F1B14',
      surface: '#4A2C17',
      text: '#FFE4E1'
    }
  },
  {
    key: 'mint',
    name: 'Mint Theme',
    colors: {
      primary: '#00FA9A',
      secondary: '#98FB98',
      background: '#F0FFF0',
      surface: '#E6FFE6',
      text: '#006400'
    }
  },
  {
    key: 'custom',
    name: 'Custom Theme'
  }
];

export const THEME_COLORS = AVAILABLE_THEMES.reduce((acc, theme) => {
  if (theme.colors) {
    acc[theme.key] = theme.colors;
  }
  return acc;
}, {} as Record<string, any>);

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
      : THEME_COLORS[this.settings.theme] || THEME_COLORS['dark'];
    
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value as string);
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

  getAvailableThemes(): ThemeOption[] {
    return AVAILABLE_THEMES;
  }

  getThemeOption(themeKey: string): ThemeOption | undefined {
    return AVAILABLE_THEMES.find(theme => theme.key === themeKey);
  }

  getThemeColor(themeKey: string, colorType: string): string {
    const theme = this.getThemeOption(themeKey);
    if (theme && theme.colors) {
      return theme.colors[colorType as keyof typeof theme.colors] || '#000000';
    }
    return '#000000';
  }

  private getColorBrightness(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }
}
