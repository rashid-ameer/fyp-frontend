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
  Container
} from '@mui/material';
import Page from '../../components/Page'; // Import your Page component
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'; // Import your HeaderBreadcrumbs component
import { PATH_DASHBOARD } from '../../routes/paths'; // Import your PATH_DASHBOARD constant
import useAuth from '../../hooks/useAuth'; // Import your useAuth hook
import { getStudentWithGroup, getGradedWork } from '../api'; // Import your API function
import { Link } from 'react-router-dom';

function MarksList() {
  const { user } = useAuth();
  const [student, setStudent] = useState({});
  const [gradedWork, setGradedWork] = useState([]);
  const [totalGrades, setTotalGrades] = useState([]);
  const [grades, setGrades] = useState([]);

  //   const assignments = [
  //     { id: 1, name: 'Project Proposal', totalMarks: 100, obtainedMarks: 85 },
  //     { id: 2, name: 'Midterm Report', totalMarks: 100, obtainedMarks: 90 },
  //     { id: 3, name: 'Final Presentation', totalMarks: 100, obtainedMarks: 95 }
  //   ];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentWithGroup(user.user_name);
        setStudent(data.data);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    };

    if (user.user_name) {
      fetchStudent();
    }
  }, []);

  console.log(gradedWork);

  useEffect(() => {
    const fetchGradedWork = async () => {
      try {
        const data = await fetch(`http://localhost:8080/Grades/getAllGrades`);
        const grades = await data.json();
        setGrades(grades);
      } catch (error) {
        console.error('Failed to fetch graded work:', error);
      }
    };

    fetchGradedWork();
  }, []);

  useEffect(() => {
    const fetchGradedWork = async () => {
      try {
        const data = await getGradedWork(student.group_id);
        setGradedWork(data);
      } catch (error) {
        console.error('Failed to fetch graded work:', error);
      }
    };

    if (student.group_id) {
      fetchGradedWork();
    }
  }, [student]);

  useEffect(() => {
    const fetchTotalGrades = async () => {
      fetch(`http://localhost:8080/GroupGrades/getGroupGrades/${student.group_id}`)
        .then((res) => res.json())
        .then((data) => {
          setTotalGrades(data.groupGrades);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (student.group_id) {
      console.log(student.group_id);
      fetchTotalGrades();
    }
  }, [student]);

  let internalMarks = gradedWork?.reduce((acc, item) => {
    if (item.group_submitted_file.obtained_marks) {
      return acc + item.group_submitted_file.obtained_marks;
    }
    return acc;
  }, 0);

  internalMarks = (internalMarks / 60) * grades.find((item) => item.grade_type === 'committee')?.marks;

  return (
    <Page title="Evaluated Assignments">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Evaluated Assignments"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'All Assignments', href: '/Grades' }
          ]}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment Name</TableCell>
                <TableCell>Total Marks</TableCell>
                <TableCell>Obtained Marks</TableCell>
                {/* <TableCell>View More</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {gradedWork.map((work) => (
                <TableRow key={work.id}>
                  <TableCell>{work.title}</TableCell>
                  <TableCell>{work.total_points}</TableCell>
                  <TableCell>{(work.group_submitted_file.obtained_marks / 20) * work.total_points}</TableCell>
                  {/* <TableCell>
                    <Button variant="contained" color="primary">
                      <Link
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to={`${PATH_DASHBOARD.grades.detailGrades}/${work.id}`}
                        state={{ groupId: student.group_id }}
                      >
                        View More
                      </Link>
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <strong>Total</strong>
                </TableCell>
              </TableRow>

              {grades.find((item) => item.grade_type === 'committee') && (
                <TableRow>
                  <TableCell>Internal Marks</TableCell>
                  <TableCell>{(grades.find((item) => item.grade_type === 'committee')?.marks / 100) * 200}</TableCell>
                  <TableCell>{internalMarks}</TableCell>
                </TableRow>
              )}

              {grades.find((item) => item.grade_type === 'supervisor') && (
                <TableRow>
                  <TableCell>Supervisor Marks</TableCell>
                  <TableCell>{(grades.find((item) => item.grade_type === 'supervisor')?.marks / 100) * 200}</TableCell>
                  <TableCell>{totalGrades?.supervisor_marks || 'Not Assigned'}</TableCell>
                </TableRow>
              )}

              {grades.find((item) => item.grade_type === 'external') && (
                <TableRow>
                  <TableCell>External Marks</TableCell>
                  <TableCell>{(grades.find((item) => item.grade_type === 'external')?.marks / 100) * 200}</TableCell>
                  <TableCell>{totalGrades?.external_marks || 'Not Assigned'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Page>
  );
}

export default MarksList;
