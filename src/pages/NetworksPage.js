import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { faker } from '@faker-js/faker';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
// ----------------------------------------------------------------------

export default function NetworksPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [currentRoot, setCurrentRoot] = useState(localStorage.getItem("email"));
  const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
  const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
  const [prevRoot, setPrevRoot] = useState([]);

  const handleProductClick = (email, prev) => {
    setCurrentRoot(email);
    setPrevRoot([...prevRoot, prev]);
  };

  const handleGoBack = () => {
    if (prevRoot.length === 0) {
      return;
    }
    const cur = prevRoot.pop();
    setCurrentRoot(cur);
  }

  const fetchNetwork = (email) => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://lionfish-app-l56d2.ondigitalocean.app/api/v1/secured/get-network/${email}`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };
    axios.request(config)
      .then((response) => {
        setProduct([...response.data[1]]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    setIsLoading(true);

    fetchNetwork(currentRoot);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return (() => {
      clearTimeout(timeout);
    })
  }, [currentRoot]);

  return (
    <>
      <Helmet>
        <title> Network </title>
        <link rel='icon' type='image/x-icon' href='/assets/logo.svg.png' />

      </Helmet>

      <Container>
        <ProductList products={product} onProductClick={handleProductClick} />
        <ProductCartWidget onGoBackClick={handleGoBack} />
      </Container>
    </>
  );
}
