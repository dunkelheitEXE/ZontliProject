import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Login } from './login/login';
import { AuthLayout } from './auth-layout/auth-layout';
import { Home } from './home/home';
import { Signup } from './signup/signup';

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Transfers } from './transfers/transfers';
import { AccountState } from './account-state/account-state';
import { Payment } from './payment/payment';
import { Forgot } from './forgot/forgot';
import { Recovery } from './recovery/recovery';
import { AdminLogin } from './admin-login/admin-login';
import { AdminLayout } from './admin-layout/admin-layout';
import { Dashboard } from './admin/dashboard/dashboard';
import { AdminAuthService } from './services/admin/admin-auth.service';
import { AdminSignup } from './admin-signup/admin-signup';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.adminAuth.isLoggedIn()) {
      return true;
    }
    // Not logged in as admin -> redirect to admin login
    return this.router.createUrlTree(['/login']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    // Not logged in -> redirect to login
    return this.router.createUrlTree(['']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PreventAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      // Already logged in -> redirect to session (home)
      return this.router.createUrlTree(['/session']);
    }
    return true;
  }
}

export const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        canActivate: [PreventAuthGuard],
        children: [
            { path: "", component: Login},
            { path: "signup", component: Signup },
            { path: "forgotPassword", component: Forgot },
            { path: "reset-password", component: Recovery },
            { path: "login", component: AdminLogin },
            { path: 'admin/signup', component: AdminSignup }
        ]
    }, {
        path: 'session',
        component: MainLayout,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: Home },
            { path: "transfers", component: Transfers },
            { path: "com/:user", component: Payment},
            { path: "accountStatement/:user_id/:account_id", component: AccountState }
        ]
    }, {
      path: 'admin',
      component: AdminLayout,
      canActivate: [AdminGuard],
      children: [
        { path: "", component: Dashboard }
      ]
    }
];
