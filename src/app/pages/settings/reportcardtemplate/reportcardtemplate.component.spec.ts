import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportcardtemplateComponent } from './reportcardtemplate.component';

describe('ReportcardtemplateComponent', () => {
  let component: ReportcardtemplateComponent;
  let fixture: ComponentFixture<ReportcardtemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportcardtemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportcardtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
