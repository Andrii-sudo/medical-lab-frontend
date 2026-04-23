import { Employee } from "./employee.interface";

export interface EmployeePage
{
    employees: Employee[];
    pageCount: number;
}