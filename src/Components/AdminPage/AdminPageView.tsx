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
import Axios from "axios";
interface DummyData {
    percent: string
    header: string
}
interface FormEntries {
    EntryId: number
    Type: string
    Page: string
    URL: string
    WhatDidHappen: string
    WhatExpectHappen: string
    NumOfPictures: string
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
    const chartLabels = ['Error', 'Defect', 'Failure', 'UI Feature', 'Logic Feature'];
    const [ChartData, setChartData] = useState<number[]>([])
    const [dummydata, setdummydata] = useState(dummy)
    const [ToggledMenu, setToggledMenu] = useState<boolean>(false);
    const [ToggledPopup, setToggledPopup] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [Row, setRow] = useState<FormEntries[]>([]);
    const [Mode, setMode] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [CurrentColors, setCurrentColors] = useState({ Main: 'temp', Stroke: 'temp', Header: 'temp', Accent: 'temp', TextColor: 'temp', Contrast: 'temp' });
    
    const AddToFormEntriesArray = (newValue: FormEntries) => {
        setRow((prevArray) => [...prevArray, newValue]);
    };
    const QueryForFormEntries = async () => {
        await Axios.post("http://localhost:5000/PullAllEntries", {
        }).then(async (response) => {
            setRow([]);
            for (let i = 0; i < response.data.result.length; i++) {
                const entry = response.data.result[i];
                const Id = entry.EntryId
                const Type = entry.TypeOfEntry;
                const Page = entry.PageOfError;
                const URL = entry.URLOfError;
                const WhatDidHappen = entry.WhatDidHappen;
                const WhatExpectHappen = entry.WhatIsExpected;
                const NumOfPictures = entry.NumOfPictures;
                const newFormEntry: FormEntries = { EntryId: Id, Type: Type, Page: Page, URL: URL, WhatDidHappen: WhatDidHappen, WhatExpectHappen: WhatExpectHappen, NumOfPictures: NumOfPictures }
                AddToFormEntriesArray(newFormEntry)
                
            }
        }).then(()=>{
            CalculateChartData()
        }).catch((error) => {
            console.error(error)
        })
        
    }
    const CalculateChartData = () =>{
        var chartNumber = [0, 0, 0, 0, 0]
        console.log(Row.length)
        for(let i = 0; i < Row.length; i++){
            for(let j = 0; j < chartLabels.length; j++){
                if(Row[i].Type === chartLabels[j]){
                    chartNumber[j]++
                }
            }
        }
        console.log(chartNumber.toString())
        setChartData(chartNumber)
    }
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
        CalculateChartData();
    }, [Row]);
    useEffect(() => {
        if (initialLoad) {
            QueryForFormEntries()
            setInitialLoad(false);
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
                    <Box className="ChartBox"><PieChart data={ChartData} labels={chartLabels} /></Box>
                </Box>
                <Box className='RightSide'>
                    <Box className="ActiveCard">
                        <CheckBoxIcon sx={{ color: '#F60', fontSize: '50px' }}></CheckBoxIcon><Box className="PercentHeaders">Active</Box>
                    </Box>
                    <Box className='BottomRightSide'>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"><Box className="AdminTableHeaders">Type</Box></TableCell>
                                        <TableCell align="center"><Box className="AdminTableHeaders">Page</Box></TableCell>
                                        <TableCell align="center"><Box className="AdminTableHeaders">URL</Box></TableCell>
                                        <TableCell align="center"><Box className="AdminTableHeaders">What you expect to happen</Box></TableCell>
                                        <TableCell align="center"><Box className="AdminTableHeaders">What did happen</Box></TableCell>
                                        <TableCell align="center"><Box className="AdminTableHeaders">Number of pictures</Box></TableCell>
                                        <TableCell align="center"><Box className="AdminTableHeaders">Pictures</Box></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Row.map((row) => (
                                        <TableRow
                                            key={row.EntryId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left" component="th" scope="row">
                                                <Box className="AdminTableData" >{row.Type}</Box>
                                            </TableCell>
                                            <TableCell><Box className="AdminTableData" >{row.Page}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.URL}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.WhatExpectHappen}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.WhatDidHappen}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.NumOfPictures}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" ></Box></TableCell>
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