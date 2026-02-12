import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentsComponent } from './assesments.component';

describe('AssesmentsComponent', () => {
  let component: AssesmentsComponent;
  let fixture: ComponentFixture<AssesmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
