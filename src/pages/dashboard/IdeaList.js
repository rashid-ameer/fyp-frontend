import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography
} from '@mui/material';
import { getAllIdeas } from '../api';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Formats raw idea data from the API for display in the IdeaList table.
 * @param {Array} rawData - The raw data array fetched from the API.
 * @returns {Array} Formatted data array with detailed structures.
 */
function formatIdeaData(rawData) {
  return rawData.map((idea) => ({
    id: idea.id,
    ideaName: idea.title, // Assume 'title' is the field for the idea name.
    groupName: idea.group ? idea.group.project_title : 'No Group', // Group name or default message.
    supervisor: idea.supervisor
      ? {
          id: idea.supervisor.id,
          name: idea.supervisor.user.name
        }
      : {
          id: null,
          name: 'Not Assigned'
        }, // Supervisor details or default values.
    batch: {
      id: idea.group && idea.group.students[0] ? idea.group.students[0].batch_id : null,
      batchName: idea.group && idea.group.students[0] ? idea.group.students[0].batch.batch : 'No Batch'
    }, // Batch details with fallbacks.
    students: idea.group
      ? idea.group.students.map((student) => ({
          id: student.id,
          name: student.user.name
        }))
      : [] // List of students or empty array if none exist.
  }));
}

function IdeaList() {
  const { themeStretch, setColor } = useSettings();
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const fetchedIdeas = await getAllIdeas();
        const formattedIdeas = formatIdeaData(fetchedIdeas); // Format the fetched data
        setIdeas(formattedIdeas);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <Page title="Committee: List | SIBAU FYPMS ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Ideas"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Idea List' }]}
        />

        {ideas.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Idea Name</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Group Name</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Batch Name</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Supervisor</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ideas.map((idea) => (
                  <TableRow key={idea.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {idea.ideaName}
                    </TableCell>
                    <TableCell>{idea.groupName}</TableCell>
                    <TableCell>{idea.batch.batchName}</TableCell>
                    <TableCell>{idea.supervisor.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        component={RouterLink}
                        to={`${PATH_DASHBOARD.idea.root}/${idea.id}`}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        View More
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" component="p" align="center">
            No ideas found
          </Typography>
        )}
      </Container>
    </Page>
  );
}

export default IdeaList;
