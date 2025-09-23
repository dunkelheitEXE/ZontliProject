import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Transfers } from './transfers/transfers';
import { Signup } from './signup/signup';
import { AuthLayout } from './auth-layout/auth-layout';
import { MainLayout } from './main-layout/main-layout';
import { Movements } from './movements/movements';
import { Cards } from './cards/cards';
import { HelpAndSupport } from './help-and-support/help-and-support';

export const routes: Routes = [
  {
    path: 'session',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'transfers', component: Transfers },
      { path: 'movements', component: Movements },
      { path: 'cards', component: Cards },
      { path: 'help-and-support', component: HelpAndSupport }
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', component: Login },
      { path: 'signup', component: Signup }
    ]
  },
];
