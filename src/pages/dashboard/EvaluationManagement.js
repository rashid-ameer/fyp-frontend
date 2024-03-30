import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box, Container, Link } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

import useSettings from '../../hooks/useSettings';

const operations = [
  { name: 'Manage PLO', path: PATH_DASHBOARD.evaluation.managePlo },
  { name: 'Manage Rubrics', path: PATH_DASHBOARD.evaluation.manageRubrics },
  { name: 'Manage Rubric Details', path: PATH_DASHBOARD.evaluation.manageRubricDetails },
  { name: 'Manage Rubric Types', path: PATH_DASHBOARD.evaluation.manageRubricTypes }
];

const Dashboard = () => {
  const { themeStretch, setColor } = useSettings();

  return (
    <Page title="Evaluation">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Evaluation"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Evaluation List' }]}
        />
        <Box sx={{ flexGrow: 1, m: 3 }}>
          {' '}
          {/* Added margin around the grid container */}
          <Grid container spacing={4}>
            {operations.map((operation, index) => (
              <Grid key={index} item xs={12} sm={6}>
                <Link component={RouterLink} to={operation.path} underline="none">
                  <Card
                    sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #d8d8d8', // Border color
                      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', // Shadow effect
                      '&:hover': {
                        boxShadow: '0 16px 32px 0 rgba(0,0,0,0.2)' // Enhanced shadow on hover
                      },
                      borderRadius: '12px' // Rounded corners
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" whiteSpace="nowrap">
                          {operation.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default Dashboard;
