import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicfieldsComponent } from './dynamicfields.component';

describe('DynamicfieldsComponent', () => {
  let component: DynamicfieldsComponent;
  let fixture: ComponentFixture<DynamicfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicfieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
