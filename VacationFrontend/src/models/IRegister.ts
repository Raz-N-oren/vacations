import { UserType } from './UserType';

export interface IRegister {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userType: UserType.User
}