import { OfficeType } from "./office-type"

export interface Office 
{
    id: number,
    number: number,
    city: string,
    address: string,
    type: OfficeType
}
