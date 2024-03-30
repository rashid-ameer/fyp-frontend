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
  MenuItem,
  Container
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import useSettings from '../hooks/useSettings';
import { PATH_DASHBOARD } from '../routes/paths';

import { addRubric, deleteRubric, getAllPlos, getAllRubrics, getRubricTypes, updateRubric } from './api';

function RubricForm() {
  const { themeStretch, setColor } = useSettings();
  const [criteria, setCriteria] = useState('');
  const [selectedPlo, setSelectedPlo] = useState('');
  const [selectedRubricType, setSelectedRubricType] = useState('');
  const [rubricList, setRubricList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [plos, setPlos] = useState([]);
  const [rubricTypes, setRubricTypes] = useState([]);

  useEffect(() => {
    // Fetch PLOs
    getAllPlos()
      .then((data) => {
        setPlos(data);
      })
      .catch((error) => {
        console.error('Error fetching PLOs:', error);
      });

    // Fetch Rubric Types
    getRubricTypes()
      .then((data) => {
        setRubricTypes(data);
      })
      .catch((error) => {
        console.error('Error fetching Rubric Types:', error);
      });
  }, []);

  useEffect(() => {
    getAllRubrics()
      .then((data) => {
        setRubricList(data);
      })
      .catch((error) => {
        console.error('Error fetching Rubrics:', error);
      });
  }, []);

  const handleAddRubric = (e) => {
    e.preventDefault();
    if (criteria.trim() !== '' && getRubricType(selectedRubricType).trim() !== '') {
      if (editIndex !== null) {
        // If editing, update the existing rubric
        const updatedRubricList = [...rubricList];
        updatedRubricList[editIndex] = {
          criteria,
          PLO_id: selectedPlo,
          rubric_type_id: selectedRubricType
        };
        updateRubric(rubricList[editIndex].id, {
          criteria,
          PLO_id: selectedPlo,
          rubric_type_id: selectedRubricType
        }).then(() => {
          setRubricList(updatedRubricList);
          setEditIndex(null);
        });
      } else {
        // Otherwise, add a new rubric
        setRubricList([...rubricList, { criteria, PLO_id: selectedPlo, rubric_type_id: selectedRubricType }]);
        addRubric({ criteria, PLO_id: selectedPlo, rubric_type_id: selectedRubricType });
      }
      setCriteria('');
      setSelectedPlo('');
      setSelectedRubricType('');
    }
  };

  const handleEdit = (index) => {
    const { criteria, PLO_id, rubric_type_id } = rubricList[index];
    setCriteria(criteria);
    setSelectedPlo(PLO_id);
    setSelectedRubricType(rubric_type_id);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedRubricList = [...rubricList];
    updatedRubricList.splice(index, 1);
    setRubricList(updatedRubricList);
    deleteRubric(rubricList[index].id);
  };

  const getPlo = (id) => {
    const plo = plos.find((plo) => plo.id === id);
    return plo ? plo.title : '';
  };

  const getRubricType = (id) => {
    const rubricType = rubricTypes.find((rubricType) => rubricType.id === id);
    return rubricType ? rubricType.rubric_type : '';
  };

  return (
    <Page>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Evaluation"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation List', href: PATH_DASHBOARD.evaluation.management },
            { name: 'Manage Rubrics' }
          ]}
        />

        <div style={{ margin: '20px' }}>
          <Typography variant="h5" fontWeight="bold" component="h2">
            Add Rubric
          </Typography>
          <form onSubmit={handleAddRubric}>
            <Grid container spacing={2} style={{ marginTop: '1rem' }}>
              <Grid item xs={12}>
                <TextField
                  label="Criteria"
                  variant="outlined"
                  fullWidth
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select PLO"
                  variant="outlined"
                  fullWidth
                  value={selectedPlo}
                  onChange={(e) => setSelectedPlo(e.target.value)}
                >
                  {plos.map((plo) => (
                    <MenuItem key={plo.id} value={plo.id}>
                      {plo.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Rubric Type"
                  variant="outlined"
                  fullWidth
                  value={selectedRubricType}
                  onChange={(e) => setSelectedRubricType(e.target.value)}
                >
                  {rubricTypes.map((rubricType) => (
                    <MenuItem key={rubricType.id} value={rubricType.id}>
                      {rubricType.rubric_type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  style={{ display: 'block', marginLeft: 'auto' }}
                  variant="contained"
                  color="primary"
                >
                  {editIndex !== null ? 'Update Rubric' : 'Add Rubric'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold" sx={{ width: '90px' }}>
                      Rubric No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Criteria</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">PLO</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Rubric Type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" sx={{ width: '90px' }}>
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rubricList.map((rubric, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{rubric.criteria}</TableCell>
                    <TableCell>{getPlo(rubric.PLO_id) || 'Not Provided'}</TableCell>
                    <TableCell>{getRubricType(rubric.rubric_type_id)}</TableCell>
                    <TableCell>
                      <IconButton
                        title="Edit Rubric"
                        color="primary"
                        aria-label="edit"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        title="Delete Rubric"
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDelete(index)}
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

export default RubricForm;
