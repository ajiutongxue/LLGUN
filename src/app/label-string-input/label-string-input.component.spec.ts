import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelStringInputComponent } from './label-string-input.component';

describe('LabelStringInputComponent', () => {
  let component: LabelStringInputComponent;
  let fixture: ComponentFixture<LabelStringInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelStringInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelStringInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
