import { MenuItem, Box, Divider } from "@mui/material";
import './Dropdown.css'
interface DropdownProps{
    setToggledMenu: React.Dispatch<React.SetStateAction<boolean>>
    ToggledMenu: boolean
    setToggledPopup: React.Dispatch<React.SetStateAction<boolean>>
    ToggledPopup: boolean
}
function Dropdown({setToggledMenu, ToggledMenu, setToggledPopup, ToggledPopup}: DropdownProps) {
    return (
        <Box className="DropDownPopUp">
            <MenuItem onClick={()=>{setToggledMenu(false)}}><Box className="text">Toggle Dark mode</Box></MenuItem>
            <Divider></Divider>
            <MenuItem onClick={()=>{setToggledMenu(false); setToggledPopup(true)}}><Box className="text">Admin Login</Box></MenuItem>
        </Box>
    );
}
export default Dropdown