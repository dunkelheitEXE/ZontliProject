import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Transfers } from './transfers/transfers';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'transfers', component: Transfers }
];
