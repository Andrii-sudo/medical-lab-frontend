import { Routes } from '@angular/router';
import { LoginComponent } from '@core/auth/login/login.component'
import { DashboardComponent } from '@features/dashboard/components/dashboard.component';
import { PatientsComponent } from '@features/patients/components/patients.component';
import { OrdersComponent } from '@features/orders/components/orders.component';
import { SamplesComponent } from '@features/samples/components/samples.component';
import { ResultsComponent } from '@features/results/components/results.component';

export const routes: Routes = [
    { path: 'login',     component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'patients',  component: PatientsComponent },
    { path: 'orders',    component: OrdersComponent },
    { path: 'samples',   component: SamplesComponent },
    { path: 'results',   component: ResultsComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } // Не знайдено -> login 
];
