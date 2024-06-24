import React, { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button, Grid, Card, stepLabelClasses, Link } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { getRubricTypes } from './api';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { Container } from '@mui/material';
import useSettings from '../hooks/useSettings';
import { getEvaluatedReports, showAssignedWorkByBatch, getReportRubricMapping } from './api';

// Custom styled StepLabel for active steps
const ActiveStepLabel = styled(StepLabel)({
  [`& .${stepLabelClasses.label}`]: {
    color: 'green' // Use your desired color for active labels
  }
});

export default function EvaluationTimeline() {
  const { groupId } = useParams();
  const { themeStretch } = useSettings();
  const location = useLocation();
  const batchId = location.state?.batchId;
  const [deadlines, setDeadlines] = useState([]);
  const [rubricTypes, setRubricTypes] = useState([]);
  const today = new Date();
  const [data, setData] = useState([]);

  function filterReportRubricMapping(reportRubricMapping) {
    let rubrics = {};

    reportRubricMapping.forEach((report) => {
      report.rubric_types.forEach((rubric) => {
        let rubricId = rubric.id;

        if (!rubrics[rubricId]) {
          rubrics[rubricId] = {
            id: rubricId,
            rubric_type: rubric.rubric_type,
            reports: []
          };
        }

        rubrics[rubricId].reports.push({
          id: report.id,
          report_type: report.report_type
        });
      });
    });

    // Convert the rubrics object into the required array format
    let formattedData = Object.values(rubrics)
      .map((rubric) => ({
        rubric: rubric
      }))
      .filter((rubric) => {
        return rubric.rubric.rubric_type.toLowerCase() !== 'final external defence evaluation';
      });

    return formattedData;
  }

  useEffect(() => {
    const fetchReportsAndEvaluations = async () => {
      try {
        let rubricTypes = await getRubricTypes(); // Assuming this returns an array of reports
        const deadlineData = await showAssignedWorkByBatch(batchId);
        const reportRubricMapping = await getReportRubricMapping(groupId);
        const evaluatedReports = await getEvaluatedReports(groupId);

        console.log(evaluatedReports);
        console.log(rubricTypes);
        console.log(deadlineData);
        console.log(reportRubricMapping);

        rubricTypes = rubricTypes
          .map((rubric) => ({
            id: rubric.id,
            rubric_type: rubric.rubric_type,
            isEvaluated: evaluatedReports.find(
              (evaluatedReport) =>
                evaluatedReport.rubric_id === rubric.id && evaluatedReport.group_id === parseInt(groupId)
            )
              ? true
              : false
          }))
          .filter((rubric) => rubric.rubric_type.toLowerCase() !== 'final external defence evaluation');

        setData(filterReportRubricMapping(reportRubricMapping));
        setRubricTypes(rubricTypes);
        setDeadlines(
          deadlineData.filter((data) => data.title.toLowerCase() !== 'abstract').map((data) => new Date(data.deadLine))
        );
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
            { name: 'Groups Under Committee', href: PATH_DASHBOARD.general.groupsUnderCommittee },
            { name: 'Timeline' }
          ]}
        />
        <Box sx={{ width: '100%' }}>
          <Stepper alternativeLabel>
            {rubricTypes.map((rubric, index) => (
              <Step key={rubric.id} completed={rubric.isEvaluated}>
                <StepLabel>{rubric.rubric_type}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={2} direction="column" sx={{ mt: 4 }}>
            {data.map((rubricType, index) => (
              <Grid item key={rubricType.rubric.id}>
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
                    <EventNoteIcon sx={{ mr: 1 }} /> {rubricType.rubric.rubric_type}
                  </Typography>
                  <Button variant="contained" disabled={deadlines[index] ? deadlines[index] < new Date(today) : true}>
                    <Link
                      style={{ height: '100%', width: '100%', color: 'inherit' }}
                      component={RouterLink}
                      to={`${PATH_DASHBOARD.evaluation.evaluationForm}/${groupId}/${rubricType.rubric.id}`}
                      state={{
                        reports: rubricType.rubric.reports,
                        isEvaluated: rubricTypes.find((rubric) => rubric.id === rubricType.rubric.id)?.isEvaluated,
                        rubricType: rubricType.rubric.rubric_type
                      }}
                    >
                      {rubricTypes.find((rubric) => rubric.id === rubricType.rubric.id)?.isEvaluated
                        ? 'Evaluate Again'
                        : 'Evaluate'}
                    </Link>
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
