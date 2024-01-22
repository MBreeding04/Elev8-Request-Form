import { useEffect, useState } from "react";
import { Box, Icon, IconButton, Menu, Modal, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import AdminDropdown from "../AdminDropdown/AdminDropdown";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/elv8 logo white 1.png'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../AdminPage/AdminPageView.css'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PieChart from '../Piechart/Piechart'
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
interface DummyData {
    percent: string
    header: string
}
function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  
];
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
        <Box className="AdminMainBody" sx={{ bgcolor: CurrentColors.Main }}>
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
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Box className="AdminTableHeaders">Dessert (100g serving)</Box></TableCell>
                                        <TableCell align="right"><Box className="AdminTableHeaders">Calories</Box></TableCell>
                                        <TableCell align="right"><Box className="AdminTableHeaders">Fat&nbsp;(g)</Box></TableCell>
                                        <TableCell align="right"><Box className="AdminTableHeaders">Carbs&nbsp;(g)</Box></TableCell>
                                        <TableCell align="right"><Box className="AdminTableHeaders">Protein&nbsp;(g)</Box></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                            <Box className="AdminTableData" >{row.name}</Box>
                                            </TableCell>
                                            <TableCell align="right"><Box className="AdminTableData" >{row.calories}</Box></TableCell>
                                            <TableCell align="right"><Box className="AdminTableData" >{row.fat}</Box></TableCell>
                                            <TableCell align="right"><Box className="AdminTableData" >{row.carbs}</Box></TableCell>
                                            <TableCell align="right"><Box className="AdminTableData" >{row.protein}</Box></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button onClick={() => {
                        }} sx={{
                            m: '24px',
                            py: '12px',
                            bgcolor: '#107C41', ':hover': {
                                bgcolor: '#0a5c2f',
                            }
                        }} variant="contained"><ArticleIcon></ArticleIcon><Box className='Submit'>Export to Excel</Box></Button>
                        <Button onClick={() => {
                        }} sx={{
                            m: '24px',
                            py: '12px',
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