import { MenuItem, Box, Divider } from "@mui/material";
import './Dropdown.css'
import {
    useNavigate
} from "react-router-dom";
interface DropdownProps{
    setToggledMenu: React.Dispatch<React.SetStateAction<boolean>>
    ToggledMenu: boolean
    setToggledPopup: React.Dispatch<React.SetStateAction<boolean>>
    ToggledPopup: boolean
}

function Dropdown({setToggledMenu, ToggledMenu, setToggledPopup, ToggledPopup}: DropdownProps) {
    const Navigate = useNavigate()
    return (
        <Box className="DropDownPopUp">
            <MenuItem onClick={()=>{setToggledMenu(false)}}><Box className="text">Toggle Dark mode</Box></MenuItem>
            <Divider></Divider>
            <MenuItem onClick={()=>{setToggledMenu(false); setToggledPopup(true)}}><Box className="text">Admin Login</Box></MenuItem>
            <Divider></Divider>
            <MenuItem onClick={()=>{setToggledMenu(false); Navigate('/FormsTable')}}><Box className="text">View Form Submissions</Box></MenuItem>
        </Box>
    );
}
export default Dropdown