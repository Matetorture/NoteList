import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService, Note, Category } from '../services/note.service';
import { AlertService } from '../services/alert.service';
import { KeyboardShortcutsService } from '../services/keyboard-shortcuts.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-note-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './note-form.html',
  styleUrl: './note-form.css'
})
export class NoteForm implements OnInit, OnDestroy, AfterViewInit {
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
  selectedImageFile: File | null = null;
  isExitDialogShowing = false;
  
  private readonly DRAFT_KEY = 'note-form-draft';
  private isDraftLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private alertService: AlertService,
    private keyboardShortcuts: KeyboardShortcutsService,
    private settingsService: SettingsService
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!id && id > 0;
    this.setupKeyboardShortcuts();
    
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
      await this.checkForDraft();
    }
    
    this.loading = false;
  }

  ngAfterViewInit() {
    if (!this.isEditMode) {
      setTimeout(() => {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
        }
      }, 100);
    }
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
    this.onFieldChange();
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
      this.alertService.error('Validation Error', 'Title is required!');
      return;
    }

    this.saving = true;
    try {
      if (!this.isEditMode) {
        this.note.created_at = new Date().toISOString();
      }
      
      await this.noteService.saveNote(this.note);
      this.clearDraft();
      this.alertService.success('Success', 'Note saved successfully!');
      this.router.navigate(['/note', this.note.id]);
    } catch (error) {
      console.error('Error saving note:', error);
      this.alertService.error('Error', 'Error saving note!');
    } finally {
      this.saving = false;
    }
  }

  async deleteNote() {
    if (!this.isEditMode) return;
    
    this.alertService.confirm(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      async () => {
        try {
          await this.noteService.deleteNote(this.note.id);
          this.alertService.success('Success', 'Note deleted successfully!');
          this.router.navigate(['/notes']);
        } catch (error) {
          console.error('Error deleting note:', error);
          this.alertService.error('Error', 'Error deleting note!');
        }
      }
    );
  }

  goBack() {
    if (this.isExitDialogShowing) {
      return;
    }

    const hasContent = this.note.title.trim() || 
                      this.note.description.trim() || 
                      this.note.content.trim() ||
                      this.note.categories.length > 0 ||
                      this.selectedImageFile !== null;

    if (hasContent) {
      this.isExitDialogShowing = true;
      const title = this.isEditMode ? 'Leave Editor' : 'Leave Note Creation';
      const message = this.isEditMode 
        ? 'Are you sure you want to leave the editor? Any unsaved changes will be lost.'
        : 'Are you sure you want to leave? Your note will be saved.';
      
      this.alertService.confirm(
        title,
        message,
        () => {
          this.isExitDialogShowing = false;
          if (!this.isEditMode) {
          }
          if (this.isEditMode && this.note.id > 0) {
            this.router.navigate(['/note', this.note.id]);
          } else {
            this.router.navigate(['/notes']);
          }
        },
        () => {
          this.isExitDialogShowing = false;
        },
        this.isEditMode ? 'warning' : 'primary'
      );
    } else {
      if (!this.isEditMode) {
        this.clearDraft();
      }
      if (this.isEditMode && this.note.id > 0) {
        this.router.navigate(['/note', this.note.id]);
      } else {
        this.router.navigate(['/notes']);
      }
    }
  }

  onImageFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      this.processImageFile(file);
    }
  }



  private processImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.alertService.error('Invalid File', 'Please select a valid image file!');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      this.alertService.error('File Too Large', 'Image file size must be less than 5MB!');
      return;
    }
    
    this.selectedImageFile = file;
    this.convertImageToBase64(file);
  }

  convertImageToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.note.img = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.note.img = '';
    this.selectedImageFile = null;
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  get contentTextareaHeight(): number {
    return this.settingsService.getSettings().contentTextareaHeight;
  }

  ngOnDestroy() {
    this.keyboardShortcuts.stopListening();
    this.keyboardShortcuts.clearAllShortcuts();
    clearTimeout(this.draftSaveTimer);
  }

  async checkForDraft() {
    const savedDraft = localStorage.getItem(this.DRAFT_KEY);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        const hasContent = draftData.title?.trim() || 
                          draftData.description?.trim() || 
                          draftData.content?.trim() ||
                          (draftData.categories && draftData.categories.length > 0);
        
        if (hasContent) {
          this.alertService.confirm(
            'Restore Previous Draft',
            'You have an unsaved note from a previous session. Would you like to restore it?',
            () => {
              this.loadDraft(draftData);
            },
            () => {
              this.clearDraft();
            },
            'primary'
          );
        } else {
          this.clearDraft();
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        this.clearDraft();
      }
    }
  }

  loadDraft(draftData: any) {
    this.note.title = draftData.title || '';
    this.note.description = draftData.description || '';
    this.note.content = draftData.content || '';
    this.note.categories = draftData.categories || [];
    this.categorySearchTerm = '';
    this.onCategorySearch();
    this.isDraftLoaded = true;
  }

  saveDraft() {
    if (this.isEditMode) return;
    
    const draftData = {
      title: this.note.title,
      description: this.note.description,
      content: this.note.content,
      categories: this.note.categories,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draftData));
  }

  clearDraft() {
    localStorage.removeItem(this.DRAFT_KEY);
  }

  onFieldChange() {
    if (!this.isEditMode) {
      clearTimeout(this.draftSaveTimer);
      this.draftSaveTimer = setTimeout(() => {
        this.saveDraft();
      }, 1000);
    }
  }

  private draftSaveTimer: any;

  navigateToCategories() {
    const hasContent = this.note.title.trim() || 
                      this.note.description.trim() || 
                      this.note.content.trim() ||
                      this.note.categories.length > 0 ||
                      this.selectedImageFile !== null;

    if (hasContent) {
      this.alertService.confirm(
        this.isEditMode ? 'Leave Note Editor' : 'Leave Note Creation',
        'Are you sure you want to leave? Your note will not be saved and all progress will be lost.\n\nTip: You can always add categories later after saving the note.',
        () => {
          if(!this.isEditMode) {
            this.clearDraft();
          }
          this.router.navigate(['/categories']);
        }
      );
    } else {
      this.router.navigate(['/categories']);
    }
  }

  setupKeyboardShortcuts() {
    this.keyboardShortcuts.registerShortcut({
      key: 'Escape',
      action: () => this.goBack()
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'Z',
      ctrl: true,
      action: () => this.goBack()
    });

    this.keyboardShortcuts.registerShortcut({
      key: 'S',
      ctrl: true,
      action: () => {
        if (!this.saving) {
          this.saveNote();
        }
      }
    });

    this.keyboardShortcuts.startListening();
  }
}