import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import Page from '../components/Page'; // Import your Page component
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs'; // Import your HeaderBreadcrumbs component
import useSettings from '../hooks/useSettings';
import { PATH_DASHBOARD } from '../routes/paths';
import { useNavigate, useParams } from 'react-router';
import { SnackbarProvider, useSnackbar } from 'notistack';

function AssignFinalMarks() {
  const { groupId } = useParams();
  console.log('group_id', groupId);
  const { themeStretch } = useSettings();
  const [totalMarks, setTotalMarks] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [marks, setMarks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleMarksChange = (event) => {
    const { value } = event.target;
    setMarks(value);
  };

  useEffect(() => {
    fetch('http://localhost:8080/Grades/getAllGrades')
      .then((response) => response.json())
      .then((data) => {
        let totalMarks = data.find((grade) => grade.grade_type === 'supervisor')?.marks;
        if (totalMarks) {
          totalMarks = (totalMarks / 100) * 200;
        } else {
          totalMarks = 0;
        }

        setTotalMarks(totalMarks);
      })
      .catch((error) => console.error('Error fetching total marks:', error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/GroupGrades/getGroupGrades/${groupId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        if (data?.groupGrades?.supervisor_marks !== 0 || data?.groupGrades?.supervisor_marks !== null) {
          setMarks(data?.groupGrades?.supervisor_marks);
          setIsEdit(true);
        }
      })
      .catch((error) => console.error('Error fetching group marks:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsLoading(true);
    if (!isEdit) {
      fetch('http://localhost:8080/GroupGrades/createGroupMarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_id: groupId, supervisor_marks: marks })
      })
        .then((response) => response.json())
        .then((data) => {
          enqueueSnackbar('Create success', { variant: 'success' });

          setIsLoading(false);
          setTimeout(() => {
            navigate(PATH_DASHBOARD.general.groupsUnderSupervision);
          }, 2000);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error assigning marks:', error);
          setError(error);
        });
    } else {
      fetch(`http://localhost:8080/GroupGrades/updateGroupMarks/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ supervisor_marks: marks })
      })
        .then((response) => response.json())
        .then((data) => {
          enqueueSnackbar('Update success', { variant: 'success' });
          setIsLoading(false);

          setTimeout(() => {
            navigate(PATH_DASHBOARD.general.groupsUnderSupervision);
          }, 2000);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error assigning marks:', error);
          setError(error);
        });
    }
  };

  return (
    <Page title="Assign Final Marks">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Final Marks Assignment"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Groups Under Supervison', href: PATH_DASHBOARD.general.groupsUnderSupervision },
            { name: 'Assign Final Grades' }
          ]}
        />
        <Paper sx={{ p: 2 }}>
          {totalMarks === 0 ? (
            <Typography variant="h6" color="error">
              Ask Coordinator to first assign Total Marks for Supervisor
            </Typography>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Assign Marks to Group</Typography>
                <Typography variant="h6">Total Marks Available: {totalMarks}</Typography>
              </div>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id={`Assign Grades`}
                  label={`Assign Grades`}
                  name={`student}`}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: totalMarks } }}
                  value={marks}
                  onChange={handleMarksChange}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  {isEdit
                    ? isLoading
                      ? 'Updating Marks'
                      : 'Update Marks'
                    : !isLoading
                    ? 'Assigning Marks...'
                    : 'Assign Marks'}
                </Button>

                {!isLoading && error && (
                  <Typography variant="body2" color="error" align="center">
                    {error}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Page>
  );
}

export default AssignFinalMarks;
