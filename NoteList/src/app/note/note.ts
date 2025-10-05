import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoteService, Note as NoteModel, Category } from '../services/note.service';
import { KeyboardShortcutsService } from '../services/keyboard-shortcuts.service';

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

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private keyboardShortcuts: KeyboardShortcutsService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Scroll to top immediately when component loads
    window.scrollTo(0, 0);
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.setupKeyboardShortcuts(id);
    
    // Load categories first to get colors
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

    this.keyboardShortcuts.startListening();
  }
}
