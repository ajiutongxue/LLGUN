import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFnComponent } from './my-fn.component';

describe('MyFnComponent', () => {
  let component: MyFnComponent;
  let fixture: ComponentFixture<MyFnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
