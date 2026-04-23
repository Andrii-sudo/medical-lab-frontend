import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus } from '../../enums/appointment-status.enum';
import { Appointment } from '@features/patients/interfaces/appointment.interface';
import { AppointmentPurpose } from '@features/patients/enums/appointment-purpose.enum';

import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { RouterLink } from '@angular/router';
import { AppointmentService } from '@features/patients/services/appointment.service';
import { SelectedOfficeService } from '@core/services/selected-office.service';
import { AuthService } from '@core/auth/auth.service';
import { UserRole } from '@core/auth/user-role.enum';
import { OfficeService } from '@core/services/office.service';
import { Office } from '../../../patients/interfaces/office.interface';

@Component({
    selector: 'app-patients-schedule',
    imports: [ConfirmDialogComponent, FormsModule, CommonModule, RouterLink],
    templateUrl: './patients-schedule.component.html',
    styleUrl: './patients-schedule.component.css'
})
export class PatientsScheduleComponent 
{
    private authService = inject(AuthService);
    private appointmentService = inject(AppointmentService);
    private selcOfficeService = inject(SelectedOfficeService);
    private officeService = inject(OfficeService);
    
    UserRole = UserRole;
    userRole = this.authService.userRole;
    

    AppointmentStatus = AppointmentStatus;
    AppointmentPurpose = AppointmentPurpose;

    appointments: Appointment[] = []; 

    selectedDate = new Date();
    selectedStatus: AppointmentStatus | null = null;  
    
    showCancelDialog = false;
    showAdvanceDialog = false;
    selectedAppId = -1;
    dialogTitle = '';
    dialogDescription = '';

    // Для адміна
    cities: string[] = [];
    offices: Office[] = [];
    selectedCity = '';
    selectedOfficeId: number | '' = '';

    constructor() 
    {   
        effect(() => 
        {
            if (this.userRole() === UserRole.Employee)
            {
                const currentOffice = this.selcOfficeService.selectedOffice();
                if (currentOffice)
                {
                    this.loadAppointments(currentOffice.id);
                }
            }
        });    
    }

    ngOnInit(): void 
    {
        if (this.userRole() === UserRole.Admin)
        {
            this.officeService.getCities().subscribe(
            {
                next: cities => this.cities = cities.sort(),
                error: err => console.error(err)
            });
        }
    }

    onCityChange()
    {
        if (!this.selectedCity) return;
        
        this.officeService.getOffices(this.selectedCity, null)
            .subscribe(
            {
                next: offices => 
                {
                    this.offices = offices;
                    this.selectedOfficeId = ''; 
                    this.appointments = [];     
                },
                error: err => console.error(err)
            });
    }

    onOfficeChange()
    {
        if (this.selectedOfficeId)
        {
            this.loadAppointments(Number(this.selectedOfficeId));
        }
    }

    private reloadCurrentOffice(): void
    {
        if (this.userRole() === UserRole.Employee)
        {
            const office = this.selcOfficeService.selectedOffice();
            if (office) this.loadAppointments(office.id);
        }
        else if (this.userRole() === UserRole.Admin)
        {
            if (this.selectedOfficeId) this.loadAppointments(Number(this.selectedOfficeId));
        }
    }

    loadAppointments(officeId: number): void
    {
        this.appointmentService
            .getDailyAppointments(officeId, this.selectedDate)
            .subscribe(
            {
                next: appointments => this.appointments = appointments,
                error: err => console.error(err)
            });
    }

    shiftDay(delta: number): void
    {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + delta);

        this.selectedDate = newDate;
        this.reloadCurrentOffice();
    }

    setToday(): void
    {
        this.selectedDate = new Date();
        this.reloadCurrentOffice();
    }

    get filteredAppointments(): Appointment[]
    {
        return this.appointments.filter((a) => this.selectedStatus === null || a.status === this.selectedStatus);
    } 

    isPast(visitTime: string): boolean 
    {
        const [hours, minutes] = visitTime.split(':').map(Number);
    
        const appointmentDate = new Date(this.selectedDate);
        appointmentDate.setHours(hours, minutes, 0, 0);

        const now = new Date();
        
        return appointmentDate.getTime() < now.getTime();
    }

    getPurposeLabel(app: AppointmentPurpose): string
    {
        switch (app)
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
        this.appointmentService.advanceAppointment(appId)
            .subscribe(
            {
                next: () => 
                {
                    this.reloadCurrentOffice();
                    this.showAdvanceDialog = false;
                },
                error: err => console.error(err)
            });
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
        this.appointmentService.cancelAppointment(appId)
            .subscribe(
            {
                next: () => 
                {
                    this.reloadCurrentOffice();
                    this.showCancelDialog = false
                },
                error: err => console.error(err)
            });
    }
}
