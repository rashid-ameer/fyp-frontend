import React, { useEffect } from 'react';
import { Typography, Box, Container, Paper, List, ListItem, Stack, ListItemText } from '@mui/material';
import Page from '../components/Page'; // Ensure this path is correct
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs'; // Ensure this path is correct
import { useLocation, useParams } from 'react-router';
import { getDetailedGradedWork } from './api';
import { PATH_DASHBOARD } from '../routes/paths';

function DetailedGrades() {
  const { assignmentId } = useParams();
  const location = useLocation();
  const { groupId } = location.state;
  const [detailReportData, setDetailReportData] = React.useState([]);

  useEffect(() => {
    const fetchDetailedGrades = async () => {
      try {
        const data = await getDetailedGradedWork({ group_id: groupId, assignment_id: assignmentId });
        setDetailReportData(data);
      } catch (error) {
        console.error('Failed to fetch detailed grades:', error);
      }
    };

    fetchDetailedGrades();
  }, []);

  return (
    <Page title="Detailed Rubrics Evaluation">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Rubric Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Marks List', href: `${PATH_DASHBOARD.grades.marksList}` },
            { name: 'Details' }
          ]}
        />
        {detailReportData.map((rubric, index) => (
          <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Type: {rubric.rubric_type}
            </Typography>
            <List>
              {rubric.details.map((detail, idx) => (
                <ListItem key={idx} divider>
                  <Stack direction="column" spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="subtitle1">PLO: {detail.PLO_title}</Typography>
                      <Typography variant="subtitle1">Criteria: {detail.criteria}</Typography>
                    </Box>
                    <Typography variant="body1">{detail.rubric_detail}</Typography>
                    <Typography variant="body1" sx={{ color: 'green' }}>
                      You secured: {detail.points} point
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Container>
    </Page>
  );
}

export default DetailedGrades;
