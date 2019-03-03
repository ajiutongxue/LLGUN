import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTask2Component } from './my-task-2.component';

describe('MyTask2Component', () => {
  let component: MyTask2Component;
  let fixture: ComponentFixture<MyTask2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTask2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTask2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
