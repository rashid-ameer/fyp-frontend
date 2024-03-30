import React, { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button, Grid, Card, stepLabelClasses } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { getRubricTypes } from './api';
import { styled } from '@mui/material/styles';

// Custom styled StepLabel for active steps
const ActiveStepLabel = styled(StepLabel)({
  [`& .${stepLabelClasses.label}`]: {
    color: 'green' // Use your desired color for active labels
  }
});

export default function EvaluationTimeline() {
  const deadlines = [
    new Date('2024-01-01'),
    new Date('2024-02-01'),
    new Date('2024-03-01'),
    new Date('2024-04-01'),
    new Date('2024-05-01'),
    new Date('2024-06-01')
  ];

  const [reports, setReports] = useState([]);
  const today = new Date();

  useEffect(() => {
    // Fetch reports data from API
    const fetchReports = async () => {
      try {
        const data = await getRubricTypes(); // Fetch data using your API function
        setReports(data); // Update state with fetched data
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper alternativeLabel>
        {reports.map((report, index) => (
          <Step key={report.id} completed={deadlines[index] <= today}>
            {/* Use ActiveStepLabel for steps whose deadlines have passed */}
            {deadlines[index] <= today ? (
              <ActiveStepLabel>{report.rubric_type}</ActiveStepLabel>
            ) : (
              <StepLabel>{report.rubric_type}</StepLabel>
            )}
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={2} direction="column" sx={{ mt: 4 }}>
        {reports.map((report, index) => (
          <Grid item key={report.id}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 2,
                opacity: deadlines[index] <= today ? 1 : 0.5
              }}
            >
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <EventNoteIcon sx={{ mr: 1 }} /> {report.rubric_type}
              </Typography>
              <Button
                variant="contained"
                disabled={deadlines[index] > today}
                onClick={() => {
                  /* Logic to navigate to the form for this report */
                }}
              >
                Evaluate
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
