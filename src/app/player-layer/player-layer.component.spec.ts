import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLayerComponent } from './player-layer.component';

describe('PlayerLayerComponent', () => {
  let component: PlayerLayerComponent;
  let fixture: ComponentFixture<PlayerLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
