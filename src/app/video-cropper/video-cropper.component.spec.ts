import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCropperComponent } from './video-cropper.component';

describe('VideoCropperComponent', () => {
  let component: VideoCropperComponent;
  let fixture: ComponentFixture<VideoCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
