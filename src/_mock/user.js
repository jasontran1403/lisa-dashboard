import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import axios from "axios";
// ----------------------------------------------------------------------
const email = localStorage.getItem("email") ? localStorage.getItem("email") : "";
const accessToken = localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "";

const users = [];

if (email !== null) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://jellyfish-app-kafzn.ondigitalocean.app/api/v1/secured/get-exness/${encodeURI(email)}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

  axios.request(config)
    .then((response) => {
      response.data.forEach((item) => {
        users.push({ exness: item });
      })
    })
    .catch((error) => {
      console.log(error);
    });
}
export default users;

