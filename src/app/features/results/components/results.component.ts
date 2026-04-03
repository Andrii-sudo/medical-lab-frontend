import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { Result } from '../interfaces/result.interface';
import { ResultStatus } from '../enums/result-status.enum';
import { ResultFormComponent } from './result-form/result-form.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-results',
    imports: [NavbarComponent, ResultFormComponent, FormsModule],
    templateUrl: './results.component.html',
    styleUrl: './results.component.css'
})
export class ResultsComponent 
{
    ResultStatus = ResultStatus;
    searchQuery = '';

    showResultForm = false;
    selectedResult!: Result;

    results: Result[] = 
    [
        {
            id: 1,
            patientFirstName: 'Олександр',
            patientLastName: 'Коваленко',
            patientMiddleName: 'Сергійович',
            orderNumber: 10245,
            sampleType: 'Загальний аналіз крові',
            status: ResultStatus.Abnormal,
            parameters:
            [
                { id: 1, name: 'Гемоглобін',  value: 138, unit: 'г/л',    normMin: 120, normMax: 160 },
                { id: 2, name: 'Еритроцити',  value: 5.9, unit: '10¹²/л', normMin: 3.8, normMax: 5.5 },
                { id: 3, name: 'Лейкоцити',   value: 6.1, unit: '10⁹/л',  normMin: 4.0, normMax: 9.0 },
                { id: 4, name: 'Тромбоцити',  value: 220, unit: '10⁹/л',  normMin: 150, normMax: 400 },
                { id: 5, name: 'ШОЕ',         value: 10,  unit: 'мм/год', normMin: 2,   normMax: 15  },
            ]
        },
        {
            id: 2,
            patientFirstName: 'Марія',
            patientLastName: 'Петренко',
            orderNumber: 10246,
            sampleType: 'Загальний аналіз сечі',
            status: ResultStatus.Normal,
            parameters:
            [
                { id: 6,  name: 'pH',         value: 6.0, unit: '',      normMin: 4.5, normMax: 8.0  },
                { id: 7,  name: 'Білок',       value: 0.1, unit: 'г/л',  normMin: 0,   normMax: 0.14 },
                { id: 8,  name: 'Лейкоцити',   value: 3,   unit: '/мкл', normMin: 0,   normMax: 5    },
            ]
        },
        {
            id: 3,
            patientFirstName: 'Іван',
            patientLastName: 'Мазур',
            patientMiddleName: 'Миколайович',
            orderNumber: 10247,
            sampleType: 'Загальний аналіз крові',
            status: ResultStatus.Pending,
            parameters: 
            [
                { id: 1, name: 'Гемоглобін',  unit: 'г/л',    normMin: 120, normMax: 160 },
                { id: 2, name: 'Еритроцити',  unit: '10¹²/л', normMin: 3.8, normMax: 5.5 },
                { id: 3, name: 'Лейкоцити',   unit: '10⁹/л',  normMin: 4.0, normMax: 9.0 },
                { id: 4, name: 'Тромбоцити',  unit: '10⁹/л',  normMin: 150, normMax: 400 },
                { id: 5, name: 'ШОЕ',         unit: 'мм/год', normMin: 2,   normMax: 15  },
            ]
        }
    ];

    constructor(private router: Router)
    {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { orderNumber: number }; 

        if (state)
        {
            this.searchQuery = state.orderNumber.toString();
        }
    }

    getStatusLabel(resultStatus: ResultStatus)
    {
        switch (resultStatus)
        {
            case ResultStatus.Pending:
                return 'Очікує внесення';
            case ResultStatus.Normal:
                return 'Норма';
            case ResultStatus.Abnormal:
                return 'Відхилення';
        }        
    }

    onEnterResult(result: Result)
    {
        this.selectedResult = result;
        this.showResultForm = true; 
    }

    onReveiwResult(result: Result)
    {
        this.selectedResult = result;        
        this.showResultForm = true; 
    }
}
