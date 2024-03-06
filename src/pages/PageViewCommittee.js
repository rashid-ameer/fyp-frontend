import { useState, useEffect } from 'react';
// material ui
import {
  Table,
  Container,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
// react router
import { useParams } from 'react-router';
// redux
import { useSelector, useDispatch } from 'react-redux';
// redux slices
import { getCommitteeDetails } from '../redux/slices/committee';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// hooks
import useSettings from '../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Label from '../components/Label';

function PageViewCommittee() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { themeStretch, themeColor, setColor } = useSettings();
  const { committeeId } = useParams();
  const { committeeDetails } = useSelector((state) => state.committee);

  //  styles
  const boldStyle = { fontWeight: 'bold' };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  }));

  // use Effect
  // for getting all the committees
  useEffect(() => {
    dispatch(getCommitteeDetails(committeeId));
  }, [dispatch]);

  return (
    <Page title="View Committee">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Committee"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Committee', href: PATH_DASHBOARD.committee.list },
            { name: 'C1' }
          ]}
        />

        {committeeDetails.supervisors ? (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Supervisors
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="supervisor table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={boldStyle}>Name</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Specialization</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Office Address</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Email</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committeeDetails.supervisors.map((supervisor, index) => (
                    <TableRow key={supervisor.id}>
                      <TableCell>{supervisor.user.name}</TableCell>
                      <TableCell>{supervisor.user.email}</TableCell>
                      <TableCell>{supervisor.specialization}</TableCell>
                      <TableCell>{supervisor.office}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" component="h2" gutterBottom style={{ marginTop: '40px' }}>
              Groups
            </Typography>

            <TableContainer component={Paper}>
              <Table aria-label="group table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={boldStyle}>Project Title</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Supervisor</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Student 1</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Student 2</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Student 3</StyledTableCell>
                    <StyledTableCell style={boldStyle}>Batch Name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committeeDetails.groups.map((group, index) => (
                    <TableRow key={index}>
                      <TableCell>{group.project_title}</TableCell>
                      <TableCell>{group.supervisor.user.name}</TableCell>
                      <TableCell>{group.students[0].user.name}</TableCell>
                      <TableCell>{group.students[1].user.name}</TableCell>
                      <TableCell>{group.students?.[2]?.user?.name || 'Not Available'}</TableCell>
                      <TableCell>
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                          {committeeDetails.batch.batch.batch}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <p>Loading ...</p>
          </>
        )}
      </Container>
    </Page>
  );
}

export default PageViewCommittee;
