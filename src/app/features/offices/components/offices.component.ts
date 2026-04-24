import { Component, inject, OnInit } from '@angular/core';
import { Office } from '@core/interfaces/office.interface';
import { OfficeService } from '@core/services/office.service';
import { NavbarComponent } from "@shared/components/navbar/navbar.component";
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { OfficeFormComponent } from './office-form/office-form.component';
import { FormsModule } from '@angular/forms';
import { OfficeType } from '@core/enums/office-type';
import { OfficeScheduleModalComponent } from './office-schedule-modal/office-schedule-modal.component';

@Component({
    selector: 'app-offices',
    imports: [NavbarComponent, PaginationComponent, OfficeFormComponent, OfficeScheduleModalComponent, FormsModule],
    templateUrl: './offices.component.html',
    styleUrl: './offices.component.css'
})
export class OfficesComponent implements OnInit
{
    private officeService = inject(OfficeService);

    cities: string[] = [];
    selectedCity = '';
    selectedType = '';

    offices: Office[] = [];

    selectedOffice: Office | null = null;
    showScheduleForm = false;

    showAddOfficeForm = false;

    selectedPage = 1;
    pageCount = 1;
    pageSize = 7;

    ngOnInit(): void 
    {
        this.officeService.getCities().subscribe(
        {
            next: cities => this.cities = cities,
            error: err => console.error(err)
        });

        this.loadPage(1);
    }

    getOfficeTypeLabel(ot: OfficeType): string
    {
        switch (ot)
        {
            case OfficeType.Collection:
                return 'Пункт забору';
            case OfficeType.Analysis:
                return 'Лабораторія';
            case OfficeType.Mixed:
                return 'Змішаний';
        }
    }

    onFilterChange(): void
    {
        this.loadPage(1);
    }

    onAddOfficeClick(): void
    {
        this.showAddOfficeForm = true;
    }

    onOfficeAdded(): void
    {
        this.showAddOfficeForm = false;

        this.officeService.getCities().subscribe(
        {
            next: cities => this.cities = cities,
            error: err => console.error(err)
        });

        this.loadPage(1);
    }

    onOfficeScheduleClick(office: Office): void
    {
        this.selectedOffice = office;
        this.showScheduleForm = true;
    }

    onScheduleSaved(): void
    {
        this.showScheduleForm = false;
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        
        this.officeService.getOfficesPage(this.selectedPage, this.pageSize, this.selectedCity || null, this.selectedType || null)
            .subscribe(
            {
                next: officePage => 
                {
                    this.offices = officePage.offices;
                    this.pageCount = officePage.pageCount;
                },
                error: err => console.error(err)
            });
    }
}
