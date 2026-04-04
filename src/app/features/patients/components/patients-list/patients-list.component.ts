import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

import { patientList } from '../dummy'
import { Patient } from '../../interfaces/patient.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
    selector: 'app-patients-list',
    imports: [DatePipe, PatientFormComponent, AppointmentFormComponent, PaginationComponent],
    templateUrl: './patients-list.component.html',
    styleUrl: './patients-list.component.css'
})
export class PatientsListComponent 
{
    patients: Patient[] = patientList;
    showPatientForm = false;
    showAppointmentForm = false;

    selectedPatient!: Patient;

    selectedPage = 1;
    pageCount = 7;

    addPatient(p: Patient): void
    {
        this.patients.push(p);
        this.showPatientForm = false;
    }

    onAddApointmentClick(patient: Patient): void
    {
        this.selectedPatient = patient;
        this.showAppointmentForm = true;
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        // ...
    }
}
