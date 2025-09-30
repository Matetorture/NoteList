import { Injectable } from '@angular/core';

export interface NotesFilterState {
  searchTerm: string;
  selectedCategories: string[];
  showCategoryFilter: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotesFilterService {
  private readonly STORAGE_KEY = 'notelist_filter_state';
  private filterState: NotesFilterState = {
    searchTerm: '',
    selectedCategories: [],
    showCategoryFilter: false
  };

  constructor() {
    this.loadFromStorage();
  }

  getFilterState(): NotesFilterState {
    return { ...this.filterState };
  }

  setFilterState(state: Partial<NotesFilterState>): void {
    this.filterState = { ...this.filterState, ...state };
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        this.filterState = { ...this.filterState, ...parsedState };
      }
    } catch (error) {
      console.warn('Failed to load filter state from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.filterState));
    } catch (error) {
      console.warn('Failed to save filter state to storage:', error);
    }
  }

  clearFilters(): void {
    this.filterState = {
      searchTerm: '',
      selectedCategories: [],
      showCategoryFilter: false
    };
    this.saveToStorage();
  }

  updateSearchTerm(searchTerm: string): void {
    this.filterState.searchTerm = searchTerm;
    this.saveToStorage();
  }

  updateSelectedCategories(selectedCategories: string[]): void {
    this.filterState.selectedCategories = [...selectedCategories];
    this.saveToStorage();
  }

  updateShowCategoryFilter(show: boolean): void {
    this.filterState.showCategoryFilter = show;
    this.saveToStorage();
  }
}