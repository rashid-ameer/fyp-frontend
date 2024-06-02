import React, { useState, useEffect } from 'react';
import { Container, TextField, MenuItem, Button, IconButton, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const gradeTypes = ['supervisor', 'committee', 'external'];

const ManageGrades = () => {
  const [gradeType, setGradeType] = useState('');
  const [marks, setMarks] = useState('');
  const [grades, setGrades] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch('/Grades/getAllGrades')
      .then((response) => response.json())
      .then((data) => setGrades(data))
      .catch((error) => console.error('Error fetching grades:', error));
  }, []);

  const handleAddGrade = () => {
    if (grades.find((grade) => grade.grade_type === gradeType)) {
      alert('Grade type already exists');
      return;
    }

    fetch('/Grades/addGrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ grade_type: gradeType, marks: marks })
    })
      .then((response) => response.json())
      .then((data) => {
        setGrades([...grades, data]);
        setGradeType('');
        setMarks('');
      })
      .catch((error) => console.error('Error adding grade:', error));
  };

  const handleEditGrade = (index) => {
    const gradeToUpdate = grades[index];
    fetch(`/Grades/updateGrades/${gradeToUpdate.grade_type}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ marks: marks })
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedGrades = [...grades];
        updatedGrades[index] = data;
        setGrades(updatedGrades);
        setGradeType('');
        setMarks('');
        setEditIndex(null);
      })
      .catch((error) => console.error('Error updating grade:', error));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assign Grades
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <TextField
            select
            label="Grade Type"
            value={gradeType}
            onChange={(e) => setGradeType(e.target.value)}
            fullWidth
            margin="normal"
          >
            {gradeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Marks"
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGrade}
            sx={{ mt: 2, whiteSpace: 'nowrap', minWidth: '9rem', display: 'block' }}
          >
            {editIndex !== null ? 'Update Grade' : 'Add Grade'}
          </Button>
        </div>
        <table style={{ marginTop: '3rem', width: '100%' }}>
          <thead>
            <tr>
              <th>Grade Type</th>
              <th>Marks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td align="center">{`${grade.grade_type.charAt(0).toUpperCase() + grade.grade_type.slice(1)}`}</td>
                <td align="center">{`${grade.marks} marks`}</td>
                <td align="center">
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditGrade(index)}>
                    <EditIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Container>
  );
};

export default ManageGrades;
