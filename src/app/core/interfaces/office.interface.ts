import { OfficeType } from "@core/enums/office-type";

export interface Office
{
    id: number;
    number: number;
    city: string;
    address: string;
    type: OfficeType;
}
