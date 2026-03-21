import { Component } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientsScheduleComponent } from './patients-schedule/patients-schedule.component';
import { PatientTab } from '../enums/patient-tab.enum';


@Component({
    selector: 'app-patients',
    imports: [NavbarComponent, PatientsListComponent, PatientsScheduleComponent],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.css'
})
export class PatientsComponent 
{
    PatientTab = PatientTab; // Для доступу з HTML
    activeTab: PatientTab = PatientTab.All;
    
}
