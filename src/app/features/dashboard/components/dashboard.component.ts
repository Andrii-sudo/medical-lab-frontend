import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { Shift } from '../interfaces/shift.interface';
import { Sample } from '../interfaces/sample.interface';

//
import { shifts, samples } from '../dummy'
//

@Component({
    selector: 'app-dashboard',
    imports: [NavbarComponent, CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent
{
    today = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

    plannedVisitors:   number;
    pendingSamples:    number;
    processingSamples: number;
    completedResults:  number;

    shifts : Shift[];
    samples : Sample[];

    constructor()
    {
        this.plannedVisitors = 12;
        this.pendingSamples = 4;
        this.processingSamples = 6;
        this.completedResults = 3;
    
        this.shifts = shifts;
        this.samples = samples;
    }

    getSampleStatus(sampleExpiryDate: Date): string
    {
        const now = new Date();
        const diffInHours = (sampleExpiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffInHours <= 24) 
        {
            return 'dot-red';
        }
        
        if (diffInHours <= 72) 
        {
            return 'dot-yellow';
        }
        
        return 'dot-green';
    }

    formatExpiryDate(sampleExpiryDate: Date): string
    {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const isSameDay = (d1: Date, d2: Date) => 
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        const timeStr = `${sampleExpiryDate.getHours()}:${sampleExpiryDate.getMinutes().toString().padStart(2, '0')}`; 
        
        if (isSameDay(sampleExpiryDate, today)) 
        {
            return `Сьогодні о ${timeStr}`;
        } 
        
        if (isSameDay(sampleExpiryDate, tomorrow)) 
        {
            return `Завтра о ${timeStr}`;
        }

        return sampleExpiryDate.toLocaleDateString('uk-UA');
    }
}
