import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService, Category } from '../services/note.service';
import { AlertService } from '../services/alert.service';
import { KeyboardShortcutsService } from '../services/keyboard-shortcuts.service';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit, OnDestroy {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  loading = true;
  
  newCategoryName = '';
  newCategoryColor = '#4CAF50';
  
  editingCategory: Category | null = null;
  editName = '';
  editColor = '';

  searchTerm = '';

  constructor(
    private router: Router,
    private keyboardShortcuts: KeyboardShortcutsService,
    private noteService: NoteService,
    private alertService: AlertService
  ) {
    this.newCategoryColor = this.getRandomColor();
  }

  async ngOnInit() {
    this.setupKeyboardShortcuts();
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading = true;
    this.categories = await this.noteService.getCategories();
    this.filteredCategories = [...this.categories];
    this.loading = false;
  }

  onSearchCategories() {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearCategorySearch() {
    this.searchTerm = '';
    this.filteredCategories = [...this.categories];
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) {
      this.alertService.error('Validation Error', 'Category name is required!');
      return;
    }

    if (this.categories.some(c => c.name.toLowerCase() === this.newCategoryName.trim().toLowerCase())) {
      this.alertService.error('Duplicate Category', 'Category with this name already exists!');
      return;
    }

    const newCategory: Category = {
      name: this.newCategoryName.trim(),
      color: this.newCategoryColor
    };

    try {
      await this.noteService.saveCategory(newCategory);
      await this.loadCategories();
      this.newCategoryName = '';
      this.newCategoryColor = this.getRandomColor();
      this.onSearchCategories();
      this.alertService.success('Success', 'Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      this.alertService.error('Error', 'Error adding category!');
    }
  }

  startEditing(category: Category) {
    this.editingCategory = { ...category };
    this.editName = category.name;
    this.editColor = category.color;
  }

  cancelEditing() {
    this.editingCategory = null;
    this.editName = '';
    this.editColor = '';
  }

  async saveEdit() {
    if (!this.editName.trim()) {
      this.alertService.error('Validation Error', 'Category name is required!');
      return;
    }

    if (!this.editingCategory) return;

    if (this.editName.toLowerCase() !== this.editingCategory.name.toLowerCase()) {
      if (this.categories.some(c => c.name.toLowerCase() === this.editName.trim().toLowerCase())) {
        this.alertService.error('Duplicate Category', 'Category with this name already exists!');
        return;
      }
    }

    const updatedCategory: Category = {
      name: this.editName.trim(),
      color: this.editColor
    };

    try {
      if (this.editingCategory.name !== updatedCategory.name) {
        const updatedNotesCount = await this.noteService.updateCategoryInNotes(this.editingCategory.name, updatedCategory.name);
        await this.noteService.deleteCategory(this.editingCategory.name);
        
        const message = updatedNotesCount > 0 
          ? `Category updated successfully! Updated ${updatedNotesCount} note${updatedNotesCount === 1 ? '' : 's'}.`
          : 'Category updated successfully!';
        
        await this.noteService.saveCategory(updatedCategory);
        await this.loadCategories();
        this.cancelEditing();
        this.onSearchCategories();
        this.alertService.success('Success', message);
      } else {
        await this.noteService.saveCategory(updatedCategory);
        await this.loadCategories();
        this.cancelEditing();
        this.onSearchCategories();
        this.alertService.success('Success', 'Category updated successfully!');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      this.alertService.error('Error', 'Error updating category!');
    }
  }

  async deleteCategory(categoryName: string) {
    this.alertService.confirm(
      'Delete Category',
      `Are you sure you want to delete category "${categoryName}"?\n\nThis will remove the category from all notes that use it.`,
      async () => {
        try {
          const removedNotesCount = await this.noteService.removeCategoryFromNotes(categoryName);
          await this.noteService.deleteCategory(categoryName);
          await this.loadCategories();
          this.onSearchCategories();
          
          const message = removedNotesCount > 0 
            ? `Category deleted successfully! Removed from ${removedNotesCount} note${removedNotesCount === 1 ? '' : 's'}.`
            : 'Category deleted successfully!';
          
          this.alertService.success('Success', message);
        } catch (error) {
          console.error('Error deleting category:', error);
          this.alertService.error('Error', 'Error deleting category!');
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['/notes']);
  }

  getRandomColor() {
    const colors = [
      '#FF9800',
      '#9C27B0',
      '#F44336',
      '#00BCD4',
      '#FFEB3B',
      '#8BC34A',
      '#E91E63',
      '#FF5722',
      '#3F51B5',
      '#4CAF50',
      '#2196F3',
      '#673AB7',
      '#CDDC39',
      '#009688',
      '#FFC107',
      '#C62828',
      '#283593',
      '#00695C',
      '#1E88E5',
      '#D81B60',
      '#FDD835',
      '#2E7D32',
      '#FF7043',
      '#90CAF9',
      '#BA68C8',
      '#AED581',
      '#FFCDD2',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useRandomColor() {
    if (this.editingCategory) {
      this.editColor = this.getRandomColor();
    } else {
      this.newCategoryColor = this.getRandomColor();
    }
  }

  ngOnDestroy() {
    this.keyboardShortcuts.stopListening();
    this.keyboardShortcuts.clearAllShortcuts();
  }

  setupKeyboardShortcuts() {
    this.keyboardShortcuts.registerShortcut({
      key: '/',
      action: () => this.focusCategorySearch()
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'Enter',
      action: () => this.focusCategorySearch()
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

  focusCategorySearch() {
    const searchInput = document.getElementById('categorySearch') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }
}
