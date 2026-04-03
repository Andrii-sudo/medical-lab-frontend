import { Component } from '@angular/core';
import { Sample } from '../interfaces/sample.interface';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SampleStatus } from '../enums/sample-status.enum';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavigationState } from '../interfaces/navigation-state.interface';

@Component({
    selector: 'app-samples',
    imports: [NavbarComponent, ConfirmDialogComponent, FormsModule, DatePipe],
    templateUrl: './samples.component.html',
    styleUrl: './samples.component.css'
})
export class SamplesComponent 
{
    SampleStatus = SampleStatus;

    searchQuery = '';
    searchType: string = 'order';

    showCollectDialog = false;
    selectedSample?: Sample;
    dialogTitle = '';
    dialogDescription = '';

    samples: Sample[] = 
    [
        {
            id: 1,
            patientFirstName: 'Олександр',
            patientLastName: 'Коваленко',
            patientMiddleName: 'Сергійович',
            orderNumber: 10245,
            type: 'Кров',
            status: SampleStatus.Collected,
            collectionDate: new Date('2026-03-25'),
            expiryDate: new Date('2026-03-26')
        },
        {
            id: 2,
            patientFirstName: 'Марія',
            patientLastName: 'Петренко',
            orderNumber: 10246,
            type: 'Сеча',
            status: SampleStatus.Waiting
        },
        {
            id: 3,
            patientFirstName: 'Іван',
            patientLastName: 'Мазур',
            patientMiddleName: 'Миколайович',
            orderNumber: 10247,
            type: 'Кров',
            status: SampleStatus.Analyzed,
            collectionDate: new Date('2026-03-24'),
            expiryDate: new Date('2026-03-25')
        }
    ];
    
    constructor(private router: Router)
    {
        const navigation = this.router.getCurrentNavigation();
        let state = navigation?.extras.state as NavigationState;

        if (state)
        {
            if (state.orderNumber)
            {
                this.searchQuery = state.orderNumber.toString();
                this.searchType = 'order';
            }
            else if (state.patientName)
            {
                this.searchQuery = state.patientName;
                this.searchType = 'patient';
            }
        }
    }

    getStatusLabel(sampleStatus: SampleStatus): string
    {
        switch (sampleStatus)
        {
            case SampleStatus.Waiting:
                return "Очікує збору";
            case SampleStatus.Collected:
                return "Зібраний";
            case SampleStatus.Analyzed:
                return "Досліджений";
            case SampleStatus.Expired:
                return "Протермінований";
        }
    }

    collectSample(sampleId: number): void
    {
        for (let i = 0; i < this.samples.length; i++)
        {
            if (this.samples[i].id === sampleId)
            {
                this.samples[i].status = SampleStatus.Collected;
                this.samples[i].collectionDate = new Date();
                this.samples[i].expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
                break;
            }
        }

        this.showCollectDialog = false;
    }

    onCollectClick(sample: Sample): void
    {
        this.selectedSample = sample;    
        this.dialogTitle = 'Зібрати зразок';
        this.dialogDescription = `Зібрати зразок пацієнта ${sample.patientLastName} ${sample.patientFirstName}?`;
        this.showCollectDialog = true;
    }

    onEnterResultClick(sample: Sample)
    {
        this.router.navigate(['results'], 
        {
            state:
            {
                orderNumber: sample.orderNumber
                //
            }
        });
    }

    onResultClick(sample: Sample)
    {

        this.router.navigate(['results'], 
        {
            state:
            {
                orderNumber: sample.orderNumber
                //
            }
        });
    }
}
