import React, { useEffect, useState } from 'react';
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
import { getIdeaSupervisonRequests, assignIdeaSupervisor } from './api'; // Import the API function
import Page from 'src/components/Page';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from '../routes/paths';

function SupervisorList() {
  const navigate = useNavigate();
  const { ideaId } = useParams();
  const [supervisorRequests, setSupervisorRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupervisorRequests = async () => {
      try {
        setIsLoading(true);
        const requests = await getIdeaSupervisonRequests(ideaId);
        setSupervisorRequests(requests);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('Error fetching supervisor requests: ' + error.message);
        console.error('Error fetching supervisor requests:', error);
      }
    };

    fetchSupervisorRequests();
  }, [ideaId]);

  async function handleAcceptRequest(supervisorId) {
    try {
      setIsLoading(true);
      const response = await assignIdeaSupervisor({ ideaId, supervisorId });
      if (response.success) {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          navigate(PATH_DASHBOARD.root);
        }, 2000);
      }
    } catch (error) {
      setError('Error accepting supervisor request: ' + error.message);
      setIsLoading(false);
      console.error('Error accepting supervisor request:', error);
    }
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (success && supervisorRequests.length === 0) {
    return <Typography>No supervisor requests found.</Typography>;
  }

  return (
    <Page>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="supervisor table">
          <TableHead>
            <TableRow>
              <TableCell>Supervisor Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supervisorRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.supervisor.user.name}</TableCell>
                <TableCell>{request.supervisor.specialization}</TableCell>
                <TableCell>{request.supervisor.user.email}</TableCell>
                <TableCell>{request.supervisor.office}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptRequest(request.supervisor.id)}
                  >
                    Accept Request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Typography variant="h6" color="error" align="center" marginTop="2rem">
          Error fetching supervisor requests: {error.message}
        </Typography>
      )}
      {success && (
        <Typography variant="h6" color="info" align="center" marginTop="2rem">
          Supervisor accepted successfully
        </Typography>
      )}
    </Page>
  );
}

export default SupervisorList;
