import { OrderStatus } from "../enums/order-status.enum";

export interface Order
{
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName?: string;
    number: number;
    createdDate: Date;
    analyses: string[];
    status: OrderStatus;
    price: number;
}