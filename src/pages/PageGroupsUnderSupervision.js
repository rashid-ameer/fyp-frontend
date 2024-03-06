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

// material
// import { useTheme } from '@mui/material/styles'; // important
import {
  Card,
  Table,
  Stack,
  Avatar,
  TextField,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Toolbar,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// redux
import useAuth from '../hooks/useAuth';
import { useDispatch, useSelector } from '../redux/store';
import { getBatchesList, deleteBatch } from '../redux/slices/batch';
import { showAllGroupsUnderSupervisionsByBatch, deleteGroup, getGroupUnderSupervision } from '../redux/slices/group';
import { getInstructorList } from '../redux/slices/instructor';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar, GroupsUnderSupervisionMoreMenu } from '../components/_dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Proposed Title', alignRight: false },
  { id: 'cmsId1', label: 'Group Member 1', alignRight: false },
  { id: 'cmsId2', label: 'Group Member 2', alignRight: false },
  { id: 'cmsId3', label: 'Group Member 3', alignRight: false },
  { id: 'role', label: 'Batch', alignRight: false },
  // { id: 'status', label: 'Group Approval', alignRight: false },
  { id: 'menu' }
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
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.project_title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PageGroupsUnderSupervision() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { groupList } = useSelector((state) => state.group);
  const { batchesList } = useSelector((state) => state.batch);
  const { userList } = useSelector((state) => state.instructor);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getGroupUnderSupervision(user.id));
    dispatch(getBatchesList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = groupList.map((n) => n.name);
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
    dispatch(deleteGroup(userId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groupList.length) : 0;

  const filteredUsers = applySortFilter(groupList, getComparator(order, orderBy), filterName);

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
  const getColor = (status) => {
    let result;
    if (status === 0) {
      result = 'warning';
    } else if (status === 1) {
      result = 'success';
    } else {
      result = 'error';
    }
    return result;
  };
  const getGroupStatus = (status) => {
    let result;
    if (status === 0) {
      result = 'Inprogress';
    } else if (status === 1) {
      result = 'Approved';
    } else {
      result = 'Rejected';
    }
    return result;
  };
  const [batchState, setBatchState] = useState('All');
  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));
  const batchSelectHandler = (e) => {
    setBatchState(e.target.value);
    if (e.target.value === 'All') {
      dispatch(getGroupUnderSupervision(user.id));
    } else {
      dispatch(
        showAllGroupsUnderSupervisionsByBatch(user.id, batchesList?.find((batch) => batch.batch === e.target.value)?.id)
      );
    }
  };
  const getSupervisorName = (row) => {
    const id = row.supervisor_id ? row.supervisor_id : -1;
    let result = '';
    if (id === -1) {
      result = 'Not Available';
    } else {
      const data = userList.find((user) => user.id === id);
      result = data?.user.name || 'Not Available';
    }
    return result;
  };

  return (
    <Page title="User: List | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Groups Under Supervision"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Groups' }]}
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
                <option key={row.id}>{row.batch}</option>
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
                  rowCount={groupList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const isItemSelected = selected.indexOf(row.id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={row.project_title}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row.id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.project_title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <p>{row.students[0]?.user.name || 'Not Available'}</p>
                          <p>{row.students[0]?.user_id}</p>
                        </TableCell>
                        <TableCell align="left">
                          <p>{row.students[1]?.user.name || 'Not Available'}</p>
                          <p>{row.students[1]?.user_id || ''}</p>
                        </TableCell>
                        <TableCell align="left">
                          <p>{row.students[2]?.user.name || 'Not Available'}</p>
                          <p>{row.students[2]?.user_id || ''}</p>
                        </TableCell>
                        <TableCell align="left">
                          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                            {batchesList?.find((batch) => batch.id === row.students[0]?.batch_id)?.batch}
                          </Label>
                        </TableCell>
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={getColor(row.groupStatus)}
                          >
                            {sentenceCase(getGroupStatus(row.groupStatus))}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <GroupsUnderSupervisionMoreMenu onDelete={() => handleDeleteUser(row.id)} userName={row} />
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
            count={groupList.length}
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
