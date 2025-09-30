import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note } from './note';

describe('Note', () => {
  let component: Note;
  let fixture: ComponentFixture<Note>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Note]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Note);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
