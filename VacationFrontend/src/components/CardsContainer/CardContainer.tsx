import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { IVacation } from "../../models/IVacation";
import { UserType } from "../../models/UserType";
import { AppState } from "../../redux/app-state";
import { VacationCard } from "../VacationCard/VacationCard";
import './CardsContainer.css';


export function CardContainer() {

    const currentUser = useSelector((state: AppState) => state.currentUser);
    let vacationMap = useSelector((state: AppState) => state.vacationMap);

    const navigate = useNavigate();

    const isGuest = currentUser.userType === UserType.Guest;

    let currentUserViewAllVacationArray: IVacation[] = [];

    useEffect(() => {
        if (isGuest) {
            navigate("/log-in");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    vacationMap.forEach((vacation: IVacation) => {
        currentUserViewAllVacationArray.push(vacation);
    })

    currentUserViewAllVacationArray.sort((vacationA, vacationB) => {
        if (currentUser.likedVacations.has(vacationA.id) === currentUser.likedVacations.has(vacationB.id)) {
            return 0;
        }
        if (currentUser.likedVacations.has(vacationA.id)) {
            return -1;
        }
        return 1;

    });

    return (
        <div>
            <div className="cards-container">
                {currentUserViewAllVacationArray.map((vacation: IVacation, index: number) => {
                    return <VacationCard {...vacation as IVacation}
                        key={index} />
                })};
            </div>
        </div>
    );
};