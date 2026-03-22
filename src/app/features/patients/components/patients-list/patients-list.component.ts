import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { patientList } from '../dummy'
import { Patient } from '../../interfaces/patient.interface';

@Component({
    selector: 'app-patients-list',
    imports: [DatePipe, PatientFormComponent],
    templateUrl: './patients-list.component.html',
    styleUrl: './patients-list.component.css'
})
export class PatientsListComponent 
{
    patients: Patient[] = patientList;
    showPatientForm = false;

    addPatient(p: Patient): void
    {
        this.patients.push(p);
        this.showPatientForm = false;
    }
}
