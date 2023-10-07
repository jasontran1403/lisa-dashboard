import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
// @mui
import Swal from 'sweetalert2';
import { Grid, Button, Container, Stack, Typography, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';

// components
import Iconify from '../components/iconify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const StyledContent = styled('div')(({ theme }) => ({
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// ----------------------------------------------------------------------

export default function InputFileUpload() {
    const [fileSelected, setFileSelected] = useState(null);
    const [isSelected, setIsSelected] = useState(true);
    const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
    const [isLoading, setIsLoading] = useState(false);
    const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");


    const handleFileSelect = (e) => {
        setFileSelected(e.target.files[0]);
        setIsSelected(!isSelected);
    };

    const handleUpload = () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", fileSelected);

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://lionfish-app-l56d2.ondigitalocean.app/api/v1/secured/ib`,
            headers: {
                Authorization: `Bearer ${currentAccessToken}`
            },
            data: formData
        };

        axios.request(config)
            .then(response => {
                if (response.data === "OK") {
                    Swal.fire({
                        title: "Uploaded successful, message will be returned to telegram!",
                        icon: "success",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: response.data,
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    })
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: "Please remove protected mode and try again!",
                    icon: "error",
                    timer: 3000,
                    position: 'center',
                    showConfirmButton: false
                })
            });

        setIsLoading(false);
    }

    const handleRemove = () => {
        setFileSelected(null);
        setIsSelected(!isSelected);
    }
    return (
        <>
            <Helmet>
                <title> Something </title>
            </Helmet>

            <Container>
                <StyledContent>
                    <Stack spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                type="text"
                                value={fileSelected ? `File name ${fileSelected.name}` : 'Please select file to upload'}
                                fullWidth
                                disabled={!fileSelected}
                            />
                            <TextField
                                type="text"
                                value={fileSelected ? `File type ${fileSelected.type}` : 'Please select file to upload'}
                                fullWidth
                                disabled={!fileSelected}
                            />
                        </Grid>
                        <Grid container>
                            <Grid item xs={4} sm={4} md={4}>
                                <Button fullWidth component="label" disabled={isLoading} color={"warning"} startIcon={<CloudUploadIcon />}>
                                    Choose
                                    <VisuallyHiddenInput type="file" onChange={(e) => { handleFileSelect(e) }} />
                                </Button>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                                <Button onClick={handleRemove} fullWidth disabled={isSelected || isLoading} component="label" color={"error"} startIcon={<CloudUploadIcon />}>
                                    Remove
                                </Button>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                                <Button onClick={handleUpload} fullWidth disabled={isSelected || isLoading} component="label" color={"success"} startIcon={<CloudUploadIcon />}>
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>

                </StyledContent>
            </Container>
        </>
    );
}
