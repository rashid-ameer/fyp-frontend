import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Assignment } from '@mui/icons-material';

import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
// material
// import { useTheme } from '@mui/material/styles'; // important
import {
  Card,
  Table,
  Toolbar,
  Stack,
  Avatar,
  TextField,
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
import { getAssignedWorkList, deleteAssignedWork, getAssignedWorkByBatch } from '../../redux/slices/assignedWork';
import { getReportTypeList } from '../../redux/slices/reportType';
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
import ReportMoreMenu from '../../components/_dashboard/user/list/ReportMoreMenu'; //
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'ReportType', label: 'Report Type', alignRight: false },
  { id: 'Batch', label: 'Batch', alignRight: false },
  { id: 'deadLine', label: 'Deadline', alignRight: false },
  { id: 'points', label: 'Points', alignRight: false },
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
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ReportsList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { assignedWorkList } = useSelector((state) => state.assignedWork);
  const { reportTypeList } = useSelector((state) => state.reportType);
  const { batchesList } = useSelector((state) => state.batch);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAssignedWorkList());
    dispatch(getBatchesList());
    dispatch(getReportTypeList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = assignedWorkList.map((n) => n.name);
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
    dispatch(deleteAssignedWork(userId));
  };
  const getDate = (date) => {
    const newDate = new Date(date);
    return String(newDate.toLocaleString('en-US'));
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - assignedWorkList.length) : 0;

  const filteredUsers = applySortFilter(assignedWorkList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  const [batchState, setBatchState] = useState('All');
  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));
  // ****************
  const batchSelectHandler = (e) => {
    setBatchState(e.target.value);
    if (e.target.value === 'All') {
      dispatch(getAssignedWorkList());
    } else {
      dispatch(getAssignedWorkByBatch(batchesList?.find((batch) => batch.batch === e.target.value)?.id));
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <Page title="Reports List | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Reports List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Reports' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.general.createReport}
              startIcon={<Icon icon={plusFill} />}
            >
              New Report
            </Button>
          }
        />

        <Card>
          <RootStyle>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
            <TextField
              select
              style={{ width: '250px' }}
              label="Select Batch"
              placeholder="Select Batch"
              value={batchState}
              SelectProps={{ native: true }}
              onChange={(e) => batchSelectHandler(e)}
            >
              <option>All</option>
              {batchesList.map((row) => (
                <option key={row.batch}>{row.batch}</option>
              ))}
            </TextField>
          </RootStyle>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={assignedWorkList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row.title) !== -1;

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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row.title)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar src="avatar_1.jpg" /> */}
                            <Assignment color="primary" />
                            <Typography variant="subtitle2" noWrap>
                              <b>{row.title}</b>
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {reportTypeList.find((report) => report.id === row.report_type_id)?.report_type || ''}
                        </TableCell>
                        <TableCell align="left">
                          {batchesList.find((batch) => batch.id === row.batch_id)?.batch || ''}
                        </TableCell>
                        <TableCell align="left">{getDate(row.deadLine)}</TableCell>
                        <TableCell align="left">{row.total_points}</TableCell>
                        <TableCell align="right">
                          <ReportMoreMenu onDelete={() => handleDeleteUser(row.id)} userName={row} />
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
            count={assignedWorkList.length}
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
