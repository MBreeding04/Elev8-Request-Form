import React, { useState } from 'react';
import { Box, IconButton, Menu, Modal, Button, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import './TextBoxPopup.css'
interface TextBoxProps{
    TextBlock: any //reason is this comes from an api request so its type will be any, receives a string
    TextHeader: string
}
function TextBox({TextBlock, TextHeader}: TextBoxProps) {
    const [IsModalOpen, setIsModalOpen] = useState<boolean>(false)
    return (
        <Box>
            <Button onClick={() => {
                setIsModalOpen(true)
            }}>Text</Button>
            <Modal className='TextBoxModal' open={IsModalOpen} onClose={() => {
                setIsModalOpen(false)
            }}>
                <Box className='TextBoxesBox'>
                    <Box className='TextBoxHeader'>
                        <IconButton onClick={() => { setIsModalOpen(false) }}><CloseIcon></CloseIcon></IconButton>
                    </Box>
                    <Divider sx={{ width: '100%' }}></Divider>
                    <Box className='TextBoxTitle'>
                        {TextHeader}
                    </Box>
                    <Box className='TextBoxContainer'>
                        <Box className='TextContent'>
                            {TextBlock}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}
export default TextBox