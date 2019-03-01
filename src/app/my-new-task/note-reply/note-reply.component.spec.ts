import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteReplyComponent } from './note-reply.component';

describe('NoteReplyComponent', () => {
  let component: NoteReplyComponent;
  let fixture: ComponentFixture<NoteReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
