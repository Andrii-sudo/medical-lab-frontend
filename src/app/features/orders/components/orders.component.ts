import { Component } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Order } from '../interfaces/order.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { DatePipe } from '@angular/common';
import { OrderFormComponent } from './order-form/order-form.component';
import { PatientLookup } from '../interfaces/patient-lookup.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-orders',
    imports: [NavbarComponent, ConfirmDialogComponent, OrderFormComponent, DatePipe],
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

    orders: Order[] = 
    [
        {
            patientFirstName: 'Олександр',
            patientLastName: 'Коваленко',
            patientMiddleName: 'Сергійович',
            number: 10245,
            createdDate: new Date('2026-03-15'),
            analyses: ['Загальний аналіз крові', 'Глюкоза'],
            status: OrderStatus.Completed,
            price: 450.00
        },
        {
            patientFirstName: 'Марія',
            patientLastName: 'Петренко',
            number: 10246,
            createdDate: new Date('2026-03-20'),
            analyses: ['Тиреотропний гормон (ТТГ)'],
            status: OrderStatus.InProgress,
            price: 320.50
        },
        {
            patientFirstName: 'Іван',
            patientLastName: 'Мазур',
            patientMiddleName: 'Миколайович',
            number: 10247,
            createdDate: new Date('2026-03-24'),
            analyses: ['Вітамін D', 'Феритин', 'Магній'],
            status: OrderStatus.Pending,
            price: 1280.00
        },
        {
            patientFirstName: 'Олена',
            patientLastName: 'Сидоренко',
            patientMiddleName: 'Вікторівна',
            number: 10248,
            createdDate: new Date('2026-03-22'),
            analyses: ['ПЛР-тест на COVID-19'],
            status: OrderStatus.Cancelled,
            price: 600.00
        }
    ];

    preselectedPatient?: PatientLookup;

    constructor(private router: Router)
    {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as PatientLookup;

        if (state)
        {
            this.preselectedPatient = state;
            this.showOrderForm = true;
        }
    }

    getStatusLabel(orderStatus: OrderStatus): string
    {
        switch (orderStatus)
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

    onCancelClick(order: Order): void
    {
        this.selectedOrder = order;
        this.dialogTitle = 'Скасувати замовлення';
        this.dialogDescription = `Скасувати замовлення пацієнта ${order.patientLastName} ${order.patientFirstName}?`;
        this.showCancelDialog = true;    
    }

    onCollectSampleClick(order: Order)
    {
        this.router.navigate(['samples'], 
        {
            state:
            {
                orderNumber: order.number
            }
        });
    }

    onEnterResultClick(order: Order)
    {
        this.router.navigate(['results'], 
        {
            state:
            {
                orderNumber: order.number
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
}
