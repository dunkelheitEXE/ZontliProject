import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Login } from './login/login';
import { AuthLayout } from './auth-layout/auth-layout';
import { Home } from './home/home';
import { Signup } from './signup/signup';

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

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
            { path: "signup", component: Signup }
        ]
    }, {
        path: 'session',
        component: MainLayout,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: Home },
            { path: "signup", component: Signup }
        ]
    }
];




