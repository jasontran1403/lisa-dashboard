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
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://jellyfish-app-kafzn.ondigitalocean.app/api/v1/auth/getNetwork/${encodeURI(email)}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setProduct([...result]);
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    setIsLoading(true);

    fetchNetwork(currentRoot);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return (() => {
      clearTimeout(timeout);
    })
  }, [currentRoot]);

  return (
    <>
      <Helmet>
        <title> Something </title>
      </Helmet>

      <Container>
        <ProductList products={product} onProductClick={handleProductClick} />
        <ProductCartWidget onGoBackClick={handleGoBack}/>
      </Container>
    </>
  );
}
