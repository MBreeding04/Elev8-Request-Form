import { Box, Divider, TextField, Button, Modal, IconButton } from "@mui/material";
import Alert, { AlertColor } from "@mui/material/Alert";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Axios from "axios";
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import './Form.css'
function Form() {
    //states to handle data
    const [TypeError, setTypeError] = useState<string | undefined>(undefined);
    const [PageEntry, setPageEntry] = useState<string>('');
    const [URLEntry, SetURLEntry] = useState<string>('');
    const [WhatHappenedEntry, setWhatHappenedEntry] = useState<string>('');
    const [WhatDidHappenedEntry, setWhatDidHappenedEntry] = useState<string>('');
    const [dragging, setDragging] = useState(false);
    const [Images, setImages] = useState<FileList>();
    const [CurrentUserId, setCurrentUserId] = useState<number>()
    const [ToggledPopup, setToggledPopup] = useState<boolean>(false)
    const [PopupMessage, setPopupMessage] = useState<string>('');
    const [PopupColor, setPopupColor] = useState<AlertColor>('info');
    const isUndefined = () =>{
        if(TypeError === undefined){
            return false
        }
    }
    const validSeverityValues = ["error", "warning", "info", "success"];
    const sanitizedPopupColor = validSeverityValues.includes(PopupColor) ? PopupColor : "info";
    useEffect(() => {
        console.log(TypeError)
    },[TypeError])
    //handles dropping of files into file drop zone
    useEffect(() => {
        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault();
            setDragging(true);
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            setDragging(true);
        };

        const handleDragLeave = () => {
            setDragging(false);
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const files = e.dataTransfer!.files;
            handleFiles(files);
        };
        const handleFiles = async (files: FileList) => {
            // Handle the dropped files (e.g., upload to a server, process, etc.)
            console.log('Dropped files:', files);
            setImages(files)
        };

        // Add event listeners
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('dragenter', handleDragEnter);
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('dragleave', handleDragLeave);
            dropZone.addEventListener('drop', handleDrop);
        }

        // Clean up event listeners on component unmount
        return () => {
            if (dropZone) {
                dropZone.removeEventListener('dragenter', handleDragEnter);
                dropZone.removeEventListener('dragover', handleDragOver);
                dropZone.removeEventListener('dragleave', handleDragLeave);
                dropZone.removeEventListener('drop', handleDrop);
            }
        };

    }, []);

    //function to handle form submit, pushes to database and checks to see if images need to be inputted to database
    const HandleFormEntrySubmit = async () => {
        const numOfPictures = () => {
            if (Images === undefined || Images === null) {
                return 0
            }
            else {
                return Images!.length
            }
        }
        await Axios.post("http://localhost:5000/InputFormEntry", {
            TypeOfError: TypeError,
            PageOfError: PageEntry,
            URLOfError: URLEntry,
            WhatIsExpected: WhatHappenedEntry,
            WhatDidHappen: WhatDidHappenedEntry,
            NumOfPictures: numOfPictures()
        }).then(async (response) => {
            if (response.data.inserted === true) {
                console.log('passed')
                const newUserId = response.data.result.insertId;
                // Log the currentUserId after setting it
                if (Images === undefined) {
                    console.log('no images need to be processed')
                    setToggledPopup(true)
                    setPopupMessage('Inputed data successfully!')
                    setPopupColor('success')
                }
                else {
                    setCurrentUserId(newUserId);
                }
            }
            else {
                setToggledPopup(true)
                setPopupMessage('Something happened when contacting the server!')
                setPopupColor('error')
            }
        }).catch(() => {
            setToggledPopup(true)
            setPopupMessage('Something happened when contacting the server!')
            setPopupColor('error')
        });
        setPageEntry('')
        setTypeError(undefined)
        SetURLEntry('')
        setWhatHappenedEntry('')
        setWhatDidHappenedEntry('')
    }
    //function to handle image files, nested is another function but only this function needs the nested function
    const handleImageEntries = async () => {
        //threshold to trigger the popup
        var threshold = Images!.length
        var count = 0;
        for (let i = 0; i < Images!.length; i++) {
            count++;
            const submitImageData = async (binaryData: Blob) => {
                try {
                    // Convert Blob to Base64
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const base64Data = reader.result as string;
                        // Your database insertion logic here...

                        const response = await Axios.post(
                            "http://localhost:5000/InputImages",
                            {
                                Data: base64Data,
                                UUID: CurrentUserId
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        if (response.data.inserted === true) {
                            console.log('Passed');
                            setToggledPopup(true)
                            setPopupMessage('Inputed data successfully!')
                            setPopupColor('success')
                        } else {
                            console.log('Not Passed');
                            setPopupMessage('Something happened when contacting the server!')
                            setPopupColor('error')
                        }
                    };
                    reader.readAsDataURL(binaryData);
                } catch (error) {
                    console.error('Error sending image data:', error);
                    setPopupMessage('Something happened when contacting the server!')
                    setPopupColor('error')
                }
            };
            //converts file to blob data to push to database
            const reader = new FileReader();
            reader.onload = async (e) => {
                const binaryData = e.target!.result;
                if (binaryData instanceof ArrayBuffer) {
                    // Create a Blob from the ArrayBuffer
                    const blob = new Blob([new Uint8Array(binaryData)], { type: 'image/png' });

                    // Send the image data
                    await submitImageData(blob);
                }
                else {
                    console.error('Invalid binary data format.');
                    setToggledPopup(true)
                    setPopupMessage('Invalid file type or size, Please input pngs and make sure they are less than 5mb!')
                    setPopupColor('error')
                }
            };

            // Read the file as binary data using readAsArrayBuffer
            reader.readAsArrayBuffer(Images![i]);
        }
        if (threshold === count) {
            setToggledPopup(true)
            setPageEntry('')
            setTypeError(undefined)
            SetURLEntry('')
            setWhatHappenedEntry('')
            setWhatDidHappenedEntry('')
        }
    };
    //fired when CurrentUserId is updated, CurrentUserId only updates if there are files present
    useEffect(() => {
        if (CurrentUserId !== undefined) {
            handleImageEntries();
        }
    }, [CurrentUserId]);
    return (
        <Box className='Form'>
            <Box className='SubHeaders'>
                Bug/Feature Request
            </Box>
            <Divider variant="middle" color='#FF6600'></Divider>
            <Box className='questionContainer'>
                <Box className='Headers'>1.</Box>
                <Box className='questionInput'>
                    <Box className='Questions'>
                        What are you reporting?
                    </Box>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            onChange={(e) => {
                                setTypeError(e.target.value)
                            }}
                            value={TypeError}
                        >
                            <FormControlLabel className="Questions" value="Error" checked={isUndefined()} control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Error" />
                            <FormControlLabel className="Questions" value="Defect" checked={isUndefined()} control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Defect" />
                            <FormControlLabel className="Questions" value="Failure" checked={isUndefined()} control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Failure" />
                            <FormControlLabel className="Questions" value="UI Feature" checked={isUndefined()}  control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="UI Feature" />
                            <FormControlLabel className="Questions" value="Logic Feature" checked={isUndefined()} control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Logic Feature" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>2.</Box>
                <Box className='questionInput'>
                    <Box className='Questions'>
                        What page is the error/feature being performed on?
                    </Box>
                    <TextField variant="outlined" onChange={(e) => {
                        setPageEntry(e.target.value)
                    }} value={PageEntry}/>
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>3.</Box>
                <Box className='questionInput'>
                    <Box className='Questions'>
                        What is the URL of the page?
                    </Box>
                    <TextField variant="outlined" onChange={(e) => {
                        SetURLEntry(e.target.value)
                    }} value={URLEntry} />
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>4.</Box>
                <Box className='questionInput'>
                    <Box className='Questions'>
                        What do you expect to happen?
                    </Box>
                    <TextField
                        id="filled-multiline-static"
                        multiline
                        rows={6}
                        variant="outlined"
                        onChange={(e) => {
                            setWhatHappenedEntry(e.target.value)
                        }}
                        value={WhatHappenedEntry}
                    />
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>5.</Box>
                <Box className='questionInput'>
                    <Box className='Questions'>
                        What did happen?
                    </Box>
                    <TextField
                        id="filled-multiline-static"
                        multiline
                        rows={6}
                        variant="outlined"
                        onChange={(e) => {
                            setWhatDidHappenedEntry(e.target.value)
                        }}
                        value={WhatDidHappenedEntry}
                    />
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>6.</Box>
                <Box className='DocumentInput'>
                    <Box className='Questions'>
                        Please submit pictures of the error/feature:
                    </Box>
                    <Box className='SubmitDocuments' id='dropZone'>

                        <Box className='gray'>
                            Drag and Drop files here or browse to upload.
                            <FileUploadIcon sx={{ alignSelf: 'center' }}></FileUploadIcon>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Button onClick={() => {
                HandleFormEntrySubmit()
            }} sx={{
                width: '100%',
                bgcolor: '#F60', ':hover': {
                    bgcolor: '#CD5200',
                }
            }} variant="contained"><Box className='Submit'>Submit</Box></Button>
            <Modal className="StatusPopup" open={ToggledPopup} onClose={() => { setToggledPopup(false) }}>
                <Box className='StatusContainer'>
                    <Box className='StatusHeader'>
                        <IconButton onClick={()=>{setToggledPopup(false)}}><CloseIcon></CloseIcon></IconButton>
                    </Box>
                    <Divider></Divider>
                    <Alert severity={sanitizedPopupColor}>
                        {PopupMessage}
                    </Alert>
                    <Button onClick={() => {
                        setToggledPopup(false)
                    }} sx={{
                        m:'12px',
                        bgcolor: '#F60', ':hover': {
                            bgcolor: '#CD5200',
                        }
                    }} variant="contained"><Box className='Submit'>Ok</Box></Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default Form