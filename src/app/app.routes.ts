import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './account/login/login.component';
import { accountRoutes } from './account/account-routes';
import { pagesRoutes } from './pages/pages.routes';
import { AuthGuard } from './core/guard/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'account',
    children: accountRoutes,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: pagesRoutes,
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
