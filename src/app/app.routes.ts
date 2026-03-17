import { Routes } from '@angular/router';
import { LoginComponent } from '@features/login/components/login.component'
import { DashboardComponent } from '@features/dashboard/components/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } // Не знайдено -> login 
];
