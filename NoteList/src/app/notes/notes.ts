import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NoteService, Note, Category } from '../services/note.service';
import { NotesFilterService } from '../services/notes-filter.service';
import { SettingsService } from '../services/settings.service';
import { KeyboardShortcutsService } from '../services/keyboard-shortcuts.service';

@Component({
  selector: 'app-notes',
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './notes.html',
  styleUrl: './notes.css'
})
export class Notes implements OnInit, OnDestroy {
  notes: Note[] = [];
  allNotes: Note[] = [];
  allCategories: string[] = [];
  availableCategories: Category[] = [];
  selectedCategories: string[] = [];
  searchTerm = '';
  loading = true;
  showCategoryFilter = false;
  settings: any;

  constructor(
    private noteService: NoteService,
    private filterService: NotesFilterService,
    private settingsService: SettingsService,
    private keyboardShortcuts: KeyboardShortcutsService,
    private router: Router
  ) {
    this.settings = this.settingsService.getSettings();
  }

  async ngOnInit() {
    this.refreshSettings();
    this.setupKeyboardShortcuts();
    
    const filterState = this.filterService.getFilterState();
    this.searchTerm = filterState.searchTerm;
    this.selectedCategories = [...filterState.selectedCategories];
    this.showCategoryFilter = filterState.showCategoryFilter;
    
    await this.loadData();
    await this.refreshNotes();
  }

  ngOnDestroy() {
    this.keyboardShortcuts.stopListening();
    this.keyboardShortcuts.clearAllShortcuts();
  }

  async loadData() {
    this.loading = true;
    this.allNotes = await this.noteService.getNotes();
    this.notes = [...this.allNotes];
    this.allCategories = await this.noteService.getAllCategories();
    this.availableCategories = await this.noteService.getCategories();
    this.applyFilters();
    this.loading = false;
  }

  async refreshNotes() {
    if (this.selectedCategories.length > 0) {
      this.loading = true;
      this.notes = await this.noteService.getNotesByCategories(this.selectedCategories);
      this.loading = false;
    } else {
      await this.loadData();
    }
  }

  toggleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;
    this.filterService.updateShowCategoryFilter(this.showCategoryFilter);
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.filterService.updateSelectedCategories(this.selectedCategories);
    this.filterByCategories();
  }

  clearFilters() {
    this.selectedCategories = [];
    this.filterService.updateSelectedCategories(this.selectedCategories);
    this.refreshNotes();
  }

  async filterByCategories() {
    this.loading = true;
    if (this.selectedCategories.length > 0) {
      this.allNotes = await this.noteService.getNotesByCategories(this.selectedCategories);
    } else {
      this.allNotes = await this.noteService.getNotes();
    }
    this.applyFilters();
    this.loading = false;
  }

  onSearch() {
    this.filterService.updateSearchTerm(this.searchTerm);
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterService.updateSearchTerm(this.searchTerm);
    this.applyFilters();
  }

  applyFilters() {
    let filteredNotes = [...this.allNotes];

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.description.toLowerCase().includes(searchLower)
      );
    }

    this.notes = filteredNotes;
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

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  getCategoryColor(categoryName: string): string {
    const category = this.availableCategories.find(c => c.name === categoryName);
    return category?.color || '#cccccc';
  }

  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || this.selectedCategories.length > 0;
  }

  shouldShowActiveFilters(): boolean {
    return this.settings.showActiveFilters && this.hasActiveFilters();
  }

  shouldShowCreationDates(): boolean {
    return this.settings.showCreationDates;
  }

  refreshSettings(): void {
    this.settings = this.settingsService.getSettings();
  }

  setupKeyboardShortcuts() {
    this.keyboardShortcuts.registerShortcut({
      key: 'n',
      ctrl: true,
      action: () => this.router.navigate(['/note-form'])
    });

    this.keyboardShortcuts.registerShortcut({
      key: '/',
      action: () => this.focusSearchBar()
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'Enter',
      action: () => this.focusSearchBar()
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'f',
      ctrl: true,
      action: () => this.toggleCategoryFilter()
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'Escape',
      action: () => this.router.navigate(['/notes'])
    });

    this.keyboardShortcuts.startListening();
  }

  focusSearchBar() {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  async moveNoteUp(index: number, event: Event) {
    event.stopPropagation();
    if (index > 0) {
      const currentNote = { ...this.notes[index] };
      const previousNote = { ...this.notes[index - 1] };
      
      const tempId = currentNote.id;
      currentNote.id = previousNote.id;
      previousNote.id = tempId;
      
      await this.noteService.saveNote(currentNote);
      await this.noteService.saveNote(previousNote);
      
      this.notes[index] = previousNote;
      this.notes[index - 1] = currentNote;
      
      const allNotesCurrentIndex = this.allNotes.findIndex(n => n.id === currentNote.id);
      const allNotesPreviousIndex = this.allNotes.findIndex(n => n.id === previousNote.id);
      if (allNotesCurrentIndex !== -1) this.allNotes[allNotesCurrentIndex] = currentNote;
      if (allNotesPreviousIndex !== -1) this.allNotes[allNotesPreviousIndex] = previousNote;
    }
  }

  async moveNoteDown(index: number, event: Event) {
    event.stopPropagation();
    if (index < this.notes.length - 1) {
      const currentNote = { ...this.notes[index] };
      const nextNote = { ...this.notes[index + 1] };
      
      const tempId = currentNote.id;
      currentNote.id = nextNote.id;
      nextNote.id = tempId;
      
      await this.noteService.saveNote(currentNote);
      await this.noteService.saveNote(nextNote);
      
      this.notes[index] = nextNote;
      this.notes[index + 1] = currentNote;
      
      const allNotesCurrentIndex = this.allNotes.findIndex(n => n.id === currentNote.id);
      const allNotesNextIndex = this.allNotes.findIndex(n => n.id === nextNote.id);
      if (allNotesCurrentIndex !== -1) this.allNotes[allNotesCurrentIndex] = currentNote;
      if (allNotesNextIndex !== -1) this.allNotes[allNotesNextIndex] = nextNote;
    }
  }
}
