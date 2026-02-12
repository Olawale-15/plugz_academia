import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolprofileComponent } from './schoolprofile.component';

describe('SchoolprofileComponent', () => {
  let component: SchoolprofileComponent;
  let fixture: ComponentFixture<SchoolprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
