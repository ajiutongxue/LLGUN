import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewTaskDetailComponent } from './my-new-task-detail.component';

describe('MyNewTaskDetailComponent', () => {
  let component: MyNewTaskDetailComponent;
  let fixture: ComponentFixture<MyNewTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNewTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNewTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
