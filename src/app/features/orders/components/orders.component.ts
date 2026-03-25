import { Component } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Order } from '../interfaces/order.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-orders',
    imports: [NavbarComponent, ConfirmDialogComponent, DatePipe],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
})
export class OrdersComponent
{
    OrderStatus = OrderStatus;
    
    showOrderForm = false;
    showCancelDialog = false;
    selectedOrderNumber = -1;
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

    onCancelClick(orderNumber: number): void
    {
        const order = this.orders.find(o => o.number === orderNumber);
        
        if (order)
        {
            this.selectedOrderNumber = orderNumber;
            this.dialogTitle = 'Скасувати замовлення';
            this.dialogDescription = `Скасувати замовлення пацієнта ${order.patientLastName} ${order.patientFirstName}?`;
            this.showCancelDialog = true;
        }
    }

    cancelOrder(orderNumber: number): void
    {
        const order = this.orders.find(o => o.number === orderNumber);
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
}
