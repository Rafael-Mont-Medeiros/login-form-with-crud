import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/services/auth-guard/auth.guard';

export const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: LoginComponent
  },

  {
    path:'login', component: LoginComponent
  },

  {
    path:'dashboard',
    loadComponent: ()=> import('./components/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  }
];
