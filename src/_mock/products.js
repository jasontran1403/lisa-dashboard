import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  "admin1","admin2","admin3","admin4","admin5","admin6","admin7",
];
const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};
const products = [];
fetch(`https://jellyfish-app-kafzn.ondigitalocean.app/api/v1/auth/getNetwork/${encodeURI(localStorage.getItem("email"))}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    result.forEach((item, index) => {
      index += 1;
      products.push({id: index, cover: `/assets/images/products/product_${index}.jpg`, name: item.email, refferer: item.refferer, price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 })})
    })
  })
  .catch(error => console.log('error', error));


export default products;
