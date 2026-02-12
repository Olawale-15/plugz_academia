import { Routes } from "@angular/router";
import { ClassessectionComponent } from "./classessection/classessection.component";
import { SubjectsComponent } from "./subjects/subjects.component";
import { GradingsystemComponent } from "./gradingsystem/gradingsystem.component";

export const academicsRoutes: Routes = [
  {
    path: 'classes',
    component: ClassessectionComponent,
    data: {
      title: 'Classes',
      breadcrumb: 'Classes',
      icon: 'sliders'
    }
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    data: {
      title: 'Subjects',
      breadcrumb: 'Subjects',
      icon: 'book-open'
    }
  },
  {
    path: 'grading-system',
    component: GradingsystemComponent,
    data: {
      title: 'Grading System',
      breadcrumb: 'Grading System',
      icon: 'award'
    }
  }
]
