import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Container,
  Typography
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../routes/paths';
import { useDispatch, useSelector } from 'react-redux';
import { getSubmittedFilesByGroup } from 'src/redux/slices/groupSubmittedFiles';
import { useParams } from 'react-router';
import Label from '../components/Label';
import { useTheme } from '@mui/material/styles';

function GroupSubmittedFiles() {
  const theme = useTheme();
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { submittedFiles, isLoading } = useSelector((state) => state.groupSubmittedFiles);

  const calculateDaysDifference = (submissionDate, deadline) => {
    const submission = parseISO(submissionDate);
    const dueDate = parseISO(deadline);
    return differenceInCalendarDays(submission, dueDate);
  };

  const handleDownload = (file) => {
    const method = 'GET';
    const url = `http://localhost:8080/File/download/${file}`;
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
  };

  useEffect(() => {
    dispatch(getSubmittedFilesByGroup(groupId));
  }, [dispatch]);

  function getDaysDifference(submissionDate, deadline) {
    console.log('submissionDate:', submissionDate, 'deadline:', deadline);
    const submission = parseISO(submissionDate);
    const dueDate = parseISO(deadline);
    return differenceInCalendarDays(submission, dueDate);
  }

  function getSubmissionColor(daysDifference) {
    if (daysDifference < 0) {
      return 'danger';
    } else {
      return 'success';
    }
  }

  function getSubmissionTextStatus(daysDifference) {
    console.log('daysDifference:', daysDifference);
    if (daysDifference < 0) {
      return `Submitted ${Math.abs(daysDifference)} days late`;
    } else {
      return `Submitted ${daysDifference} days earlier`;
    }
  }

  if (isLoading) {
    return (
      <Page title="Group Progress">
        <Container maxWidth="lg">
          <HeaderBreadcrumbs
            heading="Group Progress"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Groups Under Committee', href: PATH_DASHBOARD.general.groupsUnderCommittee },
              { name: 'Group Progress' }
            ]}
          />
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        </Container>
      </Page>
    );
  }

  if (submittedFiles.length === 0) {
    return (
      <Page title="Group Progress">
        <Container maxWidth="lg">
          <HeaderBreadcrumbs
            heading="Group Progress"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Groups Under Committee', href: PATH_DASHBOARD.general.groupsUnderCommittee },
              { name: 'Group Progress' }
            ]}
          />
          <Typography variant="h6" align="center">
            No submitted files found for this group.
          </Typography>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Group Progress">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Group Progress"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Groups Under Committee', href: PATH_DASHBOARD.general.groupsUnderCommittee },
            { name: 'Group Progress' }
          ]}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Submission Status</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedFiles.map((file) => {
                const daysDifference = getDaysDifference(
                  file.assigned_work.group_submitted_file.submission_date_time,
                  file.assigned_work.deadLine
                );

                // console.log(getSubmissionTextStatus(daysDifference));

                return (
                  <TableRow key={file.id}>
                    <TableCell>{file.assigned_work.title}</TableCell>
                    <TableCell>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={getSubmissionColor(daysDifference)}
                      >
                        {getSubmissionTextStatus(daysDifference)}
                      </Label>
                    </TableCell>
                    <TableCell>
                      {file.assigned_work.group_submitted_file.files.map((f) => (
                        <IconButton key={f.id} onClick={() => handleDownload(f.file_name)}>
                          <CloudDownloadIcon color="primary" />
                        </IconButton>
                      ))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Page>
  );
}

export default GroupSubmittedFiles;
