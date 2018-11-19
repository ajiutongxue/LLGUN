import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragTableComponent } from './drag-table.component';

describe('DragTableComponent', () => {
  let component: DragTableComponent;
  let fixture: ComponentFixture<DragTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
