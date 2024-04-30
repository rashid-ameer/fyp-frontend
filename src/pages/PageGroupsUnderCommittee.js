import React, { useState, useEffect } from 'react';
// redux
import { useSelector, useDispatch } from 'react-redux';
// material ui
import { useTheme, styled, alpha } from '@mui/material/styles';
import {
  Container,
  Card,
  Table,
  Stack,
  Checkbox,
  TextField,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TablePagination,
  Toolbar
} from '@mui/material';

// components
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// redux slices
import { CommitteeMoreMenu, UserListHead, UserListToolbar } from '../components/_dashboard/user/list';
import { getGroupsUnderCommittee } from '../redux/slices/committee';
import { PATH_DASHBOARD } from '../routes/paths';
import { getBatchesList } from '../redux/slices/batch';
// hooks
import useSettings from '../hooks/useSettings';
import useAuth from '../hooks/useAuth';

const TABLE_HEAD = [
  { id: 'project_title', label: 'Proposed Title', alignRight: false },
  { id: 'cmsId1', label: 'Group Member 1', alignRight: false },
  { id: 'cmsId2', label: 'Group Member 2', alignRight: false },
  { id: 'cmsId3', label: 'Group Member 3', alignRight: false },
  { id: 'supervisor_name', label: 'Supervisor', alignRight: false },
  { id: 'batch_name', label: 'Batch', alignRight: false }
];

function createTableRowData(data, batch) {
  const projectsInfo = [];

  data.forEach((item) => {
    item.committee.groups.forEach((group) => {
      if (batch !== 'All' && item.committee.batch.batch !== batch) {
        return;
      }

      const students = group.students.map((student) => student.user.name);
      while (students.length < 3) {
        students.push('Not Available');
      }

      const projectInfo = {
        projectId: group.id,
        project_title: group.project_title,
        cmsId1: students[0],
        cmsId2: students[1],
        cmsId3: students[2],
        supervisor_name: group.supervisor.user.name,
        batch_name: item.committee.batch.batch,
        batch_id: item.committee.batch.id
      };

      projectsInfo.push(projectInfo);
    });
  });

  return projectsInfo;
}

const sortData = (data, orderBy, order) => {
  if (!orderBy || !order) return data;

  return [...data].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

function applyFilter(array, query) {
  if (!query) return array;
  return array.filter((item) => item.project_title.toLowerCase().includes(query.toLowerCase()));
}

export default function PageGroupsUnderCommittee() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { groupsUnderCommittee } = useSelector((state) => state.committee);
  const { batchesList } = useSelector((state) => state.batch);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [batchState, setBatchState] = useState('All');
  const [filterName, setFilterName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    dispatch(getGroupsUnderCommittee(user.id));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBatchesList());
  }, [dispatch]);

  useEffect(() => {
    if (groupsUnderCommittee) {
      let formatted = createTableRowData(groupsUnderCommittee, batchState);
      formatted = sortData(formatted, orderBy, order);
      formatted = applyFilter(formatted, filterName);
      setFormattedData(formatted);
    }
  }, [groupsUnderCommittee, orderBy, order, batchState, filterName]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = formattedData.map((n) => n.project_title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const batchSelectHandler = (e) => {
    setBatchState(e.target.value);
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

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const isGroupNotFound = formattedData.length === 0;

  const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
  }));

  console.log('Groups Under Committee: ', groupsUnderCommittee);

  return (
    <Page title="Groups Under Committee">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Groups Under Committee"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Groups' }]}
        />

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
            {batchesList.map((batch) => (
              <option key={batch.batch}>{batch.batch}</option>
            ))}
          </TextField>
        </RootStyle>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={formattedData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {formattedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const isItemSelected = isSelected(row.project_title);
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index} // Consider using a more unique key if possible
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, row.project_title)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.project_title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.cmsId1}</TableCell>
                        <TableCell align="left">{row.cmsId2}</TableCell>
                        <TableCell align="left">{row.cmsId3}</TableCell>
                        <TableCell align="left">{row.supervisor_name}</TableCell>
                        <TableCell align="left">
                          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>{row.batch_name}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <CommitteeMoreMenu groupId={row.projectId} batchId={row.batch_id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {isGroupNotFound && (
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
            count={formattedData.length}
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
