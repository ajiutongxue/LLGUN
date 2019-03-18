import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticComponent } from './notic.component';

describe('NoticComponent', () => {
  let component: NoticComponent;
  let fixture: ComponentFixture<NoticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
