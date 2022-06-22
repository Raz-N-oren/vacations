import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router';
import './App.css';
import AddOrEditModal from './components/AddOrEditModal/AddOrEditModal';
import { CardContainer } from './components/CardsContainer/CardContainer';
import LogIn from './components/LogIn/LogIn';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import StaticsGraph from './components/StaticsGraph/StaticsGraph'
import WelcomeTitle from './components/WelcomeTitle/WelcomeTitle';
import { ISeasonStorageData } from './models/ISeasonStorageData';
import { IUser } from './models/IUser';
import { IVacation } from './models/IVacation';
import { ActionType } from './redux/action-type';
import jwt_decode from "jwt-decode";
import { UserType } from './models/UserType';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    initVacations();
    let sessionStorageDetails = sessionStorage.getItem("userDetails");
    if(sessionStorageDetails){
      initUser(sessionStorageDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function initVacations() {
    try {
      const responseVacations = await axios.get<IVacation[]>("http://localhost:3001/vacations");
      let vacations = responseVacations.data;
      dispatch({ type: ActionType.getAllVacationsArray, payload: vacations });
      
    }
    catch (e) {
      console.error(e);
      alert("Cannot get vacations from server.");
    }
  }

  async function initUser(sessionStorageDetails: string){

    try {
      let userDetails = JSON.parse(sessionStorageDetails);
      let token = userDetails.token;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      let responseLikes = await axios.get("http://localhost:3001/likes");
      let likesArray = responseLikes.data;
      const socket = io('http://localhost:3002/', { query: {"token" : token }}).connect()
      let currentUser: IUser = convertDataToIUser(userDetails, likesArray, socket);
      dispatch({type: ActionType.logInUser, payload: currentUser})
    } 

    catch (e) {
      console.error(e);
      alert("Cannot get users from server.");
    }
  }

  const convertDataToIUser = (userDetails: ISeasonStorageData, likesArray: Array<number>, socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
    let token = userDetails.token;
    let tokenInfo: any = jwt_decode(token);
    let userFirstName = userDetails.firstName;
    let userLastName = userDetails.lastName;

    let typeOfUser = tokenInfo.userType;
    let userType : UserType = UserType.User;
    if(typeOfUser === "admin"){
      userType = UserType.Admin;
    }

    let likedVacations = new Set<number>();
    for(let like of likesArray){
      likedVacations.add(like);
    }

    let currentUser : IUser = {firstName: userFirstName, lastName: userLastName, userType: userType,likedVacations: likedVacations, token: token, socket: socket}

    return currentUser;

  }

  return (
    <div className="App">
      <Navbar />
      <WelcomeTitle />
      <Routes >
        <Route path="/" element={<CardContainer />}></Route>
        <Route path="/log-in" element={<LogIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/statics-graph" element={<StaticsGraph />}></Route>
      </Routes>
      <AddOrEditModal />
    </div>
  );
}

export default App;
