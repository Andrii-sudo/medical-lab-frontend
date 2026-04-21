import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Order } from '../interfaces/order.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { DatePipe } from '@angular/common';
import { OrderFormComponent } from './order-form/order-form.component';
import { Patient } from '../interfaces/patient.interface';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { SearchType } from '../enums/search-type.enum';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-orders',
    imports: [NavbarComponent, ConfirmDialogComponent, OrderFormComponent, PaginationComponent, FormsModule, RouterLink, DatePipe],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, OnDestroy
{
    private orderService = inject(OrderService);
    private router = inject(Router);

    OrderStatus = OrderStatus;
    SearchType = SearchType;

    showOrderForm = false;

    showCancelDialog = false;
    showPayDialog = false;    
    selectedOrder?: Order;
    dialogTitle = '';
    dialogDescription = '';

    searchTerm = '';
    searchType = SearchType.Number;

    selectedPage = 1;
    pageCount = 1;
    pageSize = 6;

    orders: Order[] = [];

    preselectedPatient?: Patient;

    
    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;
    
    constructor()
    {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as Patient;

        if (state)
        {
            this.preselectedPatient = state;
            this.showOrderForm = true;
        }
    }

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

        
        this.searchSubject.next(value);
    }

    get searchPlaceholder()
    {
        switch (this.searchType)
        {
            case SearchType.Number:
                return 'Введіть номер замовлення';
            case SearchType.Patient:
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

    onAddOrder()
    {
        this.loadPage(this.selectedPage);
        this.showOrderForm = false;
    }

    onPayClick(o: Order): void
    {
        this.selectedOrder = o;
        this.dialogTitle = 'Оплатити замовлення';
        this.dialogDescription = `Оплатити замовлення пацієнта ${o.patientLastName} ${o.patientFirstName}?`;
        this.showPayDialog = true;    
    }

    payOrder(orderNumber: number): void
    {
        this.orderService.payOrder(orderNumber)
            .subscribe(
            {
                next: () => 
                {
                    this.loadPage(this.selectedPage);
                    this.showPayDialog = false;
                },
                error: err => console.error(err)
            });;
    }

    onCancelClick(o: Order): void
    {
        this.selectedOrder = o;
        this.dialogTitle = 'Скасувати замовлення';
        this.dialogDescription = `Скасувати замовлення пацієнта ${o.patientLastName} ${o.patientFirstName}?`;
        this.showCancelDialog = true;    
    }

    cancelOrder(orderNumber: number): void
    {
        this.orderService.cancelOrder(orderNumber)
            .subscribe(
            {
                next: () => 
                {
                    this.loadPage(this.selectedPage);
                    this.showCancelDialog = false;
                },
                error: err => console.error(err)
            });
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        
        this.orderService
            .getOrdersPage(this.selectedPage, this.pageSize, this.searchType, this.searchTerm)
            .subscribe(
            {
                next: orderPage => 
                {
                    this.orders = orderPage.orders;
                    this.pageCount = orderPage.pageCount;
                },
                error: err => console.error(err)
            });
    }
}
