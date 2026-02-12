import { Routes } from "@angular/router";

import { AssesmenttypeComponent } from "./assesmenttype/assesmenttype.component";
import { GradingsystemComponent } from "./gradingsystem/gradingsystem.component";
import { MarkentryComponent } from "./markentry/markentry.component";
import { ReportcardComponent } from "./reportcard/reportcard.component";

export const assessmentsRoutes: Routes = [
  {
    path: 'assessment',
    component: AssesmenttypeComponent,
    data: {
      title: 'Assessment',
      breadcrumb: 'Assessment',
      icon: 'clipboard-list'
    }
  },
  {
    path: 'resultcomputation',
    component: GradingsystemComponent,
    data: {
      title: 'Result Computation',
      breadcrumb: 'Result Computation',
      icon: 'award'
    }
  },
  {
    path: 'markentry',
    component: MarkentryComponent,
    data: {
      title: 'Mark Entry',
      breadcrumb: 'Mark Entry',
      icon: 'edit-3'
    }
  },
  {
    path: 'reportcard',
    component: ReportcardComponent,
    data: {
      title: 'Report Card',
      breadcrumb: 'Report Card',
      icon: 'file-text'
    }
  }
]
