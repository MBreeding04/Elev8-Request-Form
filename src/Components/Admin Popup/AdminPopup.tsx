import './AdminPopup.css'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, TextField, Button } from '@mui/material';
import {
    useNavigate
} from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Fade';
import * as CryptoJS from 'crypto-js';
interface PopupProps {
    setToggledPopup: React.Dispatch<React.SetStateAction<boolean>>
    ToggledPopup: boolean
}
//popup to take admin credentials from the user and check if they get access to the admin page
function AdminPopup({ setToggledPopup, ToggledPopup }: PopupProps) {
    const Navigate = useNavigate();
    const [UserName, setUserName] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [IsAlert, setIsAlert] = useState<boolean>(false);
    const [ErrorMessage, setErrorMessage] = useState<string>('');

    //sets an auth cookie to verify if the user is valid
    const SetCookie = (name: string, value: string, expirationDays: number) => {
        // Calculate expiration date
        const expirationDate = new Date();
        const secret = process.env.REACT_APP_SESSIONSECRET
        expirationDate.setDate(expirationDate.getDate() + expirationDays);
        const StringBody = CryptoJS.AES.encrypt(`${name}=${value}`, secret!).toString()

        // Create the cookie string
        const cookieString = `${StringBody}; expires=${expirationDate.toUTCString()}; secure; secret=${secret}`;

        // Set the cookie
        document.cookie = cookieString;
    };

    //handles textbox changes
    const HandleUserName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserName(e.target.value)
    }
    const HandlePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value)
    }

    //function that is called on submitt and verifies the UserName and Password
    const HandleSubmit = async () => {

        await Axios.post("http://localhost:5000/VerifyUserPass", {
            UserName: UserName,
            Password: Password
        }).then(async (response) => {
            if (response.data.Authenticated === true) {
                SetCookie(process.env.REACT_APP_COOKIENAME!, process.env.REACT_APP_COOKIEVALUE!, 1)
                Navigate('/AdminPage')
            }
            else {
                setErrorMessage('UserName and/or Password is incorrect')
                setIsAlert(true)
            }
        }).catch((error: any) => {
            setErrorMessage('There was a problem connecting to the server')
            console.log(error)
            setIsAlert(true)
        });
    }
    return (
        <Box className='AdminPopup'>
            <Box className='AdminLoginHeader'>
                Admin login
                <IconButton onClick={() => { setToggledPopup(false) }}><CloseIcon></CloseIcon></IconButton>
            </Box>
            <Collapse in={IsAlert} unmountOnExit><Alert severity='error'><Box className='errorData'>{ErrorMessage}<IconButton onClick={() => {
                setIsAlert(false)
            }}><CloseIcon></CloseIcon></IconButton></Box></Alert></Collapse>
            <Divider></Divider>
            <Box className='AdminInputs'>
                UserName
                <TextField sx={{ pb: '16px' }} variant="outlined" onChange={(e) => { HandleUserName(e) }} />
                Password
                <TextField type='password' sx={{ pb: '16px' }} variant="outlined" onChange={(e) => { HandlePassword(e) }} />
                <Button onClick={() => {
                    HandleSubmit()
                }} sx={{
                    bgcolor: '#F60', ':hover': {
                        bgcolor: '#CD5200',
                    }
                }} variant="contained"><Box className='Submit'>Submit</Box></Button>
            </Box>
        </Box>
    );
}
export default AdminPopup