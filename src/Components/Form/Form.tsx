import { Box, Divider, TextField, Button } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import './Form.css'
function Form() {
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
                    <TextField variant="outlined" />
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>3.</Box>
                <Box className='questionInput'>
                    <Box className='Questions'>
                        What is the URL of the page?
                    </Box>
                    <TextField variant="outlined" />
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
                    />
                </Box>
            </Box>
            <Box className='questionContainer'>
                <Box className='Headers'>6.</Box>
                <Box className='DocumentInput'>
                    <Box className='Questions'>
                        Please submit pictures of the error/feature:
                    </Box>
                    <Box className='SubmitDocuments'>
                        <Box className='gray'>
                            Drag and Drop files here or browse to upload.
                            <FileUploadIcon sx={{alignSelf:'center'}}></FileUploadIcon>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Button onClick={()=>{
                    
                }} sx={{
                    width:'100%',
                    bgcolor: '#F60', ':hover': {
                        bgcolor: '#CD5200',
                    }
                }} variant="contained"><Box className='Submit'>Submit</Box></Button>
        </Box>
    );
}

export default Form