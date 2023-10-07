import * as React from 'react';
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
    const [exnessId, setExnessId] = React.useState("");

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

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": localStorage.getItem("email"),
            "exness": exnessId,
            "type": 1
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jellyfish-app-kafzn.ondigitalocean.app/api/v1/secured/update-exness", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === 200) {
                    Swal.fire({
                        title: result.message,
                        icon: "success",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                } else if (result.status === 226) {
                    Swal.fire({
                        title: result.message,
                        icon: "error",
                        timer: 3000,
                        position: 'center',
                        showConfirmButton: false
                    });
                }
            })
            .catch(error => console.log('error', error));
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