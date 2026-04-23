import { Shift } from "./shift.interface";

export interface ShiftPage
{
    shifts: Shift[]; 
    pageCount: number; 
}