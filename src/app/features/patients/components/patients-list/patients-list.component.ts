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
    showAddPatientForm = false;
    showEditPatientForm = false;
    showAppointmentForm = false;

    selectedPatient!: Patient;

    selectedPage = 1;
    pageCount = 7;

    onAddPatientClick(): void
    {
        this.showAddPatientForm = true;
    }

    onAddAppointmentClick(p: Patient): void
    {
        this.selectedPatient = p;
        this.showAppointmentForm = true;
    }

    onEditPatientClick(p: Patient): void
    {
        this.selectedPatient = p;
        this.showEditPatientForm = true;
    }

    addPatient(p: Patient): void
    {
        this.patients.push(p);
        this.showAddPatientForm = false;
    }

    editPatient(p: Patient): void
    {
        //...
        this.showEditPatientForm = false;
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        // ...
    }
}
