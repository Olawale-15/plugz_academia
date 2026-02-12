import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingsystemComponent } from './gradingsystem.component';

describe('GradingsystemComponent', () => {
  let component: GradingsystemComponent;
  let fixture: ComponentFixture<GradingsystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingsystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
