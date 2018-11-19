import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuShowsComponent } from './menu-shows.component';

describe('MenuShowsComponent', () => {
  let component: MenuShowsComponent;
  let fixture: ComponentFixture<MenuShowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuShowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
