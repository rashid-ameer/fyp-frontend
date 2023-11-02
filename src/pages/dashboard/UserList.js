import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';

import { Link as RouterLink } from 'react-router-dom';

import { useTheme, styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';

// material
// import { useTheme } from '@mui/material/styles'; // important
import {
  Card,
  IconButton,
  Table,
  Stack,
  TextField,
  Tooltip,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Toolbar,
  TablePagination
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList, showAllUsersByBatch, getUserByRole, deleteUser } from '../../redux/slices/user';
import { getBatchesList } from '../../redux/slices/batch';
import { getRoleList } from '../../redux/slices/role';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/_dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'cmsId', label: 'CMS ID', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

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
  console.log('that', array);
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);
  const { roleList } = useSelector((state) => state.role);
  const { batchesList } = useSelector((state) => state.batch);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getRoleList());
    dispatch(getBatchesList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  // ****************

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick_ = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose_ = () => {
    setAnchorEl(null);
  };

  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const open1 = Boolean(anchorEl1);
  const handleClick1_ = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1_ = () => {
    setAnchorEl1(null);
  };

  // **** styled menu
  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0'
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5)
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        }
      }
    }
  }));

  // ***************
  // const [roleState, setRoleState] =useState('');
  const RoleFilterHandler = (e) => {
    setSelectRole(e.target.value);
    const a = e.target.value === 'Student' ? showBatchStatus(true) : showBatchStatus(false);
    if (e.target.value === 'All') {
      dispatch(getUserList());
    } else {
      dispatch(getUserByRole(roleList?.find((role) => role.role_name === e.target.value).id));
    }
  };

  const getByBatch = (e) => {
    setSelectBatch(e.target.value);
    if (e.target.value === 'All') {
      dispatch(getUserByRole(roleList?.find((role) => role.role_name === selectRole).id));
    } else {
      dispatch(showAllUsersByBatch(batchesList.find((batch) => batch.batch === e.target.value).id));
    }
  };
  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));
  const [selectBatch, setSelectBatch] = useState('All');
  const [batchStatus, showBatchStatus] = useState(false);
  const [selectRole, setSelectRole] = useState('All');
  return (
    <Page title="User: List | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: 'List' }
          ]}
          action={
            <div className="row bg-success">
              {/* ******************** */}

              <div>
                <Button
                  startIcon={<AddIcon />}
                  id="demo-customized-button"
                  aria-controls="demo-customized-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  variant="contained"
                  disableElevation
                  onClick={handleClick_}
                >
                  New User
                </Button>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button'
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose_}
                >
                  <MenuItem
                    variant="contained"
                    component={RouterLink}
                    to={PATH_DASHBOARD.user.newStudent}
                    startIcon={<Icon icon={plusFill} />}
                  >
                    Student
                  </MenuItem>
                  <MenuItem
                    variant="contained"
                    component={RouterLink}
                    to={PATH_DASHBOARD.user.newSupervisor}
                    startIcon={<Icon icon={plusFill} />}
                  >
                    Supervisor
                  </MenuItem>
                  {/* <Divider sx={{ my: 0.5 }} />  */}
                </StyledMenu>
              </div>

              {/* *************************** */}

              {/* <div className="col-5">
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.user.newStudent}
                  startIcon={<Icon icon={plusFill} />}
                >
                  New Student
                </Button>
              </div>
              <div className="col-2">
                <br />
              </div>
              <div className="col-5">
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.user.newSupervisor}
                  startIcon={<Icon icon={plusFill} />}
                >
                  New Supervisor
                </Button>
              </div> */}
            </div>
          }
        />

        <Card>
          <RootStyle>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <RootStyle>
              {batchStatus ? (
                <TextField
                  select
                  style={{ width: '150px' }}
                  label="Select Batch"
                  placeholder="Select Batch"
                  SelectProps={{ native: true }}
                  value={selectBatch}
                  onChange={(e) => getByBatch(e)}
                >
                  <option>All</option>
                  {batchesList.map((row) => (
                    <option key={row.batch}>{row.batch}</option>
                  ))}
                </TextField>
              ) : null}
              <p>&nbsp;&nbsp;&nbsp;</p>
              <TextField
                select
                style={{ width: '150px' }}
                label="Filter By Role"
                placeholder="Filter By Role"
                SelectProps={{ native: true }}
                value={selectRole}
                onChange={(e) => RoleFilterHandler(e)}
              >
                <option>All</option>
                {roleList.map((row) => (
                  <option key={row.role_name}>{row.role_name}</option>
                ))}
              </TextField>
            </RootStyle>
          </RootStyle>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row.name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={row.id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row.name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={row.name} src={row.imgUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {row.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.user_name}</TableCell>
                        <TableCell align="left">{row.role.role_name}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={row.is_varified === 0 ? 'error' : 'success'}
                          >
                            {row.is_varified === 1 ? 'Verified' : 'Not Verified'}
                          </Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(row.isActive === 0 && 'error') || 'success'}
                          >
                            {sentenceCase(row.isActive === 1 ? 'Active' : 'Not Active')}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu onDelete={() => handleDeleteUser(row.id)} userName={row} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
