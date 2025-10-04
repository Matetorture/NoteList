import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

export interface Note {
  id: number;
  title: string;
  description: string;
  content: string;
  img?: string;
  categories: string[];
  created_at: string;
}

export interface Category {
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  async getNotes(): Promise<Note[]> {
    try {
      return await invoke<Note[]>('get_notes');
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  async getNoteById(id: number): Promise<Note | null> {
    try {
      return await invoke<Note | null>('get_note_by_id', { id });
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  }

  async saveNote(note: Note): Promise<void> {
    try {
      await invoke('save_note', { note });
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  async getAllCategories(): Promise<string[]> {
    try {
      return await invoke<string[]>('get_all_categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getNotesByCategories(selectedCategories: string[]): Promise<Note[]> {
    try {
      return await invoke<Note[]>('get_notes_by_categories', { selectedCategories });
    } catch (error) {
      console.error('Error fetching notes by categories:', error);
      return [];
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      await invoke('delete_note', { id });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  async getNextNoteId(): Promise<number> {
    try {
      return await invoke<number>('get_next_note_id');
    } catch (error) {
      console.error('Error getting next note ID:', error);
      return 1;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await invoke<Category[]>('get_categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async saveCategory(category: Category): Promise<void> {
    try {
      await invoke('save_category', { category });
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  }

  async deleteCategory(categoryName: string): Promise<void> {
    try {
      await invoke('delete_category', { categoryName });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async updateCategoryInNotes(oldCategoryName: string, newCategoryName: string): Promise<number> {
    try {
      const notes = await this.getNotes();
      const updatedNotes = notes.filter(note => 
        note.categories.includes(oldCategoryName)
      );

      for (const note of updatedNotes) {
        const categoryIndex = note.categories.indexOf(oldCategoryName);
        if (categoryIndex > -1) {
          note.categories[categoryIndex] = newCategoryName;
          await this.saveNote(note);
        }
      }

      return updatedNotes.length;
    } catch (error) {
      console.error('Error updating category in notes:', error);
      throw error;
    }
  }

  async removeCategoryFromNotes(categoryName: string): Promise<number> {
    try {
      const notes = await this.getNotes();
      const updatedNotes = notes.filter(note => 
        note.categories.includes(categoryName)
      );

      for (const note of updatedNotes) {
        note.categories = note.categories.filter(cat => cat !== categoryName);
        await this.saveNote(note);
      }

      return updatedNotes.length;
    } catch (error) {
      console.error('Error removing category from notes:', error);
      throw error;
    }
  }
}