import { Injectable } from '@angular/core';
import { NoteService, Note, Category } from './note.service';
import { AlertService } from './alert.service';

export interface ExportData {
  notes: Note[];
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  constructor(
    private noteService: NoteService,
    private alertService: AlertService
  ) {}

  async exportData(): Promise<void> {
    let infoAlertId: string | null = null;
    try {
      infoAlertId = this.alertService.info('Export', 'Preparing data for export...');
      
      const notes = await this.noteService.getNotes();
      const categories = await this.noteService.getCategories();
      
      console.log('Exporting notes:', notes);
      console.log('Exporting categories:', categories);

      const exportData: ExportData = {
        notes,
        categories
      };

      console.log('Export data structure:', exportData);

      const jsonData = JSON.stringify(exportData, null, 2);
      
      console.log('Generated JSON:', jsonData);
      
      if (infoAlertId) {
        this.alertService.removeAlert(infoAlertId);
      }
      
      this.downloadFile(jsonData, `noteList_backup_${new Date().toISOString().split('T')[0]}.json`);
      
      this.alertService.success('Export Complete', 'Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      if (infoAlertId) {
        this.alertService.removeAlert(infoAlertId);
      }
      this.alertService.error('Export Failed', 'Failed to export data: ' + (error as Error).message);
    }
  }

  async importData(): Promise<void> {
    let infoAlertId: string | null = null;
    try {
      const fileContent = await this.selectAndReadFile();
      
      if (!fileContent) {
        return;
      }

      infoAlertId = this.alertService.info('Import', 'Processing import file...');
      
      let importData: ExportData;
      try {
        importData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Invalid JSON file format');
      }

      if (!this.validateImportData(importData)) {
        if (!this.basicValidation(importData)) {
          console.error('Import data structure:', importData);
          
          const forceImport = confirm('Validation failed. Force import anyway? (Check console for details)');
          if (!forceImport) {
            throw new Error('Invalid data structure in import file');
          }
        } else {
          console.warn('Using basic validation - some data might be missing fields');
        }
      }

      if (infoAlertId) {
        this.alertService.removeAlert(infoAlertId);
        infoAlertId = null;
      }

      return new Promise<void>((resolve) => {
        this.alertService.confirm(
          'Import Data',
          `This will import:\n• ${importData.notes.length} notes\n• ${importData.categories.length} categories\n\nCurrent data will be replaced. Continue?`,
          async () => {
            await this.performImport(importData);
            resolve();
          },
          () => {
            resolve();
          }
        );
      });

    } catch (error) {
      console.error('Import error:', error);
      if (infoAlertId) {
        this.alertService.removeAlert(infoAlertId);
      }
      this.alertService.error('Import Failed', 'Failed to import data: ' + (error as Error).message);
    }
  }

  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private selectAndReadFile(): Promise<string> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve('');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content || '');
        };
        reader.onerror = () => {
          this.alertService.error('File Error', 'Failed to read file');
          resolve('');
        };
        reader.readAsText(file);
      };
      
      input.oncancel = () => {
        resolve('');
      };
      
      input.click();
    });
  }

  private async performImport(importData: ExportData): Promise<void> {
    let importingAlertId: string | null = null;
    try {
      importingAlertId = this.alertService.info('Import', 'Importing data...');

      for (const category of importData.categories) {
        await this.noteService.saveCategory(category);
      }

      for (const note of importData.notes) {
        await this.noteService.saveNote(note);
      }

      if (importingAlertId) {
        this.alertService.removeAlert(importingAlertId);
      }

      this.alertService.success('Import Complete', 'Data imported successfully!');
      
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Import process error:', error);
      if (importingAlertId) {
        this.alertService.removeAlert(importingAlertId);
      }
      this.alertService.error('Import Failed', 'Failed to import data: ' + (error as Error).message);
    }
  }

  private validateImportData(data: any): data is ExportData {
    console.log('Validating import data:', data);
    
    if (!data || typeof data !== 'object') {
      console.error('Data is not an object');
      return false;
    }

    if (!Array.isArray(data.notes)) {
      console.error('Notes is not an array:', data.notes);
      return false;
    }
    
    if (!Array.isArray(data.categories)) {
      console.error('Categories is not an array:', data.categories);
      return false;
    }

    for (let i = 0; i < data.notes.length; i++) {
      const note = data.notes[i];
      console.log(`Validating note ${i}:`, note);
      
      if (!note || typeof note !== 'object') {
        console.error(`Note ${i} is not an object`);
        return false;
      }
      
      if (note.id === undefined || note.id === null) {
        console.error(`Note ${i} missing id`);
        return false;
      }
      
      if (!note.title && note.title !== '') {
        console.error(`Note ${i} missing title`);
        return false;
      }
      
      if (!note.content && note.content !== '') {
        console.error(`Note ${i} missing content`);
        return false;
      }
      
      if (!Array.isArray(note.categories)) {
        console.error(`Note ${i} categories is not an array:`, note.categories);
        return false;
      }
    }

    for (let i = 0; i < data.categories.length; i++) {
      const category = data.categories[i];
      console.log(`Validating category ${i}:`, category);
      
      if (!category || typeof category !== 'object') {
        console.error(`Category ${i} is not an object`);
        return false;
      }
      
      if (!category.name) {
        console.error(`Category ${i} missing name`);
        return false;
      }
      
      if (!category.color) {
        console.error(`Category ${i} missing color`);
        return false;
      }
    }

    console.log('Validation successful');
    return true;
  }

  private basicValidation(data: any): boolean {
    console.log('Running basic validation');
    
    if (data && typeof data === 'object') {
      const hasNotes = Array.isArray(data.notes);
      const hasCategories = Array.isArray(data.categories);
      
      console.log('Basic validation - has notes:', hasNotes, 'has categories:', hasCategories);
      return hasNotes && hasCategories;
    }
    
    return false;
  }

  async getExportPreview(): Promise<{ notesCount: number; categoriesCount: number; hasSettings: boolean }> {
    try {
      const notes = await this.noteService.getNotes();
      const categories = await this.noteService.getCategories();

      return {
        notesCount: notes.length,
        categoriesCount: categories.length,
        hasSettings: false
      };
    } catch (error) {
      console.error('Error getting export preview:', error);
      return { notesCount: 0, categoriesCount: 0, hasSettings: false };
    }
  }
}
