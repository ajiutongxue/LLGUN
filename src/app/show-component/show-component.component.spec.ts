import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowComponentComponent } from './show-component.component';

describe('ShowComponentComponent', () => {
  let component: ShowComponentComponent;
  let fixture: ComponentFixture<ShowComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
