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
//Main form(questions) where the user inputs their data
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
    const isUndefined = () => {
        if (TypeError === undefined) {
            return false
        }
    }
    const validSeverityValues = ["error", "warning", "info", "success"];
    const sanitizedPopupColor = validSeverityValues.includes(PopupColor) ? PopupColor : "info";
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
    const HandleFormEntrySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
                    setPopupMessage('Inputted data successfully!')
                    setPopupColor('success')
                    SendToGithub(false)
                }
                else {
                    //triggers the processing for images
                    setCurrentUserId(newUserId);
                    SendToGithub(true)
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
                        const response = await Axios.post(
                            "http://localhost:5000/InputImages",
                            {
                                Data: base64Data.toString(),
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
                            setPopupMessage('Inputted data successfully!')
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
    const SendToGithub = async (isPicture: boolean) => {
        const username = 'MBreeding04';
        const repo = 'Pawns-And-Puzzles-Website';
        const token = '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';
        const apiUrl = `https://api.github.com/repos/${username}/${repo}/issues`;
    
        // Add your actual label here
    
        const PreBody = `Type:  ${TypeError}
            Page:  ${PageEntry}
            URL:   ${URLEntry}
            What do you expect to happen:
            \n${WhatHappenedEntry}
            What did happen:
            \n${WhatDidHappenedEntry}
            \n`;
    
        let ImageBody = '';
    
        if (isPicture) {
            try {
                // Encode images to base64 and include in the issue body
                if (Images) {
                    for (let i = 0; i < Images.length; i++) {
                        //const file = Images[i];
                        //const base64Data: any = await readAsDataURL(file);
                        // Format the base64 data as a direct link to the image
                        //ImageBody += `![File${i + 1}](data:image/png;base64,${base64Data.split(',')[1]})\n`;
                        ImageBody += `file#${i+1} placeholder\n\n`
                    }
                }
            } catch (error: any) {
                console.error('Error encoding files:', error.message);
                return;
            }
        }
    
        // Create the issue with the image references
        const issueData = {
            title: 'Bug/Feature Request',
            body: `${PreBody}\n${ImageBody}`,
            labels: [TypeError], // Replace with the actual label name
        };
    
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(issueData),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to create issue: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Issue created successfully:', data);
        } catch (error: any) {
            console.error('Error creating issue:', error.message);
        }
    };
    
    return (
        <Box className='Form'>
            <Box className='SubHeaders'>
                Bug/Feature Request
            </Box>
            <Divider variant="middle" color='#FF6600'></Divider>
            <form onSubmit={HandleFormEntrySubmit}>
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
                                aria-required="true"
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
                                <FormControlLabel className="Questions" value="UI Feature" checked={isUndefined()} control={<Radio sx={{
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
                        <TextField required variant="outlined" onChange={(e) => {
                            setPageEntry(e.target.value)
                        }} value={PageEntry} />
                    </Box>
                </Box>
                <Box className='questionContainer'>
                    <Box className='Headers'>3.</Box>
                    <Box className='questionInput'>
                        <Box className='Questions'>
                            What is the URL of the page?
                        </Box>
                        <TextField required variant="outlined" onChange={(e) => {
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
                            required
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
                            required
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
                                (5mb upload limit for each picture)
                                <FileUploadIcon sx={{ alignSelf: 'center' }}></FileUploadIcon>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Button type="submit" sx={{
                    width: '100%',
                    bgcolor: '#F60', ':hover': {
                        bgcolor: '#CD5200',
                    }
                }} variant="contained" disabled={!TypeError}><Box className='Submit'>Submit</Box></Button>
            </form>
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

export default Form