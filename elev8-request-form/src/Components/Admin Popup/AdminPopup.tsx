import './AdminPopup.css'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, TextField, Button } from '@mui/material';
import {
    Route,
    HashRouter,
    Routes,
    useNavigate
  } from "react-router-dom";
interface PopupProps {
    setToggledPopup: React.Dispatch<React.SetStateAction<boolean>>
    ToggledPopup: boolean
}

function AdminPopup({ setToggledPopup, ToggledPopup }: PopupProps) {
    const Navigate = useNavigate();
    return (
        <Box className='AdminPopup'>
            <Box className='AdminLoginHeader'>
                Admin login
                <IconButton onClick={() => { setToggledPopup(false) }}><CloseIcon></CloseIcon></IconButton>
            </Box>
            <Divider></Divider>
            <Box className='AdminInputs'>
                UserName
                <TextField sx={{ pb: '16px' }} variant="outlined" />
                Password
                <TextField sx={{ pb: '16px' }} variant="outlined" />
                <Button onClick={()=>{
                    Navigate('/AdminPage')
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