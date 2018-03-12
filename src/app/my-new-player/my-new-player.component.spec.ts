import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewPlayerComponent } from './my-new-player.component';

describe('MyNewPlayerComponent', () => {
  let component: MyNewPlayerComponent;
  let fixture: ComponentFixture<MyNewPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNewPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNewPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
