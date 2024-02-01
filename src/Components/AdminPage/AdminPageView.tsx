import { useEffect, useState } from "react";
import { Box, IconButton, Menu, Modal, Button, Divider } from "@mui/material";
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
import TablePictures from "../TablePictures/TablePictures";
import Alert, { AlertColor } from "@mui/material/Alert";
import CloseIcon from '@mui/icons-material/Close';
import Papa from 'papaparse';
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
    PictureElement: any
}


function AdminPageView() {
    const [AdminConfirmToggledPopup, setAdminConfirmToggledPopup] = useState<boolean>(false)
    const [AdminConfirmPopupMessage, setAdminConfirmPopupMessage] = useState<string>('');
    const [AdminConfirmPopupColor, setAdminConfirmPopupColor] = useState<AlertColor>('info');
    const [ToggledPopup, setToggledPopup] = useState<boolean>(false)
    const [PopupMessage, setPopupMessage] = useState<string>('');
    const [PopupColor, setPopupColor] = useState<AlertColor>('info');
    const [Percents, setPercents] = useState<PercentData[]>([])
    const chartLabels = ['Error', 'Defect', 'Failure', 'UI Feature', 'Logic Feature'];
    const [ChartData, setChartData] = useState<number[]>([])
    const [ToggledMenu, setToggledMenu] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [Row, setRow] = useState<FormEntries[]>([]);
    const [Mode, setMode] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [CurrentColors, setCurrentColors] = useState({ Main: 'temp', Stroke: 'temp', Header: 'temp', Accent: 'temp', TextColor: 'temp', Contrast: 'temp' });
    const [CSVData, setCSVData] = useState([['Type', 'Page', 'URL', 'What you expect to happen', 'What did happen', 'Number of pictures']])
    const validSeverityValues = ["error", "warning", "info", "success"];
    const AdminSanitizedPopupColor = validSeverityValues.includes(AdminConfirmPopupColor) ? AdminConfirmPopupColor : "info";
    const sanitizedPopupColor = validSeverityValues.includes(PopupColor) ? PopupColor : "info";
    const QueryForFormEntries = async () => {
        const AddNewCSVRow = (temp: any) => {
            setCSVData(prevData => [...prevData, temp]);
        };
        await Axios.post("http://localhost:5000/PullAllEntries", {
        }).then(async (response) => {
            if (response.data.returned === true) {
                setRow([])
                setCSVData([['Type', 'Page', 'URL', 'What you expect to happen', 'What did happen', 'Number of pictures']])
                const entriesPromises = response.data.result.map(async (entry: any, iteration: number) => {
                    const Id = entry.EntryId;
                    const Type = entry.TypeOfEntry;
                    const Page = entry.PageOfError;
                    const URL = entry.URLOfError;
                    const WhatDidHappen = entry.WhatDidHappen;
                    const WhatExpectHappen = entry.WhatIsExpected;
                    const NumOfPictures = entry.NumOfPictures;
                    
                    AddNewCSVRow([Type, Page, URL, WhatDidHappen, WhatExpectHappen, NumOfPictures])

                    let Element: any = <div></div>;

                    if (NumOfPictures > 0) {
                        const pictures = await PullPictures(Id);
                        Element = pictures;
                    }

                    const newFormEntry: FormEntries = {
                        EntryId: Id,
                        Type: Type,
                        Page: Page,
                        URL: URL,
                        WhatDidHappen: WhatDidHappen,
                        WhatExpectHappen: WhatExpectHappen,
                        NumOfPictures: NumOfPictures,
                        PictureElement: Element,
                    };

                    return newFormEntry;
                });

                const newRows = await Promise.all(entriesPromises);
                setRow(newRows);
            }
        }).catch((error) => {
            console.error(error)
        })

    }
    //Deletes all form entries and every picture associated with the form entries
    const DeleteAllEntries = async () => {
        const response = await Axios.post("http://localhost:5000/DeleteAllEntries", {
        });
        if (response.data.returned === true) {
            setToggledPopup(true)
            setPopupMessage('Successfully deleted all entries!')
            setPopupColor('success')
        }
        else {
            setToggledPopup(true)
            setPopupMessage('Something happened while contacting the server!')
            setPopupColor('error')
        }
    }
    //generates the CSV file from the database
    const GenerateCSVFile = () => {
        const GeneratedCSVFile = Papa.unparse(CSVData)
        const blob = new Blob([GeneratedCSVFile], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if ((navigator as any).msSaveBlob) {
            // For IE
            (navigator as any).msSaveBlob(blob, 'data.csv');
        } else {
            // For other browsers
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = 'data.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    //function to pull pictures by the EntryId, data is a file when pulled from database, inside of the file is the base64 Data URL that displays the image
    //is only called if NumOfPictures > 0
    const PullPictures = async (EntryId: number) => {
        try {
            const response = await Axios.post("http://localhost:5000/PullPicturesById", {
                EntryId: EntryId
            });

            const picturesPromises = response.data.result.map(async (pictureData: any) => {
                const binaryDataInitial: Uint8Array = pictureData.PictureBlob.data;
                const binaryArray: number[] = Array.from(binaryDataInitial);
                const uint8Array = new Uint8Array(binaryArray);

                const base64String = uint8Array.reduce((str, byte) => str + String.fromCharCode(byte), '');
                const base64Encoded = btoa(base64String);

                const binaryString: string = atob(base64Encoded);

                const binaryData: Uint8Array = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    binaryData[i] = binaryString.charCodeAt(i);
                }

                const blob: Blob = new Blob([binaryData], { type: 'application/octet-stream' });
                const fileReader: FileReader = new FileReader();

                // Use a Promise to handle asynchronous reading of the Blob
                const readBlob = () => {
                    return new Promise<string>((resolve) => {
                        fileReader.onload = (event) => {
                            const textContent: string = event?.target?.result as string;
                            resolve(textContent);
                        };
                        fileReader.readAsText(blob);
                    });
                };

                const textContent = await readBlob();
                return <img className="image" src={textContent}></img>;
            });

            // Use Promise.all to wait for all picture promises to resolve
            const pictures = await Promise.all(picturesPromises);
            //need to loop over all the ModalStates so we can get the correct one associated with this particular modal
            return (<TablePictures Pictures={pictures}></TablePictures>);
        } catch (error) {
            console.error(error);
            return [<div key={0}>Error loading pictures for EntryId: {EntryId}</div>];
        }
    };
    //counts each iteration of each type of error, and calculates percentages
    const CalculateChartData = () => {
        var chartNumber = [0, 0, 0, 0, 0]
        var percentages = ['', '', '', '', '']
        var PercentObject: PercentData[] = []
        var total: number = 0
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
            setInitialLoad(false)
            console.log('Initial load effect fired');
            QueryForFormEntries();
        }
    },[]);
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
                        <TableContainer sx={{ width: '1250px' }} component={Paper}>
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
                            GenerateCSVFile()
                        }} sx={{
                            m: '24px',
                            py: '12px',
                            bgcolor: '#107C41', ':hover': {
                                bgcolor: '#0a5c2f',
                            }
                        }} variant="contained"><ArticleIcon></ArticleIcon><Box className='Submit'>Export to Excel</Box></Button>
                        <Button onClick={() => {
                            setAdminConfirmToggledPopup(true)
                            setAdminConfirmPopupMessage('Are you sure you want to delete all the entries?')
                            setAdminConfirmPopupColor('error')
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
            <Modal className="AdminConfirmPopup" open={AdminConfirmToggledPopup} onClose={() => { setAdminConfirmToggledPopup(false) }}>
                <Box className='AdminConfirmContainer'>
                    <Box className='StatusHeader'>
                        <IconButton onClick={() => { setAdminConfirmToggledPopup(false) }}><CloseIcon></CloseIcon></IconButton>
                    </Box>
                    <Divider></Divider>
                    <Alert severity={AdminSanitizedPopupColor}>
                        {AdminConfirmPopupMessage}
                    </Alert>
                    <Button onClick={() => {
                        setAdminConfirmToggledPopup(false)
                        DeleteAllEntries()
                    }} sx={{
                        m: '12px',
                        bgcolor: '#eb311c', ':hover': {
                            bgcolor: '#d42a17',
                        }
                    }} variant="contained"><Box className='Submit'>Yes</Box></Button>
                </Box>
            </Modal>
            <Modal className="StatusPopup" open={ToggledPopup} onClose={() => { setToggledPopup(false) }}>
                <Box className='StatusContainer'>
                    <Box className='StatusHeader'>
                        <IconButton onClick={() => { setToggledPopup(false) }}><CloseIcon></CloseIcon></IconButton>
                    </Box>
                    <Divider></Divider>
                    <Alert severity={sanitizedPopupColor}>
                        {PopupMessage}
                    </Alert>
                    <Button onClick={() => {
                        setToggledPopup(false)
                        window.location.reload()
                    }} sx={{
                        m: '12px',
                        bgcolor: '#F60', ':hover': {
                            bgcolor: '#CD5200',
                        }
                    }} variant="contained"><Box className='Submit'>Ok</Box></Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default AdminPageView