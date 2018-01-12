import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteMsgComponent } from './note-msg.component';

describe('NoteMsgComponent', () => {
  let component: NoteMsgComponent;
  let fixture: ComponentFixture<NoteMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
