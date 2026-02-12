import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassessectionComponent } from './classessection.component';

describe('ClassessectionComponent', () => {
  let component: ClassessectionComponent;
  let fixture: ComponentFixture<ClassessectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassessectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassessectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
