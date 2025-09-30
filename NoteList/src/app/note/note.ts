import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoteService, Note as NoteModel } from '../services/note.service';

@Component({
  selector: 'app-note',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './note.html',
  styleUrl: './note.css'
})
export class Note implements OnInit {
  note: NoteModel | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.note = await this.noteService.getNoteById(id);
    }
    this.loading = false;
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
}
