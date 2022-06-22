import { Box, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { IVacation } from '../../models/IVacation';
import { ActionType } from '../../redux/action-type';
import { AppState } from '../../redux/app-state';
import './AddOrEditModal.css';

const AddOrEditModal = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: AppState) => state.isModalOpen);
    const editVacationData = useSelector((state: AppState) => state.vacationForEdit);

    let isEdit: boolean = false;
    if (editVacationData !== undefined) {
        isEdit = true;
    }
    else {
        isEdit = false;
    }

    let initVacationData: IVacation = {
        id: 0,
        name: "",
        price: 0,
        startDate: "",
        endDate: "",
        imgUrl: "",
        description: "",
        amountOfLikes: 0
    };

    if (isEdit) {
        initVacationData = {
            id: editVacationData?.id,
            name: editVacationData?.name,
            price: editVacationData?.price,
            startDate: editVacationData?.startDate,
            endDate: editVacationData?.endDate,
            imgUrl: editVacationData?.imgUrl,
            description: editVacationData?.description,
            amountOfLikes: editVacationData?.amountOfLikes
        } as IVacation
    }

    useEffect(() => {
        if (isEdit) {
            setVacationNameValue(initVacationData.name);
            setVacationPriceValue(initVacationData.price);
            setVacationStartDateValue(initVacationData.startDate);
            setVacationEndDateValue(initVacationData.endDate);
            setVacationImgUrlValue(initVacationData.imgUrl);
            setVacationDescriptionValue(initVacationData.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen]);

    let todayDate = new Date().toISOString().split('T')[0]

    const [vacationNameValue, setVacationNameValue] = useState(initVacationData.name);
    const [isVacationNameValueInvalid, setIsVacationNameValueInvalid] = useState(false);
    const [vacationNameError, setVacationNameError] = useState("");

    const [vacationPriceValue, setVacationPriceValue] = useState(initVacationData.price);
    const [isVacationPriceValueInvalid, setIsVacationPriceValueInvalid] = useState(false);
    const [vacationPriceError, setVacationPriceError] = useState("");

    const [vacationStartDateValue, setVacationStartDateValue] = useState(initVacationData.startDate);
    const [isVacationStartDateValueInvalid, setIsVacationStartDateValueInvalid] = useState(false);
    const [vacationStartDateError, setVacationStartDateError] = useState("");

    const [vacationEndDateValue, setVacationEndDateValue] = useState(initVacationData.endDate);
    const [isVacationEndDateValueInvalid, setIsVacationEndDateValueInvalid] = useState(false);
    const [vacationEndDateError, setVacationEndDateError] = useState("");

    const [vacationImgUrlValue, setVacationImgUrlValue] = useState(initVacationData.imgUrl);
    const [isVacationImgUrlValueInvalid, setIsVacationImgUrlValueInvalid] = useState(false);
    const [vacationImgUrlError, setVacationImgUrlError] = useState("");

    const [vacationDescriptionValue, setVacationDescriptionValue] = useState(initVacationData.description);
    const [isVacationDescriptionValueInvalid, setIsVacationDescriptionValueInvalid] = useState(false);
    const [vacationDescriptionError, setVacationDescriptionError] = useState("");

    const handleSubmit = async () => {
        try {
            validateVacation();
            let validatedVacation: IVacation = {
                id: initVacationData.id,
                name: vacationNameValue,
                price: vacationPriceValue,
                startDate: vacationStartDateValue,
                endDate: vacationEndDateValue,
                imgUrl: vacationImgUrlValue,
                description: vacationDescriptionValue,
                amountOfLikes: initVacationData.amountOfLikes
            };
            if (isEdit) {
                await axios.put("http://localhost:3001/vacations", validatedVacation);
            }
            else {
                let vacationResponse = await axios.post("http://localhost:3001/vacations", validatedVacation);
                let newVacationId = vacationResponse.data;
                validatedVacation.id = newVacationId;
            }
            // dispatch({ type: ActionType.AddOrEditVacation, payload: validatedVacation });
            dispatch({ type: ActionType.ToggleModal });
            dispatch({ type: ActionType.initVacationIdValueInModal, payload: 0 });
            cleanModalValuesAndErrors();
        }
        catch (e) {
            console.error(e);
            alert("Your Request has failed.")
        }
    };

    const validateVacation = () => {
        let isFoundInvalidValue = false;
        setIsVacationNameValueInvalid(false);

        if (!vacationNameValue) {
            setVacationNameError("Please enter a valid vacation's name");
            setIsVacationNameValueInvalid(true);
            isFoundInvalidValue = true;
        }

        else if (isVacationNameValueInvalid === true) {
            setVacationNameError("Please enter a valid vacation's name");
            setIsVacationNameValueInvalid(true);
            isFoundInvalidValue = true;
        }

        if (!vacationPriceValue) {
            setVacationPriceError("Please enter a valid vacation's price");
            setIsVacationPriceValueInvalid(true);
            isFoundInvalidValue = true;
        }

        else if (isVacationPriceValueInvalid === true) {
            setVacationPriceError("Please enter a valid vacation's price");
            setIsVacationPriceValueInvalid(true);
            isFoundInvalidValue = true;
        }

        if (!vacationStartDateValue) {
            setVacationStartDateError("Please enter a valid vacation's start date");
            setIsVacationStartDateValueInvalid(true);
            isFoundInvalidValue = true;
        }

        else if (isVacationStartDateValueInvalid === true) {
            setVacationStartDateError("Please enter a valid vacation's start date");
            setIsVacationStartDateValueInvalid(true);
            isFoundInvalidValue = true;
        }

        if (!vacationEndDateValue) {
            setVacationEndDateError("Please enter a valid vacation's end date");
            setIsVacationEndDateValueInvalid(true);
            isFoundInvalidValue = true;
        }

        else if (isVacationEndDateValueInvalid === true) {
            setVacationEndDateError("Please enter a valid vacation's end date");
            setIsVacationEndDateValueInvalid(true);
            isFoundInvalidValue = true;
        }

        if (!vacationImgUrlValue) {
            setVacationImgUrlError("Please enter a valid vacation's image url");
            setIsVacationImgUrlValueInvalid(true);
            isFoundInvalidValue = true;
        }

        else if (isVacationImgUrlValueInvalid === true) {
            setVacationImgUrlError("Please enter a valid vacation's image url");
            setIsVacationImgUrlValueInvalid(true);
            isFoundInvalidValue = true;
        }

        if (!vacationDescriptionValue) {
            setVacationDescriptionError("Please enter a valid vacation's description");
            setIsVacationDescriptionValueInvalid(true);
            isFoundInvalidValue = true;
        }

        else if (isVacationDescriptionValueInvalid === true) {
            setVacationDescriptionError("Please enter a valid vacation's description");
            setIsVacationDescriptionValueInvalid(true);
            isFoundInvalidValue = true;
        }

        if (isFoundInvalidValue) {
            throw new Error();
        }
    }


    const cleanModalValuesAndErrors = () => {
        setVacationNameValue("");
        setVacationPriceValue(0);
        setVacationStartDateValue("");
        setVacationEndDateValue("");
        setVacationImgUrlValue("");
        setVacationDescriptionValue("");
        setVacationNameError("");
        setVacationPriceError("");
        setVacationStartDateError("");
        setVacationEndDateError("");
        setVacationImgUrlError("");
        setVacationDescriptionError("");
        setIsVacationNameValueInvalid(false);
        setIsVacationPriceValueInvalid(false);
        setIsVacationStartDateValueInvalid(false);
        setIsVacationEndDateValueInvalid(false);
        setIsVacationImgUrlValueInvalid(false);
        setIsVacationDescriptionValueInvalid(false);
    }

    const handleClose = () => {
        dispatch({ type: ActionType.ToggleModal });
        dispatch({ type: ActionType.initVacationIdValueInModal, payload: 0 });
        cleanModalValuesAndErrors();
        navigate("/");
    };

    function checkIfThereIsSpecialsAndSpaces(input: string) {
        let format = /[^a-zA-Z0-9]/g;
        return format.test(input);
    }

    // ~~~~~~~~~~~~~~~~~~~Vacation name validate~~~~~~~~~~~~~~~~~~~
    const getVacationNameValue = (event: ChangeEvent<HTMLInputElement>) => {
        setVacationNameValue(event.target.value);
        vacationNameValueCheck(event.target.value);
    }

    const vacationNameValueCheck = (vacationNameValue: string) => {
        for (let index = 0; index < vacationNameValue.length; index++) {
            if (+vacationNameValue.charAt(index) >= 0 && +vacationNameValue.charAt(index) <= 9) {
                setIsVacationNameValueInvalid(true);
                setVacationNameError("Vacation Name cannot contain numbers");
            }
        }
        if (checkIfThereIsSpecialsAndSpaces(vacationNameValue)) {
            setIsVacationNameValueInvalid(true);
            setVacationNameError("Vacation Name cannot contain special character or spaces");
        }
        else if (vacationNameValue === "") {
            setIsVacationNameValueInvalid(true);
            setVacationNameError("Please enter vacation's name");
        }
        else if (vacationNameValue.length < 3) {
            setIsVacationNameValueInvalid(true);
            setVacationNameError("Please Make sure the vacation's name is not shorter then 3 character");
        }
        else if (vacationNameValue.length > 15) {
            setIsVacationNameValueInvalid(true);
            setVacationNameError("Please Make sure the vacation's name is not longer then 15 character");
        }
        else {
            for (let index = 0; index < vacationNameValue.length; index++) {
                if (+vacationNameValue.charAt(index) >= 0 && +vacationNameValue.charAt(index) <= 9) {
                    setIsVacationNameValueInvalid(true);
                    setVacationNameError("Vacation Name cannot contain numbers");
                }
                else {
                    setIsVacationNameValueInvalid(false);
                    setVacationNameError("");
                }
            }
        }
    }

    // ~~~~~~~~~~~~~~~~~~~Vacation price validate~~~~~~~~~~~~~~~~~~~

    const getPriceValue = (event: ChangeEvent<HTMLInputElement>) => {
        setVacationPriceValue(+event.target.value);
        priceValueCheck(+event.target.value);
    }

    const priceValueCheck = (vacationPriceValue: number) => {
        if (vacationPriceValue === 0) {
            setIsVacationPriceValueInvalid(true);
            setVacationPriceError("Please enter a price.");
        }
        else if (vacationPriceValue < 0) {
            setIsVacationPriceValueInvalid(true);
            setVacationPriceError("Price cannot be a negative number.");
        }
        else if (vacationPriceValue < 1 || vacationPriceValue > 20000) {
            setIsVacationPriceValueInvalid(true);
            setVacationPriceError("Price must be between 1 and 20,000.");
        }
        else {
            setIsVacationPriceValueInvalid(false);
            setVacationPriceError("");
        }
    }
    // ~~~~~~~~~~~~~~~~~~~Vacation start date validate~~~~~~~~~~~~~~~~~~~
    const getStartDateValue = (event: ChangeEvent<HTMLInputElement>) => {
        setVacationStartDateValue(event.target.value);
        startDateValueCheck(event.target.value);
    }

    const startDateValueCheck = (vacationStartDateValue: any) => {
        let tempDate = new Date(vacationStartDateValue);
        if (tempDate.getFullYear() < 2022) {
            setIsVacationStartDateValueInvalid(true);
            setVacationStartDateError("Date Is invalid.");
        }
        else {
            setIsVacationStartDateValueInvalid(false);
            setVacationStartDateError("");
        }
    }

    // ~~~~~~~~~~~~~~~~~~~Vacation end date validate~~~~~~~~~~~~~~~~~~~
    const getEndDateValue = (event: ChangeEvent<HTMLInputElement>) => {
        setVacationEndDateValue(event.target.value);
        endDateValueCheck(event.target.value);
    }

    const endDateValueCheck = (vacationEndDateValue: any) => {
        let tempDate = new Date(vacationEndDateValue);
        if (tempDate.getFullYear() < 2022) {
            setIsVacationEndDateValueInvalid(true);
            setVacationEndDateError("Date Is invalid.");
        }
        else {
            setIsVacationEndDateValueInvalid(false);
            setVacationEndDateError("");
        }
    }

    // ~~~~~~~~~~~~~~~~~~~Vacation img url validate~~~~~~~~~~~~~~~~~~~
    const getImgUrlValue = (event: ChangeEvent<HTMLInputElement>) => {
        setVacationImgUrlValue(event.target.value);
        ImgUrlValueCheck(event.target.value);
    }

    const ImgUrlValueCheck = (vacationImgUrlValue: string) => {
        if (vacationImgUrlValue === "") {
            setIsVacationImgUrlValueInvalid(true);
            setVacationImgUrlError("Please enter an url.");
        }
        else if (vacationImgUrlValue.length > 3000) {
            setIsVacationImgUrlValueInvalid(true);
            setVacationImgUrlError("Please enter an url shorter than 3,000 characters.");
        }
        else {
            setIsVacationImgUrlValueInvalid(false);
            setVacationImgUrlError("");
        }
    }

    // ~~~~~~~~~~~~~~~~~~~Vacation description validate~~~~~~~~~~~~~~~~~~~

    const getDescriptionValue = (event: ChangeEvent<HTMLInputElement>) => {
        setVacationDescriptionValue(event.target.value);
        descriptionValueCheck(event.target.value);
    }

    const descriptionValueCheck = (vacationDescriptionValue: string) => {
        if (vacationDescriptionValue === "") {
            setIsVacationDescriptionValueInvalid(true);
            setVacationDescriptionError("Please enter a description.");
        }
        if (vacationDescriptionValue.length > 13000) {
            setIsVacationDescriptionValueInvalid(true);
            setVacationDescriptionError("Please make sure the description is not longer than 13,000 characters.");
        }
        else {
            setIsVacationDescriptionValueInvalid(false);
            setVacationDescriptionError("");
        }
    }

    return (
        <>
            <Modal show={isModalOpen} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>Vacation</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getVacationNameValue}
                                    error={isVacationNameValueInvalid}
                                    helperText={vacationNameError}
                                    name="vacationName"
                                    required
                                    fullWidth
                                    id="vacationName"
                                    label="Vacation name"
                                    autoFocus
                                    defaultValue={initVacationData.name}
                                    autoComplete="Vacation name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getPriceValue}
                                    error={isVacationPriceValueInvalid}
                                    helperText={vacationPriceError}
                                    required
                                    fullWidth
                                    id="vacationPrice"
                                    label="Price"
                                    type='number'
                                    name="vacationPrice"
                                    autoComplete="Vacation Price"
                                    defaultValue={initVacationData.price}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{ inputProps: { min: todayDate } }}
                                    onChange={getStartDateValue}
                                    error={isVacationStartDateValueInvalid}
                                    helperText={vacationStartDateError}
                                    required
                                    fullWidth
                                    id="startDate"
                                    InputLabelProps={{ shrink: true }}
                                    label="Start date"
                                    name="startDate"
                                    autoComplete="Start date"
                                    type='date'
                                    defaultValue={initVacationData.startDate}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{ inputProps: { min: vacationStartDateValue || todayDate } }}
                                    onChange={getEndDateValue}
                                    error={isVacationEndDateValueInvalid}
                                    helperText={vacationEndDateError}
                                    required
                                    fullWidth
                                    id="endDate"
                                    InputLabelProps={{ shrink: true }}
                                    label="End date"
                                    name="endDate"
                                    autoComplete="End date"
                                    type='date'
                                    defaultValue={initVacationData.endDate}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getImgUrlValue}
                                    error={isVacationImgUrlValueInvalid}
                                    helperText={vacationImgUrlError}
                                    required
                                    fullWidth
                                    name="imgUrl"
                                    label="Image url"
                                    id="imgUrl"
                                    autoComplete="Image url"
                                    defaultValue={initVacationData.imgUrl}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={getDescriptionValue}
                                    error={isVacationDescriptionValueInvalid}
                                    helperText={vacationDescriptionError}
                                    required
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    id="description"
                                    autoComplete="Description"
                                    defaultValue={initVacationData.description}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className='submitButton'
                        onClick={handleClose}
                        type="button"
                        variant="contained"
                        sx={{ mr: 1 }}
                    >
                        close
                    </Button>
                    <Button
                        className='submitButton'
                        onClick={handleSubmit}
                        type="button"
                        variant="contained"
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default AddOrEditModal;