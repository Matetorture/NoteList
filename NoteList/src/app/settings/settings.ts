import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService, AppSettings, DEFAULT_SETTINGS, THEME_COLORS } from '../services/settings.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  settings: AppSettings = DEFAULT_SETTINGS;
  loading = true;
  saving = false;
  previousTheme: string = 'light'; // Track previous theme
  
  fonts = [
    'Lato', 
    'Open Sans', 
    'Roboto', 
    'SUSE Mono', 
    'Playfair Display',
    'Montserrat',
    'Merriweather',
    'Fira Code',
    'Pacifico',
    'Bebas Neue',
    'Crimson Pro',
    'Indie Flower',
    'Ubuntu'
  ];
  themes = [
    { key: 'light', name: 'Light Theme' },
    { key: 'dark', name: 'Dark Theme' },
    { key: 'nature', name: 'Nature Theme' },
    { key: 'pastel', name: 'Pastel Theme' },
    { key: 'moon', name: 'Moon Theme' },
    { key: 'custom', name: 'Custom Theme' }
  ];
  
  themeColors = THEME_COLORS;
  showCustomColors = false;

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.settings = this.settingsService.loadSettings();
    this.showCustomColors = this.settings.theme === 'custom';
    this.previousTheme = this.settings.theme === 'custom' ? 'light' : this.settings.theme;
    
    // Initialize custom colors if needed
    if (this.settings.theme === 'custom' && !this.settings.customColors) {
      this.settings.customColors = { ...THEME_COLORS.light };
    }
    
    this.loading = false;
  }

  onThemeChange() {
    const wasCustom = this.showCustomColors;
    this.showCustomColors = this.settings.theme === 'custom';
    
    if (this.settings.theme !== 'custom') {
      // Switching away from custom - store this theme as previous
      this.previousTheme = this.settings.theme;
      this.settings.customColors = undefined;
    } else if (!wasCustom) {
      // Switching TO custom - use colors from the previous theme
      const sourceTheme = this.previousTheme || 'light';
      this.settings.customColors = { 
        ...THEME_COLORS[sourceTheme as keyof typeof THEME_COLORS] 
      };
    }
    
    // Apply theme immediately
    this.saveSettings();
  }

  onFontChange() {
    // Apply font immediately
    this.saveSettings();
  }

  onDisplaySettingChange() {
    this.saveSettings();
  }

  onAdvancedSettingChange() {
    this.saveSettings();
  }

  saveSettings() {
    this.saving = true;
    try {
      this.settingsService.saveSettings(this.settings);
      setTimeout(() => {
        this.saving = false;
      }, 300);
    } catch (error) {
      console.error('Error saving settings:', error);
      this.alertService.error('Error', 'Error saving settings!');
      this.saving = false;
    }
  }

  resetToDefaults() {
    this.alertService.confirm(
      'Reset Settings',
      'Are you sure you want to reset all settings to defaults? This action cannot be undone.',
      () => {
        this.settings = { ...DEFAULT_SETTINGS };
        this.showCustomColors = false;
        this.saveSettings();
        this.alertService.success('Success', 'Settings reset to defaults successfully!');
        console.log('Settings reset to defaults');
      }
    );
  }

  goBack() {
    this.router.navigate(['/notes']);
  }

  importData() {
    this.settingsService.importData();
  }

  exportData() {
    this.settingsService.exportData();
  }

  getCurrentThemeColors() {
    if (this.settings.theme === 'custom' && this.settings.customColors) {
      return this.settings.customColors;
    }
    return THEME_COLORS[this.settings.theme as keyof typeof THEME_COLORS] || THEME_COLORS.light;
  }

  getFontClass(font: string): string {
    return 'font-option-' + font.toLowerCase().replace(/\s+/g, '-');
  }
}
