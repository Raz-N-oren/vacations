import './Register.css';
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
import PasswordStrengthBar from 'react-password-strength-bar';
import { ChangeEvent, useState } from "react";
import isEmailValid from "is-valid-email";
import axios from 'axios';
import { IRegister } from '../../models/IRegister';
import { UserType } from '../../models/UserType';

const Register = () => {

    const [firstNameValue, setFirstNameValue] = useState("");
    const [isFirstNameInvalid, setIsFirstNameInvalid] = useState(false);
    const [firstNameError, setFirstNameError] = useState("");

    const [lastNameValue, setLastNameValue] = useState("");
    const [isLastNameInvalid, setIsLastNameInvalid] = useState(false);
    const [lastNameError, setLastNameError] = useState("");

    const [emailValue, setEmailValue] = useState("");
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [emailError, setEmailError] = useState("");

    const [passwordValue, setPasswordValue] = useState("");
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const [validatedPasswordValue, setValidatedPasswordValue] = useState("");
    const [isValidatedPasswordInvalid, setIsValidatedPasswordInvalid] = useState(false);
    const [validatedPasswordError, setValidatedPasswordError] = useState("");

    const navigate = useNavigate();

    const onSignUpClicked = async () => {
        try {
            validateUserRegistered();
            let validatedUser: IRegister = {
                email: emailValue,
                password: passwordValue,
                firstName: firstNameValue,
                lastName: lastNameValue,
                userType: UserType.User
            };

            await axios.post("http://localhost:3001/users/", validatedUser);
            navigate("/log-in");
        }
        catch (e: any) {
            console.error(e);
            if (e.message !== "Client error") {
                alert("Registration failed.")
            }
        }
    };
    const theme = createTheme();

    const validateUserRegistered = () => {
        if (isFirstNameInvalid || firstNameValue.length < 2) {
            setIsFirstNameInvalid(true);
            setFirstNameError("Please enter your first name.");
        }
        if (isLastNameInvalid) {
            setIsLastNameInvalid(true);
            setLastNameError("Please enter your last name.");
        }
        if (isEmailInvalid || emailValue.length < 5) {
            setIsEmailInvalid(true);
            setEmailError("Please enter your E-mail.");
        }
        if (isPasswordInvalid || isValidatedPasswordInvalid || passwordValue.length < 6 || validatedPasswordValue.length < 6) {
            setIsPasswordInvalid(true);
            setIsValidatedPasswordInvalid(true);
            setPasswordError("Please enter a password");
            setValidatedPasswordError("Please repeat your password");
            throw new Error("Client error");
        }
    };

    function checkIfThereIsSpecialsAndSpaces(input: string) {
        let format = /[^a-zA-Z0-9]/g;
        return format.test(input);
    };

    const getFirstNameValue = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstNameValue(event.target.value);
        firstNameValueCheck(event.target.value);
    };

    const getLastNameValue = (event: ChangeEvent<HTMLInputElement>) => {
        setLastNameValue(event.target.value);
        lastNameValueCheck(event.target.value);
    };

    const getPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.target.value);
        passwordValueCheck(event.target.value);
    };

    const getValidatedPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
        setValidatedPasswordValue(event.target.value);
        validatedPasswordValueCheck(event.target.value);
    };

    const getEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailValue(event.target.value);
        emailValueCheck(event.target.value);
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

    const validatedPasswordValueCheck = (validatedPasswordValue: string) => {
        if (validatedPasswordValue !== passwordValue) {
            setIsValidatedPasswordInvalid(true);
            setValidatedPasswordError("Passwords aren't match");
        }
        else {
            setIsValidatedPasswordInvalid(false);
            setValidatedPasswordError("");
        }
    };

    const firstNameValueCheck = (firstNameValue: string) => {
        if (checkIfThereIsSpecialsAndSpaces(firstNameValue)) {
            setIsFirstNameInvalid(true);
            setFirstNameError("First Name cannot contain special character or spaces");
        }
        else if (firstNameValue === "") {
            setIsFirstNameInvalid(true);
            setFirstNameError("Please enter your first name");
        }
        else if (firstNameValue.length < 3) {
            setIsFirstNameInvalid(true);
            setFirstNameError("Please Make sure your first name is not shorter then 3 character");
        }
        else {
            for (let index = 0; index < firstNameValue.length; index++) {
                if (+firstNameValue.charAt(index) >= 0 && +firstNameValue.charAt(index) <= 9) {
                    setIsFirstNameInvalid(true);
                    setFirstNameError("First Name cannot contain numbers");
                }
                else {
                    setIsFirstNameInvalid(false);
                    setFirstNameError("");
                }
            }
        }
    };

    const lastNameValueCheck = (lastNameValue: string) => {
        if (checkIfThereIsSpecialsAndSpaces(lastNameValue)) {
            setIsLastNameInvalid(true);
            setLastNameError("Last Name cannot contain special character or spaces");
        }

        else {
            for (let index = 0; index < lastNameValue.length; index++) {
                if (+lastNameValue.charAt(index) >= 0 && +lastNameValue.charAt(index) <= 9) {
                    setIsLastNameInvalid(true);
                    setLastNameError("Last Name cannot contain numbers");
                }
                else {
                    setIsLastNameInvalid(false);
                    setLastNameError("");
                }
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
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
                        Sign up
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    onChange={getFirstNameValue}
                                    error={isFirstNameInvalid}
                                    helperText={firstNameError}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    onChange={getLastNameValue}
                                    error={isLastNameInvalid}
                                    helperText={lastNameError}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getEmailValue}
                                    error={isEmailInvalid}
                                    helperText={emailError}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getPasswordValue}
                                    error={isPasswordInvalid}
                                    helperText={passwordError}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getValidatedPasswordValue}
                                    error={isValidatedPasswordInvalid}
                                    helperText={validatedPasswordError}
                                    required
                                    fullWidth
                                    name="validate password"
                                    label="Repeat your Password"
                                    type="password"
                                    id="repeated-password"
                                    autoComplete="new-password"
                                />
                                <PasswordStrengthBar password={passwordValue} />
                            </Grid>
                        </Grid>
                        <Button
                            className='submitButton'
                            onClick={onSignUpClicked}
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={() => navigate("/log-in")} href="#" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Register;