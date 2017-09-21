import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgsAsMovComponent } from './imgs-as-mov.component';

describe('ImgsAsMovComponent', () => {
  let component: ImgsAsMovComponent;
  let fixture: ComponentFixture<ImgsAsMovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgsAsMovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgsAsMovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
