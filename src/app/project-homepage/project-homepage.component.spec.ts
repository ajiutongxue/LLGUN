import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHomepageComponent } from './project-homepage.component';

describe('ProjectHomepageComponent', () => {
  let component: ProjectHomepageComponent;
  let fixture: ComponentFixture<ProjectHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
