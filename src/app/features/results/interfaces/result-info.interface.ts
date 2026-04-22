import { ResultParameter } from "./result-parameter.interface";

export interface ResultInfo
{
    parameters: ResultParameter[];
    conclusion?: string;
}