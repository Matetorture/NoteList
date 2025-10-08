import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoteService, Note as NoteModel, Category } from '../services/note.service';
import { KeyboardShortcutsService } from '../services/keyboard-shortcuts.service';
import { SettingsService } from '../services/settings.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-note',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './note.html',
  styleUrl: './note.css'
})
export class Note implements OnInit, OnDestroy {
  note: NoteModel | null = null;
  categories: Category[] = [];
  loading = true;
  hoveredLineIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private keyboardShortcuts: KeyboardShortcutsService,
    private router: Router,
    private settingsService: SettingsService,
    private alertService: AlertService
  ) {}

  async ngOnInit() {
    window.scrollTo(0, 0);
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.setupKeyboardShortcuts(id);
    
    this.categories = await this.noteService.getCategories();
    
    if (id) {
      this.note = await this.noteService.getNoteById(id);
    }
    this.loading = false;
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(c => c.name === categoryName);
    return category?.color || '#cccccc';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }

  getContentLines(): string[] {
    if (!this.note?.content) {
      return [];
    }
    return this.note.content.split('\n');
  }

  get showLineNumbers(): boolean {
    return this.settingsService.getSettings().showLineNumbers;
  }

  get showCopyButtons(): boolean {
    return this.settingsService.getShowCopyButtons();
  }

  getLineNumberWidth(): number {
    const lineCount = this.getContentLines().length;
    const digits = lineCount.toString().length;
    return Math.max(32, digits * 8 + 16);
  }

  getContentPaddingLeft(): number {
    return this.getLineNumberWidth() + 12;
  }

  showCopyButton(lineIndex: number) {
    this.hoveredLineIndex = lineIndex;
  }

  hideCopyButton(lineIndex: number) {
    this.hoveredLineIndex = null;
  }

  async copyLineToClipboard(line: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(line);
    } catch (err) {
      console.error('Failed to copy line to clipboard:', err);
    }
  }

  ngOnDestroy() {
    this.keyboardShortcuts.stopListening();
    this.keyboardShortcuts.clearAllShortcuts();
  }

  setupKeyboardShortcuts(noteId: number) {
    this.keyboardShortcuts.registerShortcut({
      key: 'Enter',
      action: () => {
        if (noteId) {
          this.router.navigate(['/note-form', noteId]);
        }
      }
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'Escape',
      action: () => this.router.navigate(['/notes'])
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'Z',
      ctrl: true,
      action: () => this.router.navigate(['/notes'])
    });

    this.keyboardShortcuts.startListening();
  }

  downloadImage() {
    if (!this.note?.img) {
      this.alertService.error('No Image', 'No image available to download');
      return;
    }

    try {
      const base64Data = this.note.img.split(',')[1];
      const mimeType = this.note.img.split(',')[0].split(':')[1].split(';')[0];
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = mimeType.split('/')[1] || 'jpg';
      const fileName = `${this.note.title || 'note-image'}.${extension}`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      this.alertService.success('Downloaded!', `Image saved as ${fileName}`);
    } catch (error) {
      console.error('Error downloading image:', error);
      this.alertService.error('Download Failed', 'Unable to download image');
    }
  }
}
