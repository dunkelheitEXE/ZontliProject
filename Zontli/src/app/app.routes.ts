import { Routes } from '@angular/router';
import { HomeView } from './views/home-view/home-view';
import { UserLayout } from './user-layout/user-layout';
import { MainLayout } from './main-layout/main-layout';
import { Login } from './views/login/login';
import { Signup } from './views/signup/signup';

export const routes: Routes = [
    {
        path: 'user',
        component: UserLayout,
        children: [
            { path: 'home', component: HomeView }
        ]
    },
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: Login },
            { path: 'signup', component: Signup },
        ]
    }
];
