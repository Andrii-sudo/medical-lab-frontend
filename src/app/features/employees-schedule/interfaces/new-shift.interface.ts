import { ShiftType } from "../enums/shift-type.enum";

export interface NewShift
{
    employeeId: number;
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    type: ShiftType;
    officeId?: number;
}