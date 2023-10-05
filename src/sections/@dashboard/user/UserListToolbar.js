import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Swal from 'sweetalert2';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  currentChose: PropTypes.array
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, currentChose }) {
  const submit = () => {
    if (currentChose.length > 0) {
      currentChose.forEach((item) => {
        handleDelete(item);
      })
    }
  }

  const handleDelete = (exness) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": localStorage.getItem("email"),
      "exness": exness,
      "type": 2
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://jellyfish-app-kafzn.ondigitalocean.app/api/v1/auth/update-exness", requestOptions)
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
        } else if (result.status === 404) {
          Swal.fire({
            title: result.message,
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          });
        }
      })
      .catch(error => {
        console.log(error.response)
      });
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search exness id..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

        {numSelected > 0 ? (
          <Tooltip title="Delete" onClick={submit}>
            <IconButton>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        ) : (
          // <Tooltip title="Filter list">
          //   <IconButton>
          //     <Iconify icon="ic:round-filter-list" />
          //   </IconButton>
          // </Tooltip>
          ""
        )}
    </StyledRoot>
  );
}
