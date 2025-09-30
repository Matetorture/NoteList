import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService, Note, Category } from '../services/note.service';

@Component({
  selector: 'app-note-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './note-form.html',
  styleUrl: './note-form.css'
})
export class NoteForm implements OnInit {
  note: Note = {
    id: 0,
    title: '',
    description: '',
    content: '',
    img: '',
    categories: [],
    created_at: new Date().toISOString()
  };
  
  availableCategories: Category[] = [];
  filteredCategories: Category[] = [];
  categorySearchTerm = '';
  isEditMode = false;
  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!id && id > 0;
    
    await this.loadCategories();
    
    if (this.isEditMode) {
      const existingNote = await this.noteService.getNoteById(id);
      if (existingNote) {
        this.note = { ...existingNote };
      } else {
        this.router.navigate(['/notes']);
        return;
      }
    } else {
      this.note.id = await this.noteService.getNextNoteId();
    }
    
    this.loading = false;
  }

  async loadCategories() {
    this.availableCategories = await this.noteService.getCategories();
    this.filterCategories();
  }

  filterCategories() {
    if (!this.categorySearchTerm.trim()) {
      this.filteredCategories = this.availableCategories;
    } else {
      const searchTerm = this.categorySearchTerm.toLowerCase().trim();
      this.filteredCategories = this.availableCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  onCategorySearch() {
    this.filterCategories();
  }

  clearCategorySearch() {
    this.categorySearchTerm = '';
    this.filterCategories();
  }

  toggleCategory(categoryName: string) {
    const index = this.note.categories.indexOf(categoryName);
    if (index > -1) {
      this.note.categories.splice(index, 1);
    } else {
      this.note.categories.push(categoryName);
    }
  }

  isCategorySelected(categoryName: string): boolean {
    return this.note.categories.includes(categoryName);
  }

  getCategoryColor(categoryName: string): string {
    const category = this.availableCategories.find(c => c.name === categoryName);
    return category?.color || '#cccccc';
  }

  async saveNote() {
    if (!this.note.title.trim()) {
      alert('Title is required!');
      return;
    }

    this.saving = true;
    try {
      if (!this.isEditMode) {
        this.note.created_at = new Date().toISOString();
      }
      
      await this.noteService.saveNote(this.note);
      this.router.navigate(['/notes']);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note!');
    } finally {
      this.saving = false;
    }
  }

  async deleteNote() {
    if (!this.isEditMode) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await this.noteService.deleteNote(this.note.id);
        this.router.navigate(['/notes']);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note!');
      }
    }
  }

  cancel() {
    this.router.navigate(['/notes']);
  }
}
