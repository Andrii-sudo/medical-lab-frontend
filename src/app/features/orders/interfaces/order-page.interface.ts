import { Order } from "./order.interface";

export interface OrderPage
{
    orders: Order[];
    pageCount: number;
}