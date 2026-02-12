import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmenttypeComponent } from './assesmenttype.component';

describe('AssesmenttypeComponent', () => {
  let component: AssesmenttypeComponent;
  let fixture: ComponentFixture<AssesmenttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesmenttypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesmenttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
