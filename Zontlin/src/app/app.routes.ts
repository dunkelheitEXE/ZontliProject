import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Transfers } from './transfers/transfers';
import { Signup } from './signup/signup';
import { AuthLayout } from './auth-layout/auth-layout';
import { MainLayout } from './main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'session',
    component: MainLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'transfers', component: Transfers }
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'signup', component: Signup }
    ]
  },
];
