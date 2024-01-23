import { Box, Divider, TextField, Button } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Axios from "axios";
import { useState, useEffect } from "react";
import './Form.css'
import { v4 as uuidv4 } from 'uuid';
function generateUUID(): string {
    return uuidv4();
}
function Form() {
    const [TypeError, setTypeError] = useState<string>('');
    const [PageEntry, setPageEntry] = useState<string>('');
    const [URLEntry, SetURLEntry] = useState<string>('');
    const [WhatHappenedEntry, setWhatHappenedEntry] = useState<string>('');
    const [WhatDidHappenedEntry, setWhatDidHappenedEntry] = useState<string>('');
    const [dragging, setDragging] = useState(false);
    const [Images, setImages] = useState<FileList>();
    const [CurrentUserId, setCurrentUserId] = useState<number>()

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

    const readBlobAsBinary = (blob: Blob): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to read blob as binary data.'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Error reading blob as binary data.'));
            };
            reader.readAsArrayBuffer(blob);
        });
    };
    const HandleFormEntrySubmit = async () => {
        await Axios.post("http://localhost:5000/InputFormEntry", {
            TypeOfError: TypeError,
            PageOfError: PageEntry,
            URLOfError: URLEntry,
            WhatIsExpected: WhatHappenedEntry,
            WhatDidHappen: WhatDidHappenedEntry,
            NumOfPictures: 5
        }).then(async (response) => {
            if (response.data.inserted === true) {
                console.log('passed')
                setCurrentUserId(response.data.result.insertId)
                console.log('I inserted the data')
            }
            else {
                console.log('not passed')
                console.log(response)
            }
        }).catch(() => {
            console.log('not passed')
        });
        if (Images === undefined) {
            console.log('no images need to be processed')
        }
        else {
            handleImageEntries()
        }
    }
    const handleImageEntries = async () => {
        for (let i = 0; i < Images!.length; i++) {
            const blob = new Blob([Images![i]], { type: Images![i].type });
            const binarydata = await readBlobAsBinary(blob)
            console.log(binarydata)
            await Axios.post("http://localhost:5000/InputImages",
                {

                    Blob: binarydata,
                    UUID: CurrentUserId,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                },

            ).then(async (response) => {
                console.log(response)
                if (response.data.inserted === true) {
                    console.log('passed')
                }
                else {
                    console.log('not passed')
                    console.log(response.data)
                }
            }).catch(() => {
                console.log('not passed')
            });
        }
    }
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
                            defaultValue="female"
                            name="radio-buttons-group"
                            onChange={(e) => {
                                setTypeError(e.target.value)
                            }}
                        >

                            <FormControlLabel className="Questions" value="Error" control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Error" />
                            <FormControlLabel className="Questions" value="Defect" control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Defect" />
                            <FormControlLabel className="Questions" value="Failure" control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="Failure" />
                            <FormControlLabel className="Questions" value="UI Feature" control={<Radio sx={{
                                '&, &.Mui-checked': {
                                    color: '#F60',
                                },
                            }} />} label="UI Feature" />
                            <FormControlLabel className="Questions" value="Logic Feature" control={<Radio sx={{
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
                    }} />
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
                    }} />
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
        </Box>
    );
}

export default Form