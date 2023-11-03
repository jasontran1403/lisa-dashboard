import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { Button, FormGroup, FormLabel, Input, Typography, Grid } from '@mui/material';
import Swal from 'sweetalert2';
import Label from '../label';
import { prod, dev } from "../../utils/env";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledProductImg = styled('img')({
    top: 0,
    width: '60%',
    height: '60%',
    objectFit: 'cover',
    margin: 'auto',
});

export default function ModalDetail({ exness, isOpen, onClose }) {
    const navigate = useNavigate();
    const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
    const [url, setUrl] = useState("");

    useEffect(() => {
        const config = {
            method: 'get',
            url: `${prod}/api/v1/secured/get-exness/exness=${exness}`,
            headers: {
                'Authorization': `Bearer ${currentAccessToken}`
            }
        };

        if (isOpen) {
            axios.request(config)
                .then((response) => {
                    setUrl(response.data.message);
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
        }
    }, [exness, isOpen]);

    const handleSubmit = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${prod}/api/v1/secured/active-exness/${exness}`,
            headers: {
                'Authorization': `Bearer ${currentAccessToken}`
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    onClose();
                    Swal.fire({
                        title: "Success",
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
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style} className="flex">
                    {url ? <StyledProductImg alt={"error"} src={url} /> : ""}
                    
                    <Grid>
                        <Button onClick={handleSubmit}>Approve</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}