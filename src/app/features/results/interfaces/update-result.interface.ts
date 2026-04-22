import { UpdateResultParameter } from "./update-result-parameter.interface";

export interface UpdateResult
{
    id: number;
    conclusion: string | null;
    parameters: UpdateResultParameter[];
}