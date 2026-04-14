import { UserRole } from "../user-role.enum";

export interface User
{
    id: number;
    role: UserRole;
}
