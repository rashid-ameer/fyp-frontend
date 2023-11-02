import { filter, isNull } from 'lodash';
import React, { useState, useEffect } from 'react';

import { useParams, useLocation } from 'react-router-dom';
import { useTheme, styled, alpha } from '@mui/material/styles';
import { formatDistance } from 'date-fns';
// material
// import { useTheme } from '@mui/material/styles'; // important

import { Assignment, CloudDownload } from '@mui/icons-material';
import {
  Card,
  Table,
  Stack,
  Avatar,
  CardHeader,
  Divider,
  FormControl,
  CardContent,
  Grid,
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
import download from 'downloadjs';
import { useDispatch, useSelector } from '../../redux/store';
import { getSubmittedFilesByGroup, deleteSubmittedFiles } from '../../redux/slices/groupSubmittedFiles';
import { getGroup, getGroupAttendance } from '../../redux/slices/group';
import axios from '../../utils/axios';

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
  { id: 'ReportType', label: 'Report Type', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'SubmittedOn', label: 'Submitted On', alignRight: false },
  { id: 'Deadline', label: 'Deadline', alignRight: false },

  { id: 'Status', label: 'Status', alignRight: false },
  { id: '' }
];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
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

export default function GroupsUnderSupervisionProgress() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { name } = useParams();
  const dispatch = useDispatch();
  const { submittedFiles } = useSelector((state) => state.groupSubmittedFiles);
  const { group, groupAttendance } = useSelector((state) => state.group);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getSubmittedFilesByGroup(name));
    dispatch(getGroup(name));
    dispatch(getGroupAttendance(name));
  }, [dispatch]);
  console.log(name);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = submittedFiles.map((n) => n.name);
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
    dispatch(deleteSubmittedFiles(userId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - submittedFiles.length) : 0;

  const filteredUsers = applySortFilter(submittedFiles, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  // ****************
  const downloadFile = async (files) => {
    const method = 'GET';
    const url = `http://localhost:8080/File/download/${files[0].file_name}`;
    axios
      .request({
        url,
        method,
        responseType: 'blob'
      })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', files[0].file_name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  const getStatus = (due, submittedOn) => {
    let result = '';
    if (new Date(due) > new Date(submittedOn)) {
      result = String('submitted ').concat(String(formatDistance(new Date(due), new Date(submittedOn))), ' before');
    } else {
      result = String('submitted ').concat(String(formatDistance(new Date(due), new Date(submittedOn))), ' late');
    }

    return result;
  };
  const getColor = (due, submittedOn) => {
    let result = '';
    if (new Date(due) > new Date(submittedOn)) {
      result = 'success';
    } else {
      result = 'error';
    }

    return result;
  };
  const getDate = (date) => {
    const newDate = new Date(date);
    return String(newDate.toLocaleString('en-US'));
  };
  const getAbsents = (attendance) => {
    console.log(attendance);
    const result = attendance.length !== 0 ? attendance.filter((att) => att.status_is_present === 0).length || 0 : 0;
    return result;
  };
  return (
    <Page title="Groups Under Supervision Progress | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <div className="mb-3">
          <h3>Group Progress </h3>
        </div>
        <div className="mt-3">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {group?.project_title || 'Not Available'}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Name
                      </Typography>
                      <Typography variant="subtitle2">Absents</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {group?.students ? group?.students[0].user.name || 'Not Available' : 'Not Available'}
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color="error">
                          {getAbsents(groupAttendance?.students ? groupAttendance?.students[0]?.attendances || [] : [])}
                        </Label>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {group?.students ? group?.students[1].user.name || 'Not Available' : 'Not Available'}
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color="error">
                          {getAbsents(groupAttendance?.students ? groupAttendance?.students[1]?.attendances || [] : [])}
                        </Label>
                      </Typography>
                    </Stack>
                    {group?.students?.length === 3 ? (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          {group?.students ? group?.students[2]?.user.name || 'Not Available' : 'Not Available'}
                        </Typography>
                        <Typography variant="subtitle2">
                          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color="error">
                            {getAbsents(
                              groupAttendance?.students ? groupAttendance?.students[2]?.attendances || [] : []
                            )}
                          </Label>
                        </Typography>
                      </Stack>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            {/* <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <LabelStyle>Group Info:</LabelStyle>
                  <LabelStyle>Project title: {group?.project_title || 'Not Available'}</LabelStyle>
                  <LabelStyle>
                    Member 1: {group?.students ? group.students[0].user.name || 'Not Available' : 'Not Available'}
                  </LabelStyle>
                  <LabelStyle>
                    Member 2: {group?.students ? group.students[1].user.name || 'Not Available' : 'Not Available'}
                  </LabelStyle>
                  <LabelStyle>
                    Member 3: {group?.students ? group.students[2]?.user.name || 'Not Available' : 'Not Available'}
                  </LabelStyle> */}

            {/* <LabelStyle>Project title: </LabelStyle>
                  <LabelStyle>Member 1:</LabelStyle>
                  <LabelStyle>Member 2:</LabelStyle>
                  <LabelStyle>Member 3:</LabelStyle> */}
            {/* </FormControl>
              </Stack> */}
            {/* </Card> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={submittedFiles.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const isItemSelected = selected.indexOf(row.report_type) !== -1;

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
                              onChange={(event) => handleClick(event, row.report_type)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/* <Avatar src="avatar_1.jpg" /> */}
                              <Assignment color="primary" />
                              <Typography variant="subtitle2" noWrap>
                                <b>{row.report_type}</b>
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <p>{getDate(row.assigned_work?.group_submitted_file.submission_date_time || null)}</p>
                          </TableCell>

                          <TableCell align="left">
                            <p>{getDate(row.assigned_work?.deadLine || null)}</p>
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={getColor(
                                row.assigned_work?.deadLine || null,
                                row.assigned_work?.group_submitted_file.submission_date_time || null
                              )}
                            >
                              {getStatus(
                                row.assigned_work?.deadLine || null,
                                row.assigned_work?.group_submitted_file.submission_date_time || null
                              )}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Button onClick={() => downloadFile(row.assigned_work?.group_submitted_file.files)}>
                              <CloudDownload color="primary" />
                            </Button>
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
              count={submittedFiles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </div>
      </Container>
    </Page>
  );
}
