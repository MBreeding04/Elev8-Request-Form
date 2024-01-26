import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Menu, Modal, Button, Divider } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import './TablePictures.css'


function TablePictures(Pictures: any) {
    const [IsModalOpen, setIsModalOpen] = useState<boolean>(false)
    console.log('im from Tablepictures',Pictures)
    return (
        <Box>
            <Button onClick={()=>{
                setIsModalOpen(true)
            }}>Pictures</Button>
            <Modal className='TablePicturesModal' open={IsModalOpen}onClose={()=>{
                setIsModalOpen(false)
            }}><Box className='PictureCarousalBox'><Carousel className='PictureCarousal'>{Pictures.Pictures}</Carousel></Box></Modal>
        </Box>
    )
}
export default TablePictures