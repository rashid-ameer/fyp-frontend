import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getRubricTypes, addRubricType, updateRubricType, deleteRubricType } from './api';

function RubricTypeForm() {
  const [newRubricType, setNewRubricType] = useState('');
  const [rubricTypes, setRubricTypes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchRubricTypes();
  }, []);

  const fetchRubricTypes = async () => {
    try {
      const data = await getRubricTypes();
      setRubricTypes(data);
    } catch (error) {
      console.error('Error fetching rubric types:', error);
    }
  };

  const handleAddRubricType = async (e) => {
    e.preventDefault();
    if (newRubricType.trim() !== '') {
      try {
        if (editIndex !== null) {
          // If editing, update the existing rubric type
          await updateRubricType(rubricTypes[editIndex].id, newRubricType);
          const updatedRubricTypes = [...rubricTypes];
          updatedRubricTypes[editIndex].rubric_type = newRubricType;
          setRubricTypes(updatedRubricTypes);
          setEditIndex(null);
        } else {
          // Otherwise, add a new rubric type
          await addRubricType(newRubricType);
          fetchRubricTypes(); // Refresh the list of rubric types after adding
        }
        setNewRubricType('');
      } catch (error) {
        console.error('Error adding/updating rubric type:', error);
      }
    }
  };

  const handleEdit = (index) => {
    setNewRubricType(rubricTypes[index].rubric_type);
    setEditIndex(index);
  };

  const handleDelete = async (id, index) => {
    try {
      await deleteRubricType(id);
      const updatedRubricTypes = [...rubricTypes];
      updatedRubricTypes.splice(index, 1);
      setRubricTypes(updatedRubricTypes);
    } catch (error) {
      console.error('Error deleting rubric type:', error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <form style={{ display: 'flex', gap: '20px' }} onSubmit={handleAddRubricType}>
        <TextField
          label="Rubric Type"
          variant="outlined"
          value={newRubricType}
          onChange={(e) => setNewRubricType(e.target.value)}
          style={{ flex: '1' }}
        />
        <Button variant="contained" color="primary" type="submit">
          {editIndex !== null ? 'Update Rubric Type' : 'Add Rubric Type'}
        </Button>
      </form>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Rubric Type</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rubricTypes.map((rubricType, index) => (
              <TableRow key={rubricType.id}>
                <TableCell component="th" scope="row">
                  {rubricType.rubric_type}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    title="Edit rubric type"
                    color="primary"
                    aria-label="edit"
                    onClick={() => handleEdit(index)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    title="Delete rubric type"
                    color="error"
                    aria-label="delete"
                    onClick={() => handleDelete(rubricType.id, index)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RubricTypeForm;
