import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { patientList } from '../dummy'
import { Patient } from '@features/patients/interfaces/patient.interface';

@Component({
    selector: 'app-patients-list',
    imports: [DatePipe],
    templateUrl: './patients-list.component.html',
    styleUrl: './patients-list.component.css'
})
export class PatientsListComponent 
{
    patients: Patient[] = patientList;
}
