import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppState } from '../../redux/app-state';
import { UserType } from "../../models/UserType";
import './Navbar.css';
import { ActionType } from '../../redux/action-type';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect } from 'react';

const Navbar = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const currentUser = useSelector((state: AppState) => state.currentUser);
    const isAdmin = currentUser.userType === UserType.Admin;
    const isUser = currentUser.userType === UserType.User;
    const isGuest = currentUser.userType === UserType.Guest;

    useEffect(() => {
        if (currentUser.socket) {
            initSocketListeners(currentUser.socket)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    function initSocketListeners(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on("delete-vacation", (vacationId) => {
            dispatch({ type: ActionType.DeleteCard, payload: +vacationId });
        });

        socket.on("add-or-edit-vacation", (vacationJson) => {
            dispatch({ type: ActionType.AddOrEditVacation, payload: vacationJson });
        });

    };

    const onOpenModalClicked = () => {
        dispatch({ type: ActionType.ResetVacationToEditId, payload: 0 });
        dispatch({ type: ActionType.ToggleModal });
    };

    const onLogOutClicked = () => {
        dispatch({ type: ActionType.LogOut });
        sessionStorage.clear();
        navigate("/log-in");
    };

    return (
        <div className="nav-bar">
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container">
                    <p className="navbar-brand"> Champions League packages </p>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu"><span
                    className="navbar-toggler-icon"></span></button>
                    <div className='welcome'>Welcome {currentUser.firstName} {currentUser.lastName}</div>
                    <div className="collapse navbar-collapse" id="navmenu">
                    <ul className="nav navbar-nav ms-auto">
                            <li className="nav-item">
                                {isAdmin && <button className='modal-button' onClick={() => onOpenModalClicked()}>Add new Vacation</button>}
                            </li>
                            
                            <li className="nav-item">
                                {isAdmin && <button className='statics-graph' onClick={() => navigate("/statics-graph")}>Statics graph</button>}
                            </li>

                            <li className="nav-item">
                            {(isAdmin || isUser) && <a onClick={() => navigate("/")} className="nav-link">Home</a>}
                            </li>

                            <li className="nav-item">
                                {isGuest && <a onClick={() => navigate("/log-in")} className="nav-link">Log-in</a>}
                            </li>

                            <li className="nav-item">
                                {isGuest && <a onClick={() => navigate("/register")} className="nav-link">Register</a>}
                            </li>

                            <li className="nav-item nav-about">
                                {(isAdmin || isUser) && <a onClick={onLogOutClicked} className="nav-link">Log-out</a>}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;