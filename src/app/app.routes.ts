import { Routes } from '@angular/router';
import { LoginComponent } from '@features/login/components/login.component'
import { DashboardComponent } from '@features/dashboard/components/dashboard.component';
import { PatientsComponent } from '@features/patients/components/patients.component';
import { OrdersComponent } from '@features/orders/components/orders.component';
import { SamplesComponent } from '@features/samples/components/samples.component';

export const routes: Routes = [
    { path: 'login',     component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'patients',  component: PatientsComponent },
    { path: 'orders',    component: OrdersComponent },
    { path: 'samples',   component: SamplesComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } // Не знайдено -> login 
];
