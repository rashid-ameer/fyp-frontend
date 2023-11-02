import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';

// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';

import { UploadAvatar } from '../../upload';
import axios from '../../../utils/axios';

const { yearsGenerator } = require('dates-generator');

// ----------------------------------------------------------------------

BatchNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function BatchNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    year: Yup.string().required('Year is required'),
    batch: Yup.string().required('Batch is required')
    // avatarUrl: Yup.mixed().required('Avatar is required')
  });
  const getBatchSeason = (temp) => {
    const b = temp.batch;
    const array = b.split('-');
    return array[0];
  };
  const getBatchYear = (temp) => {
    const b = temp.batch;
    const array = b.split('-');
    return array[1];
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      batch: currentUser ? getBatchSeason(currentUser) : '',
      year: currentUser ? getBatchYear(currentUser) : '',
      isActive: currentUser?.isActive || 0
    },
    validationSchema: NewUserSchema,

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log(String(values.batch).concat('-', String(values.year)), values);
        if (isEdit) {
          await axios.post('http://localhost:8080/Batch/updateBatch', {
            id: currentUser.id,
            batch: String(values.batch).concat('-', String(values.year)),
            isActive: values.isActive
          });
        } else {
          await axios.post('http://localhost:8080/Batch/saveBatch', {
            batch: String(values.batch).concat('-', String(values.year)),
            isActive: values.isActive,
            is_deleted: 0
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.userbatch);
      } catch (error) {
        alert(error.error.errors[0].message || 'not submitted');
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );
  const [valueRB, setValue] = React.useState('Fall');
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // dates........
  const presentDay = new Date();
  const year = presentDay.getFullYear();
  const years = yearsGenerator(year - 10, year);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Label
                color={values.isActive !== 1 ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.isActive === 1 ? 'active' : 'banned'}
              </Label>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    onChange={(event) => setFieldValue('isActive', event.target.checked ? 1 : 0)}
                    checked={values.isActive === 1}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormControl component="fieldset" style={{ width: 200 }}>
                    <FormLabel component="legend">Batch</FormLabel>
                    <RadioGroup
                      aria-label="batch"
                      name="controlled-radio-buttons-group"
                      value={valueRB}
                      onChange={(event) => setFieldValue('batch', event.target.value)}
                    >
                      <FormControlLabel
                        value="Spring"
                        control={<Radio checked={values.batch === 'Spring'} />}
                        label="Spring"
                      />
                      <FormControlLabel
                        value="Fall"
                        control={<Radio checked={values.batch === 'Fall'} />}
                        label="Fall"
                      />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    style={{ width: 200 }}
                    select
                    label="Year"
                    {...getFieldProps('year')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.isActive && errors.isActive)}
                    helperText={touched.isActive && errors.isActive}
                  >
                    <option>Select Year</option>
                    {years
                      .sort()
                      .reverse()
                      .map((y) => (
                        <option>{y}</option>
                      ))}
                  </TextField>
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Batch' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
