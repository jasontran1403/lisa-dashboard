import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
// @mui
import Swal from 'sweetalert2';
import { Grid, Button, Container, Stack, Typography, TextField, Popover, Input, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prod, dev } from "../utils/env";

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

const StyledProductImg = styled('img')({
    top: 0,
    width: '40%',
    height: '40%',
    objectFit: 'cover',
    margin: 'auto',
});

// ----------------------------------------------------------------------

export default function InputFileUpload() {
    const navigate = useNavigate();
    const [fileSelected, setFileSelected] = useState(null);
    const [isSelected, setIsSelected] = useState(true);
    const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
    const [url, setUrl] = useState("");
    const [listExness, setListExness] = useState([]);
    const [currentExness, setCurrentExness] = useState("");
    const [exness, setExness] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open2, setOpen2] = useState(null);
    const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");


    const handleFileSelect = (e) => {
        setFileSelected(e.target.files[0]);
        setIsSelected(!isSelected);
        if (e.target.files[0]) {
            setUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleOpen2 = (event) => {
        setOpen2(event.currentTarget);
    };

    const handleClose2 = () => {
        setOpen2(null);
    };

    const handleChangeExness = (exness) => {
        setCurrentExness(exness);
        handleClose2();
    }

    useEffect(() => {
        setIsLoading(true);

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${prod}/api/v1/secured/get-exness/${encodeURI(currentEmail)}`,
            headers: {
                'Authorization': `Bearer ${currentAccessToken}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.data.length > 0) {
                    setListExness(response.data);
                    setCurrentExness(response.data[0]);
                }
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    Swal.fire({
                        title: "An error occured",
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: "Session is ended, please login again !",
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        localStorage.clear();
                        navigate('/login', { replace: true });
                    });
                }
            });

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return (() => {
            clearTimeout(timeout);
        })
    }, []);

    const handleUpload = () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", fileSelected);
        formData.append("exness", currentExness);

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${prod}/api/v1/secured/upload-transaction`,
            headers: {
                Authorization: `Bearer ${currentAccessToken}`
            },
            data: formData
        };

        axios.request(config)
            .then(response => {
                if (response.data === "Error") {
                    Swal.fire({
                        title: response.data,
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    })
                } else {
                    Swal.fire({
                        title: "Uploaded successful, message will be returned to telegram!",
                        icon: "success",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });

        setIsLoading(false);
    }

    const handleRemove = () => {
        setFileSelected(null);
        setIsSelected(!isSelected);
        setUrl("");
    }
    return (
        <>
            <Helmet>
                <title> Upload </title>
                <link rel='icon' type='image/x-icon' href='/assets/logo.svg' />


            </Helmet>

            <Container>
                <StyledContent>
                    <Stack spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            {url ? <StyledProductImg alt={"img"} src={url} /> : <StyledProductImg alt={"img"} src={"/assets/default-upload.png"} />}

                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} >
                                <Input className="form-field " onClick={handleOpen2} type="text" value={currentExness} style={{ minWidth: "200px", marginBottom: "15px", paddingLeft: "10px", cursor: "pointer!important", }} />
                                <Popover
                                    open={Boolean(open2)}
                                    anchorEl={open2}
                                    onClose={handleClose2}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    PaperProps={{
                                        sx: {
                                            p: 1,
                                            width: 240,
                                            marginTop: "40px",
                                            '& .MuiMenuItem-root': {
                                                px: 1,
                                                typography: 'body2',
                                                borderRadius: 0.75,
                                            },
                                        },
                                    }}
                                >
                                    {listExness.map((item, index) => {
                                        return <MenuItem key={index} onClick={() => { handleChangeExness(item) }}>
                                            <Iconify sx={{ mr: 2 }} />
                                            {item}
                                        </MenuItem>
                                    })}
                                </Popover>
                            </Grid>
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
