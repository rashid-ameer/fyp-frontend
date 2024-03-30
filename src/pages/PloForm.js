import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getAllPlos, addPlo, updatePlo, deletePlo } from './api'; // Import API functions

import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

import useSettings from '../../hooks/useSettings';

function PLO() {
  const { themeStretch, setColor } = useSettings();
  const [newPloTitle, setNewPloTitle] = useState('');
  const [plos, setPlos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch PLOs on component mount
  useEffect(() => {
    fetchPlos();
  }, []);

  const fetchPlos = async () => {
    try {
      const plosData = await getAllPlos();
      setPlos(plosData);
    } catch (error) {
      console.error('Error fetching PLOs:', error);
    }
  };

  const handleAddPlo = async (e) => {
    e.preventDefault();

    if (newPloTitle.trim() !== '') {
      try {
        if (editIndex !== null) {
          await updatePlo(plos[editIndex].id, newPloTitle); // Update existing PLO
        } else {
          await addPlo(newPloTitle); // Add new PLO
        }
        setNewPloTitle('');
        setEditIndex(null);
        fetchPlos(); // Fetch updated PLOs
      } catch (error) {
        console.error('Error adding/updating PLO:', error);
      }
    }
  };

  const handleEdit = (index) => {
    setNewPloTitle(plos[index].title);
    setEditIndex(index);
  };

  const handleDelete = async (id) => {
    try {
      await deletePlo(id); // Delete PLO
      fetchPlos(); // Fetch updated PLOs
    } catch (error) {
      console.error('Error deleting PLO:', error);
    }
  };

  return (
    <Page title="Evaluation">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Evaluation"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation List', href: PATH_DASHBOARD.evaluation.mangement },
            { name: 'Manage PLO' }
          ]}
        />
        <div style={{ margin: '20px' }}>
          <Typography variant="h5" fontWeight="bold" component="h2">
            Add PLO
          </Typography>
          <form onSubmit={handleAddPlo} style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
            <TextField
              label="PLO Title"
              variant="outlined"
              value={newPloTitle}
              onChange={(e) => setNewPloTitle(e.target.value)}
              style={{ flex: '1' }}
              sx={{ '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {} }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editIndex !== null ? 'Update PLO' : 'Add PLO'}
            </Button>
          </form>

          <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography sx={{ width: '90px' }} fontWeight="bold">
                      PLO No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Title</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plos.map((plo, index) => (
                  <TableRow key={plo.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      {plo.title}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton title="Edit plo" color="primary" aria-label="edit" onClick={() => handleEdit(index)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        title="Delete plo"
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDelete(plo.id)}
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
      </Container>
    </Page>
  );
}

export default PLO;
