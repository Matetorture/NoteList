import { Routes } from "@angular/router";
import { Notes } from "./notes/notes";
import { Note } from "./note/note";
import { NoteForm } from "./note-form/note-form";
import { CategoryForm } from "./category-form/category-form";
import { Settings } from "./settings/settings";

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'notes' },
	{ path: 'notes', component: Notes },
	{ path: 'note/:id', component: Note },
	{ path: 'note-form/:id', component: NoteForm },
	{ path: 'note-form', component: NoteForm },
	{ path: 'categories', component: CategoryForm },
	{ path: 'settings', component: Settings },
	{ path: '**', redirectTo: '' }
];
