import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import Axios from "axios";
// ----------------------------------------------------------------------

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

const users = [];

if (localStorage.getItem("email") !== null) {
  fetch(`https://jellyfish-app-kafzn.ondigitalocean.app/api/v1/auth/get-exness/${encodeURI(localStorage.getItem("email"))}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    result.forEach((item) => {
      users.push({ exness: item });
    })
  })
  .catch(error => console.log('error', error));


} 
export default users;

