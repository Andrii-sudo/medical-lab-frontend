import { Sample } from "./interfaces/sample.interface";
import { Shift } from "./interfaces/shift.interface"

export const shifts: Shift[] = [
    {
        day: 'Ср',
        city: 'Львів',
        officeNumber: 1,
        startTime: '9:00',
        endTime: '18:00',
    },
    {
        day: 'Чт',
        city: 'Львів',
        officeNumber: 1,
        startTime: '10:00',
        endTime: '18:00',
    },
    {
        day: 'Пт',
        city: 'Львів',
        officeNumber: 3,
        startTime: '9:00',
        endTime: '18:00',
    },
    {
        day: 'Сб',
        city: 'Львів',
        officeNumber: 1,
        startTime: '9:00',
        endTime: '18:00',
    },
    {
        day: 'Нд',
        city: 'Львів',
        officeNumber: 3,
        startTime: '10:00',
        endTime: '19:00',
    },
    {
        day: 'Пн',
        city: 'Львів',
        officeNumber: 4,
        startTime: '10:00',
        endTime: '20:00',
    },
    {
        day: 'Вт',
        city: 'Львів',
        officeNumber: 1,
        startTime: '9:00',
        endTime: '18:00',
    },
];

export const samples: Sample[] = [
    {
        type: 'Кров',
        expiresAt: new Date(new Date().setHours(18, 0, 0, 0))
    },
    {
        type: 'Кров',
        expiresAt: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(19, 0, 0, 0))
    },
    {
        type: 'Кров',
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 2))
    },
    {
        type: 'Кров',
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 3))
    },
    {
        type: 'Кров',
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 4))
    },
    {
        type: 'Кров',
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 5))
    },
    {
        type: 'Кров',
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 6))
    }
];
