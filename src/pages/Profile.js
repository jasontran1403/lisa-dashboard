import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Button,Container, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import Iconify from '../components/iconify';


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

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
  const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
  const [refCode, setRefCode] = useState("");
  const [bio, setBio] = useState("");



  useEffect(() => {
    
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://lionfish-app-l56d2.ondigitalocean.app/api/v1/secured/get-account-info/${currentEmail}`,
      headers: { 
        'Authorization': `Bearer ${currentAccessToken}`
      },

    };
    
    axios.request(config)
    .then((response) => {
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
    })
    .catch((error) => {
      console.log(error);
    });
    
  }, []);

    const data = JSON.stringify({
      "email": currentEmail
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://lionfish-app-l56d2.ondigitalocean.app/api/v1/secured/get-code',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentAccessToken}`
      },
      "data": data
    };

    axios.request(config)
      .then((response) => {
        if (response.data.substring(0,1) === 0) {
          setRefCode(`0${response.data}`);
        } else {
          setRefCode(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });


  const handleSubmit = () => {
    if (firstName === "" || lastName === "") {
      Swal.fire({
        title: "All information is required!",
        icon: "error",
        timer: 3000,
        position: 'center',
        showConfirmButton: false
      });
      return;
    }

    const data = JSON.stringify({
      "email": currentEmail,
      "firstName": firstName,
      "lastName": lastName
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://lionfish-app-l56d2.ondigitalocean.app/api/v1/secured/edit-info',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentAccessToken}`
      },
      "data": data
    };

    axios.request(config)
      .then((response) => {
        if (response.data === "OK") {
          Swal.fire({
            title: "Update information successful",
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

  };
  return (
    <>
      <Helmet>
        <title> Profile </title>
        <link rel='icon' type='image/x-icon' href='/assets/logo.svg.png' />
      </Helmet>

      <Container>
        <StyledContent>
          <Stack spacing={3}>
            <div className="card">

              <div className="banner">
                <div className = "profile-img">
                <Button className="avatar-btn" fullWidth component="label" >      
                  <img src={ "assets/images/avatars/25.jpg"} alt="profile-img" />

                  <div className="overlay">
                    <div className="text">Change Avatar </div>
                  </div> 
                <VisuallyHiddenInput />
                
                </Button>                            
                </div>
               

              </div>
              <div className="menu">
                <div className="opener"><span /><span /><span /></div>
              </div>
              <h2 className="name">{firstName} {lastName} </h2>
              <div className="title">IEA Users</div>
              <div className="actions">
                  <div className="follow-info">
                      <h2><a href="#"><span>First Name</span><small > {firstName} </small></a></h2>
                      <h2><a href="#"><span>Ref Code</span><small>{refCode}</small></a></h2>
                  </div>
                  <div className="follow-info">
                      <h2><a href="#"><span>Last Name</span><small>{lastName}</small></a></h2>
                      <h2><a href="#"><span>Mail</span><small>{currentEmail}</small></a></h2>
                  </div>
                
              </div>
              <div className="desc">{bio}</div>
            </div>


            <h3 className='profile-title'> Update profile</h3>
            <TextField className="input-profile-email" name="email" type="text" value={currentEmail} readOnly />
            <TextField placeholder='Enter your FirstName' name="firstName" type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
            <TextField placeholder='Enter your LastName' name="lastName" type="text" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
            <TextField placeholder= 'Enter you description' name="bio" type="text" value={bio || ''} onChange={(e) => { setBio(e.target.value) }} />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
              Update profile
            </LoadingButton>
          </Stack>
        </StyledContent>
      </Container>
    </>
  );
}
