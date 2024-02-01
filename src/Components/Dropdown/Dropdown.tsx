import { MenuItem, Box, Divider } from "@mui/material";
import './Dropdown.css'
import {
    useNavigate
} from "react-router-dom";
import * as CryptoJS from 'crypto-js';
interface DropdownProps {
    setToggledMenu: React.Dispatch<React.SetStateAction<boolean>>
    ToggledMenu: boolean
    setToggledPopup: React.Dispatch<React.SetStateAction<boolean>>
    ToggledPopup: boolean
}

//menu dropdown, triggers popup in main page(userview)
function Dropdown({ setToggledMenu, ToggledMenu, setToggledPopup, ToggledPopup }: DropdownProps) {
    const Navigate = useNavigate()
    //If cookie is valid then skips the admin logon
    const HandleIfCookie = () => {
        const bytes = CryptoJS.AES.decrypt(document.cookie, process.env.REACT_APP_SESSIONSECRET!)
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        console.log('after encryption',decryptedData)
        if(decryptedData == 'isAdmin=true'){
            Navigate('/AdminPage')
        }
        else{
            setToggledMenu(false)
            setToggledPopup(true)
        }
        
    }
    return (
        <Box className="DropDownPopUp">
            <MenuItem onClick={() => { setToggledMenu(false) }}><Box className="text">Toggle Dark mode</Box></MenuItem>
            <Divider></Divider>
            <MenuItem onClick={() => { HandleIfCookie() }}><Box className="text">Admin Login</Box></MenuItem>
            <Divider></Divider>
            <MenuItem onClick={() => { setToggledMenu(false); Navigate('/FormsTable') }}><Box className="text">View Form Submissions(W.I.P)</Box></MenuItem>
        </Box>
    );
}
export default Dropdown