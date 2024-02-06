import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Menu, Modal, Button, Divider } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import CloseIcon from '@mui/icons-material/Close';
import './TablePictures.css'

//needs to be implicent any becuase Pictures is an object and cannot specify type
function TablePictures(Pictures: any) {
    const [IsModalOpen, setIsModalOpen] = useState<boolean>(false)
    return (
        <Box>
            <Button onClick={() => {
                setIsModalOpen(true)
            }}>Pictures</Button>
            <Modal className='TablePicturesModal' open={IsModalOpen} onClose={() => {
                setIsModalOpen(false)
            }}>
                <Box className='PictureCarousalBox'>
                    <Box className='PictureCarousalHeader'>
                        <IconButton onClick={() => { setIsModalOpen(false) }}><CloseIcon></CloseIcon></IconButton>
                    </Box>
                    <Divider sx={{ width: '100%' }}></Divider>
                    <Box className='PictureCarousalContainer'>
                        <Carousel className='PictureCarousal'>{Pictures.Pictures.map((item: any) => (
                            <div className='Image-Wrapper'>
                                {item}
                            </div>
                        ))}</Carousel>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}
export default TablePictures