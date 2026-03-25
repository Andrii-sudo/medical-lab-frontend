import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus } from '../../enums/appointment-status.enum';
import { Appointment } from '@features/patients/interfaces/appointment.interface';
import { AppointmentPurpose } from '@features/patients/enums/appointment-purpose.enum';

import { appointments } from '../dummy';
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";


@Component({
    selector: 'app-patients-schedule',
    imports: [DatePipe, FormsModule, ConfirmDialogComponent],
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
    
    showCancelDialog = false;
    showAdvanceDialog = false;
    selectedAppId = -1;
    dialogTitle = '';
    dialogDescription = '';


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
    
    getNextStatus(current: AppointmentStatus): AppointmentStatus | null
    {
        switch (current)
        {
            case AppointmentStatus.Pending:   
                return AppointmentStatus.Arrived;
            case AppointmentStatus.Arrived:   
                return AppointmentStatus.Completed;
            default:                          
                return null;
        }
    }

    onAdvanceClick(appId: number): void
    {
        const app = this.appointments.find((a) => a.id === appId);

        if (app)
        {
            this.selectedAppId = appId;
            this.dialogTitle = 'Змінити статус візиту';
            this.dialogDescription = `Перевесити візит пацієнта ${app.patientLastName} ${app.patientFirstName} \
                                      у статус ${this.getStatusLabel(this.getNextStatus(app.status)!)}?`;
            this.showAdvanceDialog = true;
        }
    }

    advanceAppointment(appId: number)
    {
        for (let i = 0; i < this.appointments.length; i++)
        {
            if (this.appointments[i].id === appId)
            {
                const newStatus = this.getNextStatus(this.appointments[i].status);
                if (newStatus)
                    this.appointments[i].status = newStatus;
                break;
            }
        }

        this.showAdvanceDialog = false;
    }

    onCancelClick(appId: number): void
    {
        const app = this.appointments.find((a) => a.id === appId);
        
        if (app)
        {
            this.selectedAppId = appId;
            this.dialogTitle = 'Скасувати візит';
            this.dialogDescription = `Скасувати запис пацієнта ${app.patientLastName} ${app.patientFirstName}`;
            this.showCancelDialog = true;
        }
    }

    cancelAppointment(appId: number): void
    {
        for (let i = 0; i < this.appointments.length; i++)
        {
            if (this.appointments[i].id === appId)
            {
                this.appointments[i].status = AppointmentStatus.Cancelled;
                break;
            }
        }

        this.showCancelDialog = false;
    }
}
