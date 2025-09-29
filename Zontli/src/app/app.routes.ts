import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';
import { Login } from './login/login';
import { AuthLayout } from './auth-layout/auth-layout';
import { Home } from './home/home';
import { Signup } from './signup/signup';

export const routes: Routes = [
    {
        path: '', 
        component: AuthLayout, 
        children: [
            { path: "", component: Login},
            { path: "signup", component: Signup }
        ]
    }, {
        path: 'session',
        component: MainLayout,
        children: [
            { path: "", component: Home },
            { path: "signup", component: Signup }
        ]
    }
];
