import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IUser } from '../../models/IUser';
import isEmailValid from "is-valid-email";
import axios, { AxiosResponse } from 'axios';
import jwt_decode from "jwt-decode";
import { UserType } from '../../models/UserType';
import { ActionType } from '../../redux/action-type';
import { ISeasonStorageData } from '../../models/ISeasonStorageData';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export default function LogIn() {

    const theme = createTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailValue, setEmailValue] = useState("");
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [emailError, setEmailError] = useState("");

    const [passwordValue, setPasswordValue] = useState("");
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const onLogInClicked = async () => {
        let userLogin = {
            email: emailValue,
            password: passwordValue
        }
        try {
            validateUserLogin(userLogin.email as string, userLogin.password as string);
            let loginResponse = await axios.post("http://localhost:3001/users/login", userLogin);
            let token = loginResponse.data.token;
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

            let sessionStorageDetails: ISeasonStorageData = { token, firstName: loginResponse.data.firstName, lastName: loginResponse.data.lastName };
            let detailsConvertedToJson = JSON.stringify(sessionStorageDetails);
            sessionStorage.setItem("userDetails", detailsConvertedToJson)

            const socket = io('http://localhost:3002/', { query: { "token": token } }).connect();

            let loggedInUser = convertDataToUser(loginResponse, socket);
            dispatch({ type: ActionType.logInUser, payload: loggedInUser });
            navigate('/');
        }
        catch (e: any) {
            console.error(e);
            if (e.message !== "client error") {
                alert("Login has Failed.")
            }
        }

    };

    const convertDataToUser = (loginResponse: AxiosResponse<any, any>, socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
        let token = loginResponse.data.token;
        let tokenInfo: any = jwt_decode(token);
        let userFirstName = loginResponse.data.firstName;
        let userLastName = loginResponse.data.lastName;
        let userTypeFromResponse = tokenInfo.userType;
        let userType: UserType = UserType.User;

        if (userTypeFromResponse === "admin") {
            userType = UserType.Admin;
        };

        let userLikes = new Set<number>();
        let likesArray = loginResponse.data.userLikes;

        for (let like of likesArray) {
            userLikes.add(like);
        };

        let currentUser: IUser = { firstName: userFirstName, lastName: userLastName, likedVacations: userLikes, userType: userType, socket: socket, token: token };

        return currentUser;
    };

    const validateUserLogin = (email: string, password: string) => {
        if (email === "") {
            setIsEmailInvalid(true);
            setEmailError("Please enter your Email.");
        };

        if (password === "") {
            setIsPasswordInvalid(true);
            setPasswordError("Please enter your password");
            throw new Error("Client error");
        };

    }

    const getEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailValue(event.target.value);
        emailValueCheck(event.target.value);
    };

    const getPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.target.value);
        passwordValueCheck(event.target.value);
    };

    const emailValueCheck = (emailValue: string) => {
        if (!isEmailValid(emailValue)) {
            setEmailError("The email is invalid");
            setIsEmailInvalid(true);
        }
        else {
            setEmailError("");
            setIsEmailInvalid(false);
        }
    };

    const passwordValueCheck = (passwordValue: string) => {
        if (passwordValue.length < 6) {
            setIsPasswordInvalid(true);
            setPasswordError("Password cannot be shorter then 6 characters");
        }
        else {
            setIsPasswordInvalid(false);
            setPasswordError("");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '4%',
                        borderRadius: '5%'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                        <TextField
                            onChange={getEmailValue}
                            error={isEmailInvalid}
                            helperText={emailError}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />

                        <TextField
                            onChange={getPasswordValue}
                            error={isPasswordInvalid}
                            helperText={passwordError}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            onClick={onLogInClicked}
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>

                        <Grid container>
                            <Grid item>
                                <Link onClick={() => navigate("/register")} href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                            <Typography component="p" variant="h5">
                                Email: admin@gmail.com
                                Password: admin123
                            </Typography>
                        </Grid>
                        
                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    );
}