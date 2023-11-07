import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product, onProductClick }) {
  const { email, profit, commission, refferal, price, image } = product;

  return (
    <Card style={{ cursor: "pointer" }} onClick={() => onProductClick(email, refferal)} >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={email} src={image === '' ? '/assets/images/avatars/avatar_default.png' : image} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Typography variant="subtitle1" noWrap>
          Email: {`${email.substring(0, 12)}...`}
        </Typography>

        {commission === 0 ? <Typography variant="subtitle1" noWrap>
          Total Commission: $0
        </Typography> : <Typography variant="subtitle1" noWrap>
          Total Commission: {fCurrency(commission)}
        </Typography>}

        {profit === 0 ? <Typography variant="subtitle1" noWrap>
          Total Profit: $0
        </Typography> : <Typography variant="subtitle1" noWrap>
          Total Profit: {fCurrency(profit)}
        </Typography>}
      </Stack>
    </Card>
  );
}
