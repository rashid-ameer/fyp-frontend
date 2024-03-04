import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';

// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';

// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getGroupByBatch, showGroupsByBatchWithoutCommittee } from '../../../redux/slices/group';
import { createCommittee, updateCommittee } from '../../../redux/slices/committee';

import { getInstructorList, getAvailableSupervisorsForCommittee } from '../../../redux/slices/instructor';

// ----------------------------------------------------------------------

export default function CommitteeNewForm({ isEdit, committee }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { availableSupervisorsForCommittee } = useSelector((state) => state.instructor);
  const { batchesList } = useSelector((state) => state.batch);
  const { groupsWithoutCommittee } = useSelector((state) => state.group);
  const { userList } = useSelector((state) => state.instructor);
  const { groupList } = useSelector((state) => state.group);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState([]);
  const [batch, setBatch] = useState('');

  const isBatchSelected = Boolean(batch);
  const supervisors = isEdit ? userList : availableSupervisorsForCommittee;
  const groups = isEdit ? groupList : groupsWithoutCommittee;

  const newCommitteeSchema = Yup.object().shape({
    committeeCode: Yup.string().min(2).required('Committee Code is required'),
    batch: Yup.string().required('Batch is required'),
    member: Yup.array()
      .min(1, 'Atleast one committee member is required')
      .required('At least one committee member is required'),
    project: Yup.array().min(1, 'Atleast one project is required').required('At least one project member is required')
  });

  // hanlde for committee selection
  const handleCommitteeSelection = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedCommittee(typeof value === 'string' ? value.split(',') : value);
    // Update formik.values.member with the selected value(s)
    formik.setFieldValue('member', typeof value === 'string' ? value.split(',') : value);
  };
  // hanlde for group selection
  const handleGroupSelection = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedProjects(typeof value === 'string' ? value.split(',') : value);
    formik.setFieldValue('project', typeof value === 'string' ? value.split(',') : value);
  };

  // handle change for a batch
  const handleBatchChange = (e) => {
    setBatch(e.target.value);
    formik.setFieldValue('batch', e.target.value);
  };

  // run when batch changes and fetch all available supervisors for committee
  useEffect(() => {
    if (isBatchSelected && !isEdit) {
      const batchId = batchesList.find((item) => item.batch === batch).id;
      formik.setFieldValue('member', []);
      setSelectedCommittee([]);
      dispatch(getAvailableSupervisorsForCommittee(batchId));
    } else if (isBatchSelected) {
      const batchId = batchesList.find((item) => item.batch === batch).id;
      dispatch(getInstructorList(batchId));
    }
  }, [dispatch, batch]);

  useEffect(() => {
    if (committee?.id) {
      setBatch(committee.batch.batch);
      setSelectedCommittee(committee.supervisor_committees.map((supervisor) => supervisor.id));
      setSelectedProjects(committee.groups.map((group) => group.id));
    }
  }, []);

  // run when batch changes and fetch projects who are not assigned to committee
  useEffect(() => {
    if (isBatchSelected && !isEdit) {
      const batchId = batchesList.find((item) => item.batch === batch).id;
      formik.setFieldValue('project', []);
      setSelectedProjects([]);
      dispatch(showGroupsByBatchWithoutCommittee(batchId));
    } else if (isBatchSelected) {
      const batchId = batchesList.find((item) => item.batch === batch).id;
      dispatch(getGroupByBatch(batchId));
    }
  }, [dispatch, batch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      committeeCode: committee?.committeeCode || '',
      batch: committee?.batch?.batch || '',
      member: [],
      project: []
    },
    validationSchema: newCommitteeSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      const { committeeCode, batch, member, project } = values;
      const batchId = batchesList.find((item) => item.batch === batch).id;

      if (!isEdit) {
        dispatch(
          createCommittee({
            supervisors: member,
            groups: project,
            batch_id: batchId
          })
        );
        formik.resetForm();
        setSubmitting(false);
        enqueueSnackbar('Committee created successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.committee.list);
      } else {
        dispatch(
          updateCommittee({
            id: committee.id,
            supervisors: member,
            groups: project
          })
        );

        setSubmitting(false);
        enqueueSnackbar('Committee updated successfully', { variant: 'success' });
        navigate(PATH_DASHBOARD.committee.list);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Committee Code"
                  {...getFieldProps('committeeCode')}
                  error={Boolean(touched.committeeCode && errors.committeeCode)}
                  helperText={touched.committeeCode && errors.committeeCode}
                />

                <TextField
                  disabled={isEdit}
                  select
                  fullWidth
                  label="Batch"
                  {...getFieldProps('batch')}
                  value={formik.values.batch}
                  onChange={handleBatchChange}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.batch && errors.batch)}
                  helperText={touched.batch && errors.batch}
                >
                  <option value="" />
                  {batchesList.map((batchObj) => (
                    <option key={batchObj.id}>{batchObj.batch}</option>
                  ))}
                </TextField>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <FormControl sx={{ width: '100%', visibility: `${isBatchSelected ? 'visible' : 'hidden'}` }}>
                  <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
                  <Select
                    {...getFieldProps('member')}
                    style={{ padding: '0' }}
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    fullWidth
                    multiple
                    value={selectedCommittee}
                    onChange={handleCommitteeSelection}
                    error={Boolean(touched.member && errors.member)}
                    helperText={touched.committeeCode && errors.committeeCode}
                    input={<OutlinedInput id="select-multiple-chip" label="Members" />}
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          gap: 0.5,
                          overflowX: 'auto',
                          maxWidth: '100%'
                        }}
                      >
                        {selectedCommittee.map((value) => (
                          <Chip key={value} label={supervisors.find((item) => item.id === value)?.user?.name} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          width: 'auto',
                          whiteSpace: 'nowrap'
                        }
                      }
                    }}
                  >
                    {supervisors.map((supervisor) => (
                      <MenuItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ width: '100%', visibility: `${isBatchSelected ? 'visible' : 'hidden'}` }}>
                  <InputLabel id="project-multiple-chip-label">Projects</InputLabel>
                  <Select
                    {...getFieldProps('project')}
                    style={{ padding: '0' }}
                    labelId="project-multiple-chip-label"
                    id="project-multiple-chip"
                    fullWidth
                    multiple
                    value={selectedProjects}
                    onChange={handleGroupSelection}
                    error={Boolean(touched.project && errors.project)}
                    helperText={touched.committeeCode && errors.committeeCode}
                    input={<OutlinedInput id="select-multiple-chip" label="Projects" />}
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          gap: 0.5,
                          overflowX: 'auto',
                          maxWidth: '100%'
                        }}
                      >
                        {selectedProjects.map((value) => (
                          <Chip key={value} label={groups.find((item) => item.id === value)?.project_title} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          width: 'auto',
                          whiteSpace: 'nowrap'
                        }
                      }
                    }}
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.project_title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Committee' : 'Save Changes'}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
