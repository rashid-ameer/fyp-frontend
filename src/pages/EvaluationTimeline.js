import React, { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button, Grid, Card, stepLabelClasses, Link } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { getRubricTypes } from './api';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { Container } from '@mui/material';
import useSettings from '../hooks/useSettings';
import { getMarking } from './api';

// Custom styled StepLabel for active steps
const ActiveStepLabel = styled(StepLabel)({
  [`& .${stepLabelClasses.label}`]: {
    color: 'green' // Use your desired color for active labels
  }
});

export default function EvaluationTimeline() {
  const { groupId } = useParams();
  const { themeStretch } = useSettings();
  const deadlines = [
    new Date('2024-01-01'),
    new Date('2024-02-01'),
    new Date('2024-05-01'),
    new Date('2024-05-01'),
    new Date('2024-05-01'),
    new Date('2024-06-01')
  ];
  const [reports, setReports] = useState([]);
  const [evaluatedReports, setEvaluatedReports] = useState(new Set());
  const today = new Date();

  useEffect(() => {
    const fetchReportsAndEvaluations = async () => {
      try {
        const reportData = await getRubricTypes(); // Assuming this returns an array of reports

        setReports(reportData);

        // For each report, check if it has been evaluated and update the state accordingly
        for (const report of reportData) {
          const markingData = await getMarking({ groupId, rubricTypeId: report.id });
          if (markingData.length > 0) {
            setEvaluatedReports((prev) => new Set(prev).add(report.id));
          }
        }
      } catch (error) {
        console.error('Failed to fetch reports or evaluations:', error);
      }
    };

    fetchReportsAndEvaluations();
  }, []);

  return (
    <Page title="Evaluation">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Evaluation"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation List', href: PATH_DASHBOARD.evaluation.management },
            { name: 'Timeline' }
          ]}
        />
        <Box sx={{ width: '100%' }}>
          <Stepper alternativeLabel>
            {reports.map((report, index) => (
              <Step key={report.id} completed={evaluatedReports.has(report.id)}>
                <StepLabel>{report.rubric_type}</StepLabel>
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
                    mb: 2
                  }}
                >
                  <Typography variant="h6">
                    <EventNoteIcon sx={{ mr: 1 }} /> {report.rubric_type}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={`${PATH_DASHBOARD.evaluation.evaluationForm}/${groupId}/${report.id}`}
                  >
                    <Button variant="contained" disabled={deadlines[index] > today}>
                      {evaluatedReports.has(report.id) ? 'Evaluate Again' : 'Evaluate'}
                    </Button>
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
