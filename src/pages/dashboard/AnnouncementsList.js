import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme, styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
// material
// import { useTheme } from '@mui/material/styles'; // important
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAnnouncementList, deleteAnnouncement, getAllNotifications } from '../../redux/slices/announcement';
import { getBatchesList } from '../../redux/slices/batch';
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
  { id: 'Announcement', label: 'Announcement', alignRight: false },
  { id: 'Batch', label: 'Batch', alignRight: false },
  { id: 'Viewers', label: 'Viewers', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'Date', label: 'Date', alignRight: false }
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
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function AnnouncementsList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { announcementList, notificationList } = useSelector((state) => state.announcement);
  const { batchesList } = useSelector((state) => state.batch);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAnnouncementList());
    dispatch(getAllNotifications());
    dispatch(getBatchesList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const getStringFromDescription = (description) => {
    const indexStart = String(description).indexOf('<p>') + 3;
    const indexEnd = String(description).indexOf('</p>');
    return String(description).substring(indexStart, indexEnd);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = announcementList.map((n) => n.name);
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

  const handleDeleteUser = (userId) => {
    dispatch(deleteAnnouncement(userId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - announcementList.length) : 0;

  const filteredUsers = applySortFilter(announcementList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  // ****************
  const countViews = (id) => notificationList.filter((an) => an.id === id && an.status_viewed === 1).length;
  const countNotifications = (id) => notificationList.filter((an) => an.id === id).length;
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <Page title="Announcements | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Announcements"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Announcements' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.general.newAnnouncement}
              startIcon={<Icon icon={plusFill} />}
            >
              New Announcement
            </Button>
          }
        />

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={announcementList.length}
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
                            {/* <Avatar src="avatar_1.jpg" /> */}
                            <RecordVoiceOverRoundedIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="subtitle2" noWrap>
                              <b>{row.title} </b>
                              <p>{getStringFromDescription(row.description)}</p>
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {batchesList.find((batch) => batch.id === row.batch_id)?.batch}
                        </TableCell>
                        <TableCell align="left">
                          {countViews(row.id)}/{countNotifications(row.id)}
                        </TableCell>
                        <TableCell align="left">
                          <p>{getDate(row.createdAt)}</p>
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
            count={announcementList.length}
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
