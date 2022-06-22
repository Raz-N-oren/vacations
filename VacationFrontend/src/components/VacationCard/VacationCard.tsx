import './VacationCard.css';
import { AppState } from '../../redux/app-state';
import { useDispatch, useSelector } from "react-redux";
import { UserType } from '../../models/UserType';
import { ActionType } from '../../redux/action-type';
import { IVacation } from '../../models/IVacation';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { useState } from 'react';

export function VacationCard(props: IVacation) {
    const dispatch = useDispatch();

    const [showDescriptionModal, setShowDescriptionModal] = useState(false);

    const vacationId = props.id;
    const currentUser = useSelector((state: AppState) => state.currentUser);
    const amountOfLikes = props.amountOfLikes;

    const isUser = currentUser.userType === UserType.User;
    const isAdmin = currentUser.userType === UserType.Admin;
    const isFollowing = currentUser.likedVacations.has(vacationId);

    const onFollowClicked = async () => {
        try {
            if(isFollowing){
                await axios.delete(`http://localhost:3001/likes/${vacationId}`);
            }
            else{
                await axios.post(`http://localhost:3001/likes`, {vacationId});
            }
            dispatch({type: ActionType.HandleLikedClicked, payload: {isFollowing, vacationId} });
            
        } catch (e) {
            alert("Cannot like/unlike");
            console.error(e);
        }
    };

    const onEditVacationClicked = (id: number) => {
        dispatch({ type: ActionType.initVacationIdValueInModal, payload: id });
        dispatch({ type: ActionType.ToggleModal});
    };

    let onHandleDeleteButtonClicked = async (id: number) => {
        try{
            await axios.delete(`http://localhost:3001/vacations/${id}`);
        }
        catch(e){
            alert("Cannot delete vacation");
            console.error(e);
        }
    };

    const makeDatePrettier = (date: string) => {
        let dateParts: string[] = date.split("-");
        return dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
    };

    function numberWithCommas(Price: number) {
        return Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="vacation-card">
            <div className='buttons'>
            {isUser && <div><button onClick={onFollowClicked}>{isFollowing ? '❤️' : '👍'}</button></div>}
            {(isUser || isAdmin )&& <div>Likes: {amountOfLikes}</div>}
            {isAdmin && <div className="card-button"><button onClick={() => onHandleDeleteButtonClicked(vacationId)}>x</button></div>}
            {isAdmin && <span className="card-button"><button onClick={() => onEditVacationClicked(vacationId)} >✍🏼</button></span>} <br /><br />
            </div>
            <div className="card-header"><strong>{props.name} </strong></div>
            <div className="card-body">
                <strong>Amount:</strong> ${numberWithCommas(props.price)}. <br /> <strong>Begining Date:</strong> <br /> {makeDatePrettier(props.startDate)}. <br /> <strong>Ending Date:</strong> <br />  {makeDatePrettier(props.endDate)}. 
            </div>
            <img className='card-img' src={props.imgUrl} alt="" />
            <div className='description'> <button type="button" className="btn btn-primary" onClick={() => setShowDescriptionModal(true)}>Description</button> </div>
            <Modal className="description-modal" show={showDescriptionModal}>
                <ModalHeader >
                    <ModalTitle>Description</ModalTitle>
                </ModalHeader>
                <ModalBody> {props.description} </ModalBody>
                <ModalFooter><button className="btn btn-primary" onClick={() => setShowDescriptionModal(false)}>Close</button></ModalFooter>
            </Modal>
        </div>
    );
};