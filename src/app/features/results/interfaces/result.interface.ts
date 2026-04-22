import { ResultStatus } from "../enums/result-status.enum";
import { ResultParameter } from "./result-parameter.interface";

export interface Result
{
    id: number;
    sampleType: string;
    status: ResultStatus;
    analysisName: string;
    orderNumber: number;
    patientFirstName: string;
    patientLastName: string;
    patientPhone: string;
    //parameters: ResultParameter[]; // ???
}