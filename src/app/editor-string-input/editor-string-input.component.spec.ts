import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorStringInputComponent } from './editor-string-input.component';

describe('EditorStringInputComponent', () => {
  let component: EditorStringInputComponent;
  let fixture: ComponentFixture<EditorStringInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorStringInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorStringInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
