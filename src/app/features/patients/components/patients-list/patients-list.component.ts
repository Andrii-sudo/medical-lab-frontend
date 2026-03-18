import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { patientList } from '../dummy'
import { PatientListItem } from '@features/patients/interfaces/patient-list-item';

@Component({
    selector: 'app-patients-list',
    imports: [DatePipe],
    templateUrl: './patients-list.component.html',
    styleUrl: './patients-list.component.css'
})
export class PatientsListComponent 
{
    patients: PatientListItem[] = patientList;
}
