import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, FormGroup, FormLabel, Input, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import Label from '../label';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ModalExness({ isOpen, onClose }) {
    const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
    const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
    const [exnessId, setExnessId] = useState("");

    const handleSubmit = () => {
        onClose();
        if (exnessId === "") {
            Swal.fire({
                title: "Vui lòng nhập exness id!",
                icon: "error",
                timer: 3000,
                position: 'center',
                showConfirmButton: false
            });
            return;
        }

        const data = JSON.stringify({
            "email": currentEmail,
            "exness": exnessId,
            "type": 1
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://lionfish-app-l56d2.ondigitalocean.app/api/v1/secured/update-exness',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentAccessToken}`
            },
            "data": data
        };

        axios.request(config)
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({
                        title: response.data.message,
                        icon: "success",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                } else if (response.data.status === 402) {
                    Swal.fire({
                        title: response.data.message,
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style} className="flex">
                    <Typography variant="h4" gutterBottom>
                        Add Exness ID
                    </Typography>
                    <Input value={exnessId} name="exness" onChange={(e) => { setExnessId(e.target.value) }} type="text" placeholder="Enter exness id..." autoComplete='false' />
                    <Button onClick={handleSubmit}>Add</Button>
                </Box>
            </Modal>
        </div>
    );
}