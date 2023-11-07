import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
} from '@mui/material';

// components
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { prod } from "../utils/env";
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { WithdrawListHead, WithdrawListToolbar } from '../sections/@dashboard/withdraws';
import { fToNow } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'time', label: 'Time', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'transaction', label: 'Transaction', alignRight: false },
];

const StyledContent = styled('div')(({ theme }) => ({
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.time.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function WithdrawPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [listTransaction, setListTransaction] = useState([]);

  const [amount, setAmount] = useState(0.00);
  const [faCode, setFaCode] = useState("");

  const [balance, setBalance] = useState(0);
  const [currentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
  const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listTransaction.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    const configGetBalance = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/getBalance/${currentEmail}`,
      headers: {
        Authorization: `Bearer ${currentAccessToken}`
      }
    };

    axios.request(configGetBalance).then(response => {
      setBalance(response.data);
    });
  }, [currentEmail, currentAccessToken]);

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSubmit = () => {
    if (!amount || !faCode) {
      Swal.fire({
        title: "Please enter both amount and faCode!",
        icon: "error",
        timer: 3000,
        position: 'center',
        showConfirmButton: false
      });
    } else if (Number.isNaN(amount) || parseFloat(amount) <= 0) {
      Swal.fire({
        title: "Amount must be a valid number greater than 0!",
        icon: "error",
        timer: 3000,
        position: 'center',
        showConfirmButton: false
      });
    } else if (!/^[0-9.]*$/.test(amount)) {
      Swal.fire({
        title: "Amount must contain only numbers or a dot!",
        icon: "error",
        timer: 3000,
        position: 'center',
        showConfirmButton: false
      });
    } else if (balance - amount < 0.1) {
      Swal.fire({
        title: "Cannot withdraw below minimum of balance: $0.1!",
        icon: "error",
        timer: 3000,
        position: 'center',
        showConfirmButton: false
      });
    } else {
      const data = JSON.stringify({
        email: currentEmail,
        "amount": amount,
        code: faCode
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${prod}/api/v1/secured/withdraw-ib`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentAccessToken}`
        },
        "data": data
      };

      axios.request(config)
        .then(response => {
          if (response.data === "Rút thành công!") {
            Swal.fire({
              title: "Withdraw order has been created!",
              icon: "success",
              timer: 3000,
              position: 'center',
              showConfirmButton: false
            }).then(() => {
              window.location.reload();
            });
          } else if (response.data === "Mã 2FA không chính xác!") {
            Swal.fire({
              title: "Your 2FA is invalid!",
              icon: "error",
              timer: 3000,
              position: 'center',
              showConfirmButton: false
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/getTransaction/${currentEmail}`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };

    axios.request(config)
      .then((response) => {
        setListTransaction(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listTransaction.length) : 0;

  const filteredUsers = applySortFilter(listTransaction, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

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
    <>
      <Helmet>
        <title> Withdrawl </title>
        <link rel='icon' type='image/x-icon' href='/assets/logo.svg' />


      </Helmet>

      <Container>
        <StyledContent>
          <Stack spacing={3}>
            <TextField name="amount" type="text" label="Enter amount to withdraw..." onChange={(e) => { setAmount(e.target.value) }} />
            <TextField name="facode" type="text" label="Enter 2fa code to withdraw..." onChange={(e) => { setFaCode(e.target.value) }} />
            <TextField name="facode" type="text" value={`$${balance}`} disabled />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
              Withdraw
            </LoadingButton>
          </Stack>

          <Container id="withdraw-btn">
            <Card  >
              <WithdrawListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                  <WithdrawListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={listTransaction.length}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, time, amount, status, transaction } = row;
                        return (
                          <TableRow hover key={id}>
                            <TableCell align="left">{id}</TableCell>

                            <TableCell align="left">{fToNow(handleConvertTime(time))}</TableCell>

                            <TableCell align="left">{amount}</TableCell>

                            <TableCell align="left">
                              <Label color={(status === 0 && 'primary') || 'success'}>{status === 0 ? "Pending" : "Success"}</Label>
                            </TableCell>


                            <TableCell align="left">{transaction}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={listTransaction.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>
        </StyledContent>
      </Container>


    </>
  );
}
