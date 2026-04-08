import { Component, inject } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Order } from '../interfaces/order.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { DatePipe } from '@angular/common';
import { OrderFormComponent } from './order-form/order-form.component';
import { PatientLookup } from '../interfaces/patient-lookup.interface';
import { Router } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-orders',
    imports: [NavbarComponent, ConfirmDialogComponent, OrderFormComponent, PaginationComponent, FormsModule, DatePipe],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
})
export class OrdersComponent
{
    OrderStatus = OrderStatus;
    
    showOrderForm = false;

    showCancelDialog = false;
    selectedOrder?: Order;
    dialogTitle = '';
    dialogDescription = '';

    searchQuery = '';
    searchType: 'number' | 'patient' = 'number';

    selectedPage = 1;
    pageCount = 7;

    orders: Order[] = 
    [
        {
            patientFirstName: 'Олександр',
            patientLastName: 'Коваленко',
            patientPhone: '+380501234567',
            number: 10245,
            createdDate: new Date('2026-03-15'),
            analyses: ['Загальний аналіз крові', 'Глюкоза'],
            status: OrderStatus.Completed,
            price: 450.00
        },
        {
            patientFirstName: 'Марія',
            patientLastName: 'Петренко',
            patientPhone: '+380679876543',
            number: 10246,
            createdDate: new Date('2026-03-20'),
            analyses: ['Тиреотропний гормон (ТТГ)'],
            status: OrderStatus.InProgress,
            price: 320.50
        },
        {
            patientFirstName: 'Іван',
            patientLastName: 'Мазур',
            patientPhone: '+380931112233',
            number: 10247,
            createdDate: new Date('2026-03-24'),
            analyses: ['Вітамін D', 'Феритин', 'Магній'],
            status: OrderStatus.Pending,
            price: 1280.00
        },
        {
            patientFirstName: 'Олена',
            patientLastName: 'Сидоренко',
            patientPhone: '+380664445566',
            number: 10248,
            createdDate: new Date('2026-03-22'),
            analyses: ['ПЛР-тест на COVID-19'],
            status: OrderStatus.Cancelled,
            price: 600.00
        }
    ];

    preselectedPatient?: PatientLookup;

    private router = inject(Router);

    constructor()
    {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as PatientLookup;

        if (state)
        {
            this.preselectedPatient = state;
            this.showOrderForm = true;
        }
    }

    get searchPlaceholder()
    {
        switch (this.searchType)
        {
            case 'number':
                return 'Введіть номер замовлення';
            case 'patient':
                return 'Введіть ім\'я або тел. номер пацієнта';
        }
        return 'Пошук замовлення';
    }

    getStatusLabel(os: OrderStatus): string
    {
        switch (os)
        {
            case OrderStatus.Unpaid:
                return 'Очікує оплату';
            case OrderStatus.Pending:
                return 'Очікує здачу зразків';
            case OrderStatus.InProgress:
                return 'Проводиться дослідження';
            case OrderStatus.Completed:
                return 'Завершено';
            case OrderStatus.Cancelled:
                return 'Скасовано';
        }
    }

    onCancelClick(o: Order): void
    {
        this.selectedOrder = o;
        this.dialogTitle = 'Скасувати замовлення';
        this.dialogDescription = `Скасувати замовлення пацієнта ${o.patientLastName} ${o.patientFirstName}?`;
        this.showCancelDialog = true;    
    }

    onCollectSampleClick(o: Order)
    {
        this.router.navigate(['samples'], 
        {
            state:
            {
                orderNumber: o.number
            }
        });
    }

    onEnterResultClick(o: Order)
    {
        this.router.navigate(['results'], 
        {
            state:
            {
                orderNumber: o.number
            }
        });
    }

    cancelOrder(orderNumber: number): void
    {
        for (let i = 0; i < this.orders.length; i++)
        {
            if (this.orders[i].number === orderNumber)
            {
                this.orders[i].status = OrderStatus.Cancelled;
                break;
            }
        }

        this.showCancelDialog = false;
    }

    addOrder(): void
    {

    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        // ...
    }
}
