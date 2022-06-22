import { IUser } from './../models/IUser';
import { IVacation } from './../models/IVacation';
import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

const initialAppStateValue = new AppState();
let currentVacationState = initialAppStateValue.vacationMap;

export function reduce(oldAppState: AppState = initialAppStateValue, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.getAllVacationsArray:
            let vacationsArray = action.payload;
            let tempVacationsMap = new Map<number, IVacation>();
            for (let vacation of vacationsArray) {
                tempVacationsMap.set(vacation.id, vacation);
            }
            newAppState.vacationMap = tempVacationsMap;
            break;

        case ActionType.DeleteCard:
            let id: number = action.payload;
            let tempVacationMap = new Map(newAppState.vacationMap);
            tempVacationMap.delete(id);
            newAppState.vacationMap = tempVacationMap;
            break;

        case ActionType.GetCurrentState:
            newAppState.vacationMap = currentVacationState;
            break;

        case ActionType.AddOrEditVacation:
            let modifiedVacation = action.payload;
            let temproryVacationMap = new Map(newAppState.vacationMap);
            temproryVacationMap.set(modifiedVacation.id, modifiedVacation);
            newAppState.vacationMap = temproryVacationMap
            break;

        case ActionType.HandleLikedClicked:
            let vacationId = action.payload.vacationId;
            let isFollowing = action.payload.isFollowing
            let tempCurrentUser = { ...newAppState.currentUser };
            let vacation = newAppState.vacationMap.get(vacationId) as IVacation;

            if (!isFollowing) {
                tempCurrentUser.likedVacations.add(vacationId);
                vacation.amountOfLikes++;
            }
            else {
                tempCurrentUser.likedVacations.delete(vacationId);
                vacation.amountOfLikes--;
            }
            newAppState.currentUser = tempCurrentUser;
            newAppState.vacationMap.set(vacationId, vacation);

            break;

        case ActionType.ToggleModal:
            let isModalOpen = newAppState.isModalOpen;
            if (!isModalOpen) {
                newAppState.isModalOpen = true;
            }
            else {
                newAppState.isModalOpen = false;
                newAppState.vacationForEdit = undefined;
            }
            break;

        case ActionType.ResetVacationToEditId:
            newAppState.vacationForEdit = undefined;
            break;
            
        case ActionType.initVacationIdValueInModal:
            let vacatioNID = action.payload;
            if(vacatioNID === 0){
                newAppState.vacationForEdit = undefined;
            }
            else{
            let editVacationData = newAppState.vacationMap.get(vacatioNID) as IVacation;
            newAppState.vacationForEdit = editVacationData;
            }
            break;

        case ActionType.logInUser:  
            let loggedInUser = action.payload as IUser;
            newAppState.currentUser = loggedInUser;
            break;

        case ActionType.LogOut:
            newAppState.currentUser = newAppState.guest;
            break;

            // After returning the new state, it's being published to all subscribers
            // Each component will render itself based on the new state
    }
    return newAppState;
}