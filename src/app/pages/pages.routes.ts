import { Routes } from "@angular/router";

export const pagesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      icon: 'home'
    },
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DashboardRoutes)
  },
  {
    path: 'administration',
    data: {
      title: 'Academics',
      breadcrumb: 'Academics',
      icon: 'book-open'
    },
    loadChildren: () => import('./administration/academics.routes').then(m => m.academicsRoutes)
  },

  {
    path: 'student',
    data: {
      title: 'Students',
      breadcrumb: 'Students',
      icon: 'users'
    },
    loadChildren: () => import('./enrollment/student.routes').then(m => m.studentRoutes)
  },
  {
    path: 'staff',
    data: {
      title: 'Staff',
      breadcrumb: 'Staff',
      icon: 'user-check'
    },
    loadChildren: () => import('./staff/staff.routes').then(m => m.staffRoutes)
  },
  {
    path: 'academics',
    data: {
      title: 'Assessments',
      breadcrumb: 'Assessments',
      icon: 'clipboard-list'
    },
    loadChildren: () => import('./Academics/assesments.routes').then(m => m.assessmentsRoutes)
  },
  {
    path: 'settings',
    data: {
      title: 'Settings',
      breadcrumb: 'Settings',
      icon: 'settings'
    },
    loadChildren: () => import('./settings/settings.routes').then(m => m.settingsRoutes)
  }
];
