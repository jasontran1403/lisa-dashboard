// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { format } from 'date-fns';
import { fToNow } from '../../../utils/formatTime';
// components
import { fCurrency } from '../../../utils/formatNumber';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

TransactionsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function TransactionsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((transaction, index) => (
            <TransactionItem key={index} transaction={transaction} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          <Link href={"/transaction"}> View all </Link>
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------
function TransactionItem({ transaction }) {
  const { sender, amount, time } = transaction;
  
  const handleConvertTime = (unixTimestamp) => {
    // return format(new Date(timeunix * 1000), 'HH:mm:ss dd/MM/yyyy');
    const date = new Date(unixTimestamp * 1000); // Nhân với 1000 để chuyển đổi sang mili giây

    const options = {
      weekday: 'short', // Ngày trong tuần (viết tắt)
      month: 'short',   // Tháng (viết tắt)
      day: '2-digit',    // Ngày trong tháng (số)
      year: 'numeric',   // Năm (số)
      hour: 'numeric',   // Giờ (số)
      minute: 'numeric', // Phút (số)
      second: 'numeric', // Giây (số)
      timeZoneName: 'short' // Tên múi giờ (viết tắt)
    };

    return date.toLocaleString('en-US', options);
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          Received {fCurrency(amount)} IB from exness id {sender}
        </Link>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(handleConvertTime(time))}
      </Typography>
    </Stack>
  );
}
