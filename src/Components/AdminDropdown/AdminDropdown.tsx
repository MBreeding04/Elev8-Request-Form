import { MenuItem, Box, Divider } from "@mui/material";
import './AdminDropdown.css'
import {

    useNavigate
  } from "react-router-dom";
interface DropdownProps{
    setToggledMenu: React.Dispatch<React.SetStateAction<boolean>>
    ToggledMenu: boolean
}
//dropdown for admin view returns popup to main page
function AdminDropdown({setToggledMenu}: DropdownProps) {
    const Navigate = useNavigate();
    return (
        <Box className="DropDownPopUp">
            <MenuItem onClick={()=>{setToggledMenu(false)}}><Box className="text">Toggle Dark mode</Box></MenuItem>
            <Divider></Divider>
            <MenuItem onClick={()=>{Navigate('/')}}><Box className="text">Back to Form</Box></MenuItem>
        </Box>
    );
}
export default AdminDropdown