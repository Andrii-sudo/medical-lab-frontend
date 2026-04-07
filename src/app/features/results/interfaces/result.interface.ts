import { ResultStatus } from "../enums/result-status.enum";
import { ResultParameter } from "./result-parameter.interface";

export interface Result
{
    id: number;
    patientFirstName: string;
    patientLastName: string;
    patientPhone: string;
    orderNumber: number;
    sampleType: string;
    status: ResultStatus;
    parameters: ResultParameter[];
}