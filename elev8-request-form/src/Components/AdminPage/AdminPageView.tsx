import { useEffect, useState } from "react";
import { Box, Icon, IconButton, Menu, Modal, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import AdminDropdown from "../AdminDropdown/AdminDropdown";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/elv8 logo white 1.png'
import AdminPopup from "../Admin Popup/AdminPopup";
import '../AdminPage/AdminPageView.css'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PieChart from '../Piechart/Piechart'
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import TableRowsIcon from '@mui/icons-material/TableRows';
interface DummyData {
    percent: string
    header: string
}
function AdminPageView() {
    const dummy: DummyData[] = [
        {
            percent: '25%',
            header: 'Error'
        },
        {
            percent: '3%',
            header: 'Defect'
        },
        {
            percent: '19%',
            header: 'Failure'
        },
        {
            percent: '34%',
            header: 'UI Feature'
        },
        {
            percent: '19%',
            header: 'Logic Feature'
        },
    ]
    const chartData = [25, 19, 3, 34, 19];
    const chartLabels = ['Error', 'Defect', 'Failures', 'UI Features', 'Logic Features'];

    const [dummydata, setdummydata] = useState(dummy)
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
    }, [])
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
            <Box className="AdminContainer">
                <Box className='leftSide'>
                    <Carousel className="Carousel">
                        {dummydata.map((iteration) => (
                            <Box className="PercentCards"><Box className="percentNums">{iteration.percent}</Box><Box className="PercentHeaders">{iteration.header}'s</Box></Box>
                        ))}
                    </Carousel>
                    <Box className="ChartBox"><PieChart data={chartData} labels={chartLabels} /></Box>
                </Box>
                <Box className='RightSide'>
                    <Box className="ActiveCard">
                        <CheckBoxIcon sx={{ color: '#F60', fontSize: '50px' }}></CheckBoxIcon><Box className="PercentHeaders">Active</Box>
                    </Box>
                    <Box className='BottomRightSide'>
                    <Button onClick={() => {
                        }} sx={{
                            m:'24px',
                            py:'12px',
                            bgcolor: '#F60', ':hover': {
                                bgcolor: '#CD5200',
                            }
                        }} variant="contained"><TableRowsIcon></TableRowsIcon><Box className='Submit'>Read All Responses</Box></Button>
                        <Button onClick={() => {
                        }} sx={{
                            m:'24px',
                            py:'12px',
                            bgcolor: '#107C41', ':hover': {
                                bgcolor: '#0a5c2f',
                            }
                        }} variant="contained"><ArticleIcon></ArticleIcon><Box className='Submit'>Export to Excel</Box></Button>
                        <Button onClick={() => {
                        }} sx={{
                            m:'24px',
                            py:'12px',
                            bgcolor: '#eb311c', ':hover': {
                                bgcolor: '#d42a17',
                            }
                        }} variant="contained"><DeleteIcon></DeleteIcon><Box className='Submit'>Delete all responses</Box></Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminPageView