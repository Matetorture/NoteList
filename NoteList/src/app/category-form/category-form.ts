import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService, Category } from '../services/note.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit {
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
    private noteService: NoteService,
    private alertService: AlertService
  ) {
    this.newCategoryColor = this.getRandomColor();
  }

  async ngOnInit() {
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
      this.alertService.warning('Validation Error', 'Category name is required!');
      return;
    }

    // Check if category already exists
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
      this.alertService.warning('Validation Error', 'Category name is required!');
      return;
    }

    if (!this.editingCategory) return;

    // Check if new name conflicts with existing categories (excluding current)
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
      // If name changed, delete old and create new
      if (this.editingCategory.name !== updatedCategory.name) {
        await this.noteService.deleteCategory(this.editingCategory.name);
      }
      
      await this.noteService.saveCategory(updatedCategory);
      await this.loadCategories();
      this.cancelEditing();
      this.onSearchCategories();
      this.alertService.success('Success', 'Category updated successfully!');
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
          await this.noteService.deleteCategory(categoryName);
          await this.loadCategories();
          this.onSearchCategories();
          this.alertService.success('Success', 'Category deleted successfully!');
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
      '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
      '#607D8B', '#00BCD4', '#FFEB3B', '#8BC34A', '#E91E63',
      '#795548', '#FF5722', '#009688', '#3F51B5', '#FF6F00'
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
}
