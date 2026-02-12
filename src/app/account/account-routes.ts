import { Routes } from '@angular/router';
export const accountRoutes: Routes = [
  {
    path: 'signin',
    loadChildren: () => import('./login/login.routes').then(m => m.loginRoute),
  },
]
