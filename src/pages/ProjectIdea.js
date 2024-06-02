import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { getIdea, createRequestForSupervison } from './api';
import { getInstructor } from '../redux/slices/instructor';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { PATH_DASHBOARD } from '../routes/paths';

function ProjectIdeaDetails() {
  const { ideaId } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.instructor);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await getIdea(parseInt(ideaId, 10));
        setIdea(details);
      } catch (error) {
        console.error('Error fetching idea details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [ideaId]);

  async function handleRequestForSupervisor() {
    const data = {
      supervisor_id: user.id,
      idea_id: ideaId
    };
    const response = await createRequestForSupervison(data);
    navigate(`${PATH_DASHBOARD.idea.ideaList}`);
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (!idea) return <Typography>No idea found for ID: {ideaId}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {idea.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {idea.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Students
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="students table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CMS ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {idea.group.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.user.name}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.user.user_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>
          Supervisor: {idea.supervisor ? idea.supervisor.user.name : 'No Supervisor Assigned'}
        </Typography>
        {!idea.supervisor && (
          <Button variant="contained" color="primary" onClick={handleRequestForSupervisor}>
            Request to Supervise
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ProjectIdeaDetails;
