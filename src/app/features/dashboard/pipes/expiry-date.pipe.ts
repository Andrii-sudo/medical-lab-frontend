import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'expiryDatePipe'
})
export class ExpiryDatePipe implements PipeTransform 
{
    transform(value: Date | string): string 
    {
        const sampleExpiryDate = new Date(value);

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const isSameDay = (d1: Date, d2: Date) => 
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        if (isSameDay(sampleExpiryDate, today)) 
        {
            return `Сьогодні`;
        } 
        
        if (isSameDay(sampleExpiryDate, tomorrow)) 
        {
            return `Завтра`;
        }

        return sampleExpiryDate.toLocaleDateString('uk-UA');
    }

}
