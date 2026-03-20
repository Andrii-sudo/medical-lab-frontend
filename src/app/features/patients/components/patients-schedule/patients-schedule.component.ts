import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus } from '../../enums/appointment-status.enum';
import { Appointment } from '@features/patients/interfaces/appointment.interface';
import { AppointmentPurpose } from '@features/patients/enums/appointment-purpose.enum';

import { appointments } from '../dummy';

@Component({
    selector: 'app-patients-schedule',
    imports: [DatePipe, FormsModule],
    templateUrl: './patients-schedule.component.html',
    styleUrl: './patients-schedule.component.css'
})
export class PatientsScheduleComponent 
{
    AppointmentStatus = AppointmentStatus;
    AppointmentPurpose = AppointmentPurpose;

    appointments: Appointment[] = appointments; 

    selectedDate = new Date();
    selectedStatus?: AppointmentStatus;  

    shiftDay(delta: number): void
    {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + delta);

        this.selectedDate = newDate;
    }

    setToday(): void
    {
        this.selectedDate = new Date();
    }

    get filteredAppointments(): Appointment[]
    {
        return this.appointments.filter((a) => this.selectedStatus === undefined || a.status === this.selectedStatus);
    } 

    isPast(date: Date | string): boolean 
    {
        const appointmentDate = new Date(date);
        const now = new Date();
        
        return appointmentDate.getTime() < now.getTime();
    }

    getPurposeLabel(ap: AppointmentPurpose): string
    {
        switch (ap)
        {
            case AppointmentPurpose.FirstVisit:
                return 'Перший візит';
            case AppointmentPurpose.Sample:
                return 'Здача зразка';
            case AppointmentPurpose.Results:
                return 'Забрати результати';
        }
    }

    getStatusLabel(as: AppointmentStatus): string
    {
        switch (as)
        {
            case AppointmentStatus.Pending:
                return 'Очікується';
            case AppointmentStatus.Arrived:
                return 'Прибув';
            case AppointmentStatus.Completed:
                return 'Завершено';
            case AppointmentStatus.Cancelled:
                return 'Скасовано';
        }
    }
}
