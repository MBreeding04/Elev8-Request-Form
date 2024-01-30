import { Box, Icon, IconButton, Menu, Modal } from "@mui/material";
import Form from "../Form/Form";
import Dropdown from "../Dropdown/Dropdown";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/elv8 logo white 1.png'
import AdminPopup from "../Admin Popup/AdminPopup";
import "./UserView.css";

import { useEffect, useState } from "react";

//Main page where the user will input the Form
function UserView() {
    const [Mode, setMode] = useState(false);
    const [ToggledMenu, setToggledMenu] = useState<boolean>(false);
    const [ToggledPopup, setToggledPopup] = useState<boolean>(false);
    const [CurrentColors, setCurrentColors] = useState({ Main: 'temp', Stroke: 'temp', Header: 'temp', Accent: 'temp', TextColor: 'temp', Contrast: 'temp' });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    //useEffect only triggered when darkmode and light mode are toggled
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
    },[])
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
                    <Dropdown setToggledMenu={setToggledMenu} ToggledMenu={ToggledMenu} setToggledPopup={setToggledPopup} ToggledPopup={ToggledPopup}></Dropdown>
                </Menu>
            </Box>
            <Box className="FormContainer">
                <Form></Form>
            </Box>
            <Modal className="Modal" open={ToggledPopup} onClose={() => { setToggledPopup(false) }}>
                <AdminPopup setToggledPopup={setToggledPopup} ToggledPopup={ToggledPopup}></AdminPopup>
            </Modal>
        </Box>
    );
}

export default UserView;
