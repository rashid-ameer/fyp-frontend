// RubricDetailForm.js

import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  Container
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import useSettings from '../hooks/useSettings';
import { PATH_DASHBOARD } from '../routes/paths';

import {
  addRubricDetail,
  updateRubricDetail,
  deleteRubricDetail,
  getAllRubrics,
  getRubricTypes,
  getRubricDetails
} from './api'; // Import API functions

function RubricDetailForm() {
  const { themeStretch, setColor } = useSettings();
  const [details, setDetails] = useState('');
  const [points, setPoints] = useState(0);
  const [selectedRubric, setSelectedRubric] = useState('');
  const [rubricData, setRubricData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [rubricTypes, setRubricTypes] = useState([]);
  const [rubricType, setRubricType] = useState('All');
  const [rubrics, setRubrics] = useState([]);

  const rubricsCriteriaToShow =
    rubricType === 'All' ? rubrics : rubrics.filter((rubric) => rubric.rubric_type_id === rubricType);
  const rubricsDetailsToShow =
    rubricType === 'All'
      ? rubricData
      : rubricData.filter((data) => getRubric(data.rubric_id)?.rubric_type_id === rubricType);

  useEffect(() => {
    getRubricDetails()
      .then((data) => {
        setRubricData(data);
      })
      .catch((error) => {
        console.error('Error fetching rubric details:', error);
      });
  }, []),
    useEffect(() => {
      getRubricTypes().then((data) => {
        setRubricTypes(data);
      });

      getAllRubrics().then((data) => {
        setRubrics(data);
      });
    }, []);

  const getCriteria = (id) => {
    const rubric = rubrics.find((rubric) => rubric.id === id);
    return rubric?.criteria || '';
  };

  function getRubric(id) {
    return rubrics.find((rubric) => rubric.id === id);
  }

  const handleSave = async () => {
    if (details.trim() === '' || points < 0 || getCriteria(selectedRubric).trim() === '') {
      return; // Prevent saving empty data
    }

    try {
      if (editIndex !== null) {
        // If editing, update the existing data
        await updateRubricDetail(rubricData[editIndex].id, { details, points, rubric_id: selectedRubric });
        const updatedData = [...rubricData];
        updatedData[editIndex] = { ...updatedData[editIndex], details, points, rubric_id: selectedRubric };
        setRubricData(updatedData);
        setEditIndex(null);
      } else {
        // Otherwise, add a new record
        const response = await addRubricDetail({ details, points, rubric_id: selectedRubric });
        setRubricData([...rubricData, { id: response.id, details, points, rubric_id: selectedRubric }]);
      }
      // Reset input fields
      setDetails('');
      setPoints(0);
      setSelectedRubric('');
    } catch (error) {
      console.error('Error saving rubric detail:', error);
    }
  };

  const handleEdit = (id) => {
    const index = rubricData.findIndex((data) => data.id === id);
    const { details, points, rubric_id } = rubricData[index];
    setDetails(details);
    setPoints(points);
    setSelectedRubric(rubric_id);
    setEditIndex(index);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRubricDetail(id);
      const updatedData = [...rubricData];
      const rubricIndex = updatedData.findIndex((data) => data.id === id);
      updatedData.splice(rubricIndex, 1);
      setRubricData(updatedData);
    } catch (error) {
      console.error('Error deleting rubric detail:', error);
    }
  };

  const handlePoints = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setPoints(0);
    } else {
      setPoints(value);
    }
  };

  const handleEditIndex = (e) => {};

  return (
    <Page>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Evaluation"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation List', href: PATH_DASHBOARD.evaluation.management },
            { name: 'Manage Rubric Details' }
          ]}
        />
        <div style={{ margin: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold" component="h2">
              Add Rubric Data
            </Typography>
            <TextField
              sx={{ width: '200px' }}
              select
              label="Select Rubric Type"
              variant="outlined"
              value={rubricType}
              onChange={(e) => setRubricType(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              <MenuItem value="All">All</MenuItem>
              {rubricTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.rubric_type}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <Grid container spacing={2} style={{ marginTop: '1rem' }}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Points"
                variant="outlined"
                fullWidth
                value={points}
                onChange={handlePoints}
                style={{ marginBottom: '1rem' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Criteria"
                variant="outlined"
                fullWidth
                value={selectedRubric}
                onChange={(e) => setSelectedRubric(e.target.value)}
                style={{ marginBottom: '1rem' }}
              >
                {rubricsCriteriaToShow.map((rubric) => (
                  <MenuItem key={rubric.id} value={rubric.id}>
                    {rubric.criteria}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ width: '100%' }}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Detail"
                multiline
                minRows={6}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                style={{ display: 'block', marginLeft: 'auto' }}
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                {editIndex !== null ? 'Update' : 'Save'}
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '90px' }}>
                    <Typography fontWeight="bold">Rubric No</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Criteria</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Details</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Points</Typography>
                  </TableCell>
                  <TableCell sx={{ width: '90px' }}>
                    <Typography fontWeight="bold">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rubricsDetailsToShow.map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{getCriteria(data.rubric_id)}</TableCell>
                    <TableCell>{data.details}</TableCell>
                    <TableCell>{data.points}</TableCell>
                    <TableCell>
                      <IconButton
                        title="Edit Data"
                        color="primary"
                        aria-label="edit"
                        onClick={() => handleEdit(data.id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        title="Delete Data"
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDelete(data.id)}
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

export default RubricDetailForm;
