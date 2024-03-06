import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import shareFill from '@iconify/icons-eva/share-fill';
import printerFill from '@iconify/icons-eva/printer-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';

// material
import { useTheme, styled, alpha } from '@mui/material/styles';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';

import {
  Box,
  Menu,
  Card,
  Table,
  Button,
  Divider,
  TablePagination,
  Stack,
  Checkbox,
  MenuItem,
  Toolbar,
  TextField,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardHeader,
  TableContainer
} from '@mui/material';

import { Assignment, CloudDownload } from '@mui/icons-material';
import { isAfter } from 'date-fns';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getGroupByBatch, getGroupList } from '../../../redux/slices/group';
import { getSubmittedFilesByAllGroup } from '../../../redux/slices/groupSubmittedFiles';
import { getBatchesList } from '../../../redux/slices/batch';
import { UserListHead, UserListToolbar, GroupMoreMenu } from '../user/list';
import { getInstructorList } from '../../../redux/slices/instructor';
import axios from '../../../utils/axios';
// utils
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import { MIconButton } from '../../@material-extend';

import SearchNotFound from '../../SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Project Title', alignRight: false },
  { id: 'batch', label: 'Batch', alignRight: false },
  { id: 'supervisor', label: 'Supervisor', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'abstract', label: 'Abstract', alignRight: false },
  { id: '', label: '', alignRight: false }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function MoreMenuButton() {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <>
        <MIconButton ref={menuRef} size="large" onClick={handleOpen}>
          <Icon icon={moreVerticalFill} width={20} height={20} />
        </MIconButton>
      </>

      {/* <Menu
        open={open}
        anchorEl={menuRef.current}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem>
          <Icon icon={downloadFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Download
          </Typography>
        </MenuItem>
        <MenuItem>
          <Icon icon={printerFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Print
          </Typography>
        </MenuItem>
        <MenuItem>
          <Icon icon={shareFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Share
          </Typography>
        </MenuItem>
        <MenuItem>
          <Icon icon={archiveFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Archive
          </Typography>
        </MenuItem>

        <Divider />
        <MenuItem sx={{ color: 'error.main' }}>
          <Icon icon={trash2Outline} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu> */}
    </>
  );
}

export default function AppNewInvoice() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const { submittedFilesByGroups } = useSelector((state) => state.groupSubmittedFiles);
  const { groupList } = useSelector((state) => state.group);
  const { batchesList } = useSelector((state) => state.batch);
  const { userList } = useSelector((state) => state.instructor);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const filteredUsers = applySortFilter(groupList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groupList.length) : 0;
  useEffect(() => {
    dispatch(getGroupList());
    dispatch(getBatchesList());
    dispatch(getInstructorList());
    dispatch(getSubmittedFilesByAllGroup());
  }, [dispatch]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const downloadFile = async (id) => {
    if (submittedFilesByGroups.length > 0) {
      const data = submittedFilesByGroups.find(
        (submission) => submission.assigned_work.group_submitted_file.group_id === id
      );
      console.log(id, submittedFilesByGroups);
      if (data !== undefined) {
        const file = data.assigned_work.group_submitted_file.files;
        const method = 'GET';
        const url = `http://localhost:8080/File/download/${file[0].file_name}`;
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
            link.setAttribute('download', file[0].file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
          });
      } else {
        alert('not Submitted yet');
      }
    } else {
      alert('not Submitted yet');
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = groupList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const getColor = (status) => {
    let result;
    if (status === 'in progress') {
      result = 'warning';
    } else if (status === 'completed') {
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
      dispatch(getGroupList());
    } else {
      dispatch(getGroupByBatch(batchesList?.find((batch) => batch.batch === e.target.value)?.id));
    }
  };
  return (
    <Card>
      <CardHeader title="Projects List" sx={{ mb: 3 }} />
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
                    key={row.id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row.project_title)} />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {row.project_title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                        {batchesList?.find((batch) => batch.id === row.students[0]?.batch_id)?.batch}
                      </Label>
                    </TableCell>
                    <TableCell align="left">{sentenceCase(getSupervisorName(row))}</TableCell>
                    <TableCell align="left">
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={getColor(row.projectStatus)}
                      >
                        {sentenceCase(row.projectStatus)}
                      </Label>
                    </TableCell>
                    <TableCell align="left">
                      <Button onClick={() => downloadFile(row.id)}>
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
        {/* <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Title</TableCell>
                <TableCell>Technology</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_INVOICES.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{`${row.id}`}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (row.status === 'in_progress' && 'warning') ||
                        (row.status === 'cancelled' && 'error') ||
                        'success'
                      }
                    >
                      {sentenceCase(row.status)}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <MoreMenuButton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
      </Scrollbar>

      <Divider />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={groupList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="#"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          View All
        </Button> 
      </Box>
      */}
    </Card>
  );
}
