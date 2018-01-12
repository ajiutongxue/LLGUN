import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortRowComponent } from './sort-row.component';

describe('SortRowComponent', () => {
  let component: SortRowComponent;
  let fixture: ComponentFixture<SortRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
