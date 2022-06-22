import { UserType } from '../models/UserType';
import { IUser } from '../models/IUser';
import { IVacation } from "../models/IVacation";


export class AppState {

    public guest: IUser = {
        firstName: 'Guest',
        lastName: '',
        likedVacations: new Set<number>(),
        userType: UserType.Guest
    };

    public currentUser: IUser = this.guest;

    public vacationMap: Map<number, IVacation> = new Map();

    public isModalOpen = false;

    public vacationForEdit: IVacation | undefined;

}
