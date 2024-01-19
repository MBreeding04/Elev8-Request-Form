import { useEffect, useState } from "react";
import { Box, Icon, IconButton, Menu, Modal } from "@mui/material";
import AdminDropdown from "../AdminDropdown/AdminDropdown";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/elv8 logo white 1.png'
import AdminPopup from "../Admin Popup/AdminPopup";
function AdminPageView() {
    const [ToggledMenu, setToggledMenu] = useState<boolean>(false);
    const [ToggledPopup, setToggledPopup] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [Mode, setMode] = useState(false);
    const [CurrentColors, setCurrentColors] = useState({ Main: 'temp', Stroke: 'temp', Header: 'temp', Accent: 'temp', TextColor: 'temp', Contrast: 'temp' });
    const LightPallete = {
        Main: "#F9F9F9",
        Stroke: "#787878",
        Header: "#010101",
        Accent: "#FF6600",
        TextColor: "#000000",
        Contrast: "#FFFFFF"
    }
    const DarkPallete = {
        Main: "#070707",
        Stroke: "#787878",
        Header: "#010101",
        Accent: "#FF6600",
        TextColor: "#000000",
        Contrast: "#FFFFFF"
    }
    useEffect(() => {
        if (Mode === false) {
            setCurrentColors(LightPallete);
        } else {
            setCurrentColors(DarkPallete);
        }
    }, [Mode])
    useEffect(() => {
        if (Mode === false) {
            setCurrentColors(LightPallete);
        } else {
            setCurrentColors(DarkPallete);
        }
    })
    return (
        <Box className="MainBody" sx={{ bgcolor: CurrentColors.Main }}>
            <Box className="Header" sx={{ bgcolor: CurrentColors.Header }}>
                <Box className='imageContainer'>
                    <img src={Logo} alt="Elev8"></img>
                </Box>
                <IconButton onClick={(e) => {
                    setAnchorEl(e.currentTarget)
                    setToggledMenu(true)
                }} className="HamburgerMenu" sx={{ color: CurrentColors.Contrast }}><MenuIcon sx={{ fontSize: '40px' }}></MenuIcon></IconButton>
                <Menu open={ToggledMenu} anchorEl={anchorEl} onClose={() => { setToggledMenu(false) }}>
                    <AdminDropdown setToggledMenu={setToggledMenu} ToggledMenu={ToggledMenu} ></AdminDropdown>
                </Menu>
            </Box>
            <Modal className="Modal" open={ToggledPopup} onClose={() => { setToggledPopup(false) }}>
                <AdminPopup setToggledPopup={setToggledPopup} ToggledPopup={ToggledPopup}></AdminPopup>
            </Modal>
        </Box>
    );
}

export default AdminPageView