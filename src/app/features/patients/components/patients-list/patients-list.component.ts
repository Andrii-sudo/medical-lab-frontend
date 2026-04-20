import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

import { Patient } from '../../interfaces/patient.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PatientsListService } from '@features/patients/services/patients-list.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-patients-list',
    imports: [DatePipe, PatientFormComponent, AppointmentFormComponent, PaginationComponent],
    templateUrl: './patients-list.component.html',
    styleUrl: './patients-list.component.css'
})
export class PatientsListComponent implements OnInit, OnDestroy
{
    private patientsListService = inject(PatientsListService);

    patients: Patient[] = [];
    showAddPatientForm = false;
    showEditPatientForm = false;
    showAppointmentForm = false;

    selectedPatient!: Patient;

    searchTerm = '';
    selectedPage = 1;
    pageCount = 1;
    pageSize = 5;

    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;

    ngOnInit(): void 
    {
        this.loadPage(1);

        this.searchSub = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => 
        {
            this.searchTerm = term;
            this.loadPage(1);
        });
    }

    ngOnDestroy(): void 
    {
        this.searchSub.unsubscribe();
    }

    onSearchChange(e: Event): void
    {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();

        if (value.length !== 1)
        {
            this.searchSubject.next(value);
        }
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        this.patientsListService.getPatientsPage(this.selectedPage, this.pageSize, this.searchTerm)
            .subscribe(
            {   
                next: patientPage => 
                {   
                    this.patients = patientPage.patients;
                    this.pageCount = patientPage.pageCount;
                },
                error: err => console.error(err)
            });
    }

    onAddPatientClick(): void
    {
        this.showAddPatientForm = true;
    }

    onAddPatient(): void
    {
        this.showAddPatientForm = false;
        
        this.searchTerm = '';
        this.loadPage(1);
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

    onEditPatient(): void
    {
        this.showEditPatientForm = false;

        this.loadPage(this.selectedPage);
    }
}
