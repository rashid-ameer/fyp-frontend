import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import Page from '../components/Page'; // Import your Page component
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs'; // Import your HeaderBreadcrumbs component
import useSettings from '../hooks/useSettings';
import { PATH_DASHBOARD } from '../routes/paths';

function AssignFinalMarks() {
  const { themeStretch } = useSettings();
  const totalMarks = 100; // Set the total marks for the assignment
  const [marks, setMarks] = useState({ student1: '', student2: '', student3: '' });

  const handleMarksChange = (event) => {
    const { name, value } = event.target;
    setMarks({
      ...marks,
      [name]: value ? Math.min(Number(value), totalMarks) : ''
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
          <Typography variant="h6" gutterBottom>
            Total Marks Available: {totalMarks}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TextField
                key={index}
                margin="normal"
                required
                fullWidth
                id={`student${index + 1}`}
                label={`Student ${index + 1} Marks`}
                name={`student${index + 1}`}
                type="number"
                InputProps={{ inputProps: { min: 0, max: totalMarks } }}
                value={marks[`student${index + 1}`]}
                onChange={handleMarksChange}
              />
            ))}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit Marks
            </Button>
          </Box>
        </Paper>
      </Container>
    </Page>
  );
}

export default AssignFinalMarks;
