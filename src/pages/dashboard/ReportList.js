import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Container, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Page from '../../components/Page'; // Import your Page component
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'; // Import your HeaderBreadcrumbs component
import { deleteReportType, getReportRubricMapping } from '../api'; // Import your API function
import { PATH_DASHBOARD } from '../../routes/paths';
import { useNavigate } from 'react-router';

function ReportRubricList() {
  const navigate = useNavigate();
  const [reportRubrics, setReportRubrics] = useState([]);
  async function fetchReportRubrics() {
    try {
      const data = await getReportRubricMapping(); // This function should be implemented to fetch data
      setReportRubrics(data);
    } catch (error) {
      console.error('Failed to fetch report rubrics:', error);
    }
  }

  useEffect(() => {
    fetchReportRubrics();
  }, []);

  async function handleEditRubric(reportId) {
    navigate(`${PATH_DASHBOARD.report.root}/edit/${reportId}`);
  }

  function handleDeleteRubric(reportId) {
    deleteReportType(reportId).then(() => {
      fetchReportRubrics();
    });
  }

  return (
    <Page title="Report Rubric Management">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Manage Report Rubrics"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Reports', href: 'Report List' }
          ]}
        />
        {reportRubrics.map((report) => (
          <Card key={report.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="div">
                  {report.report_type}
                </Typography>
                <Box>
                  <IconButton aria-label="edit" onClick={() => handleEditRubric(report.id)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDeleteRubric(report.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              </Box>
              <List>
                {report.rubric_types.map((rubric) => (
                  <ListItem key={rubric.id}>
                    <ListItemText primary={rubric.rubric_type} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Page>
  );
}

export default ReportRubricList;
