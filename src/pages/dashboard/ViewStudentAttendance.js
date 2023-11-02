// // material
// import { Container, Grid, Stack } from '@mui/material';
// // hooks
// import useAuth from '../../hooks/useAuth';
// import useSettings from '../../hooks/useSettings';
// // components
// import Page from '../../components/Page';
// import { PresentAttendance, AbsentAttendance } from '../../components/_dashboard/general-app';

// // ----------------------------------------------------------------------

// export default function GeneralApp() {
//   const { themeStretch } = useSettings();
//   const { user } = useAuth();

//   return (
//     <Page title="General: App | SIBAU FYPMS">
//       <Container maxWidth={themeStretch ? false : 'xl'}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={4}>
//             <PresentAttendance />
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <AbsentAttendance />
//           </Grid>

//           <Grid item xs={12} lg={8}>
//             <StudentAttendanceTable />
//           </Grid>
//         </Grid>
//       </Container>
//     </Page>
//   );
// }

import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';

import { useTheme, styled, alpha } from '@mui/material/styles';
// material
// import { useTheme } from '@mui/material/styles'; // important
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  CardContent,
  Grid,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import { PresentAttendance, AbsentAttendance } from '../../components/_dashboard/general-app';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAttendanceByUserId } from '../../redux/slices/user';
import useAuth from '../../hooks/useAuth';
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
import AnnouncementMoreMenu from '../../components/_dashboard/user/list/AnnouncementMoreMenu';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'Date', label: 'Date', alignRight: false },
  { id: 'Attendance', label: 'Attendance', alignRight: false }
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
    return filter(array, (_user) => String(_user.createdAt).toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function ViewAllAttendance() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { userAttendance } = useSelector((state) => state.user);
  const { batchesList } = useSelector((state) => state.batch);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAttendanceByUserId(user.id));
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userAttendance.map((n) => n.createdAt);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const getDate = (date) => {
    const newDate = new Date(date);
    return String(newDate.toLocaleString('en-US'));
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userAttendance.length) : 0;

  const filteredUsers = applySortFilter(userAttendance, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  // ****************
  const countPresent = () => userAttendance?.filter((an) => an.status_is_present === 1).length || 0;
  const countAbsents = () => userAttendance?.filter((an) => an.status_is_present === 0).length || 0;
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <Page title="View Attendance | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="View Attendance"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Attendance' }]}
        />
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <PresentAttendance attendance={countPresent()} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AbsentAttendance attendance={countAbsents()} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={8} my={4}>
            <Card>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 400 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={userAttendance.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const isItemSelected = selected.indexOf(row.createdAt) !== -1;

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
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, row.createdAt)}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  <b>{getDate(row.createdAt)} </b>
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">
                              <Label
                                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                color={row.status_is_present === 0 ? 'error' : 'success'}
                              >
                                {row.status_is_present === 1 ? 'Present' : 'Absent'}
                              </Label>
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
                count={userAttendance.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </div>
      </Container>
    </Page>
  );
}
