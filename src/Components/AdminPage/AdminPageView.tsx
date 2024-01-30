import { useEffect, useState } from "react";
import { Box, IconButton, Menu, Modal, Button } from "@mui/material";
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
import { PictureInPictureAlt } from "@mui/icons-material";
interface PercentData {
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
    PictureElement: JSX.Element | undefined
}


function AdminPageView() {
    const [PictureElements, setPictureElements] = useState<JSX.Element>()
    const [Percents, setPercents] = useState<PercentData[]>([])
    const chartLabels = ['Error', 'Defect', 'Failure', 'UI Feature', 'Logic Feature'];
    const [ChartData, setChartData] = useState<number[]>([])
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
            if (response.data.returned === true) {
                setRow([])
                for (let i = 0; i < response.data.result.length; i++) {
                    const entry = response.data.result[i];
                    const Id = entry.EntryId
                    const Type = entry.TypeOfEntry;
                    const Page = entry.PageOfError;
                    const URL = entry.URLOfError;
                    const WhatDidHappen = entry.WhatDidHappen;
                    const WhatExpectHappen = entry.WhatIsExpected;
                    const NumOfPictures = entry.NumOfPictures;
                    const newFormEntry: FormEntries = { EntryId: Id, Type: Type, Page: Page, URL: URL, WhatDidHappen: WhatDidHappen, WhatExpectHappen: WhatExpectHappen, NumOfPictures: NumOfPictures, PictureElement: (<div>{Id}</div>) }
                    AddToFormEntriesArray(newFormEntry)
                    if(NumOfPictures > 0){
                        PullPictures(Id)
                    }
                }
            }
            else {

            }
        }).catch((error) => {
            console.error(error)
        })

    }
    //function to pull pictures by the EntryId, data is a file when pulled from database, inside of the file is the base64 Data URL that displays the image
    //is only called if NumOfPictures > 0
    const PullPictures = async (EntryId: number) => {
        await Axios.post("http://localhost:5000/PullPicturesById", {
            EntryId: EntryId
        }).then(async (response) => {
            console.log(response)
            for (let i = 0; i < response.data.result.length; i++) {
                // Assuming the received data is a Uint8Array
                const binaryDataInitial: Uint8Array = response.data.result[i].PictureBlob.data;

                // Convert the Uint8Array to a regular array (number[])
                const binaryArray: number[] = Array.from(binaryDataInitial);

                // Convert the binary data to a base64-encoded string
                const base64String = btoa(String.fromCharCode(...binaryArray));
                console.log('Raw Base64 string:', base64String);
                const binaryString: string = atob(base64String);

                // Convert binary string to Uint8Array
                const binaryData: Uint8Array = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    binaryData[i] = binaryString.charCodeAt(i);
                }

                // Step 2: Create a Blob from the binary data
                const blob: Blob = new Blob([binaryData], { type: 'application/octet-stream' });

                // Step 3: Create a FileReader to read the content of the Blob
                const fileReader: FileReader = new FileReader();

                fileReader.onload = (event) => {
                    // Step 4: Access the text content
                    const textContent: string = event.target?.result as string;

                    // Now you can use the 'textContent' variable, which contains the text from the file
                    console.log(textContent);
                    setPictureElements(<div>you have a picture with id of: {EntryId}</div>)
                };

                // Step 5: Read the Blob as text
                fileReader.readAsText(blob);
            }
        })
    }
    //counts each iteration of each type of error, and calculates percentages
    const CalculateChartData = () => {
        var chartNumber = [0, 0, 0, 0, 0]
        var percentages = ['', '', '', '', '']
        var PercentObject: PercentData[] = []
        var total: number = 0
        console.log(Row.length)
        for (let i = 0; i < Row.length; i++) {
            for (let j = 0; j < chartLabels.length; j++) {
                if (Row[i].Type === chartLabels[j]) {
                    chartNumber[j]++
                }
            }
        }
        for (let i = 0; i < chartNumber.length; i++) {
            total += chartNumber[i]
        }
        for (let i = 0; i < chartNumber.length; i++) {
            var temp: number = 0
            temp = (chartNumber[i] / total) * 100
            percentages[i] = +temp.toFixed(2) + '%'
            PercentObject[i] = { percent: percentages[i], header: chartLabels[i] }
        }
        setPercents(PercentObject)
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
    //on initial render, query for data and when rows are sent visualize the data with the chart
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
                        {Percents.map((iteration) => (
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
                                            <TableCell align="center"><Box className="AdminTableData" >{row.Page}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.URL}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.WhatExpectHappen}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.WhatDidHappen}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.NumOfPictures}</Box></TableCell>
                                            <TableCell align="center"><Box className="AdminTableData" >{row.PictureElement}</Box></TableCell>
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