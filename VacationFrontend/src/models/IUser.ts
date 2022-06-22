import { Socket } from "socket.io-client";
import { UserType } from "./UserType";
import { DefaultEventsMap } from '@socket.io/component-emitter';

export interface IUser {
    firstName: string,
    lastName: string,
    likedVacations: Set<number>,
    userType: UserType,
    token?: string,
    socket?: Socket<DefaultEventsMap, DefaultEventsMap>
}