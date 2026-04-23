import { ShiftType } from "../enums/shift-type.enum";

export interface Shift
{
    id: number; // first
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    type: ShiftType;
    officeCity?: string;
    officeNumber?: string;
    officeAddress?: string;
}