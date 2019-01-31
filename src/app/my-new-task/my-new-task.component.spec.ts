import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewTaskComponent } from './my-new-task.component';

describe('MyNewTaskComponent', () => {
  let component: MyNewTaskComponent;
  let fixture: ComponentFixture<MyNewTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNewTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
