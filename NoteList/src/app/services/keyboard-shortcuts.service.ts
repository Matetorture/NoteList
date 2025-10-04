import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from './settings.service';

export interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  action: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {
  private shortcuts: Map<string, ShortcutAction> = new Map();
  private isListening = false;

  constructor(
    private router: Router,
    private settingsService: SettingsService
  ) {}

  registerShortcut(shortcut: ShortcutAction): void {
    const key = this.createShortcutKey(shortcut.key, shortcut.ctrl);
    this.shortcuts.set(key, shortcut);
  }

  unregisterShortcut(key: string, ctrl?: boolean): void {
    const shortcutKey = this.createShortcutKey(key, ctrl);
    this.shortcuts.delete(shortcutKey);
  }

  clearAllShortcuts(): void {
    this.shortcuts.clear();
  }

  unregisterAll(): void {
    this.clearAllShortcuts();
  }

  startListening(): void {
    if (this.isListening) return;
    
    this.isListening = true;
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  stopListening(): void {
    if (!this.isListening) return;
    
    this.isListening = false;
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleKeydown(event: KeyboardEvent): void {
    const settings = this.settingsService.getSettings();
    if (!settings.keyboardShortcuts) return;

    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      if (event.key !== '/' && event.key !== 'Enter' && event.key !== 'Escape') {
        return;
      }
    }

    const key = this.createShortcutKey(event.key, event.ctrlKey);
    const shortcut = this.shortcuts.get(key);
    
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  private createShortcutKey(key: string, ctrl?: boolean): string {
    return `${ctrl ? 'ctrl+' : ''}${key.toLowerCase()}`;
  }
}