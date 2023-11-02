import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
// utils
import axios from '../../../utils/axios';

import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    role: Yup.string().required('role is required'),
    roleDescription: Yup.string().required('Role Description is required'),
    isActive: Yup.string().required('Active Status is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role: currentUser?.role_name || '',
      roleDescription: currentUser?.role_description || '',
      isActive: currentUser?.isActive || 0
      // isVerified: currentUser?.isVerified || true,
      // status: currentUser?.status
    },
    validationSchema: NewUserSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          console.log('values', values);
          axios.post('http://localhost:8080/Role/updateRole', {
            id: currentUser.id,
            role_name: values.role,
            role_description: values.roleDescription,
            isActive: values.isActive
          });
        } else {
          axios.post('http://localhost:8080/Role/saveRole', {
            role_name: values.role,
            role_description: values.roleDescription,
            isActive: values.isActive
          });
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.userRole);
      } catch (error) {
        console.error(error);
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
                  <TextField
                    fullWidth
                    label="Role"
                    {...getFieldProps('role')}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  />
                  <TextField
                    fullWidth
                    label="Role Description"
                    {...getFieldProps('roleDescription')}
                    error={Boolean(touched.roleDescription && errors.roleDescription)}
                    helperText={touched.roleDescription && errors.roleDescription}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Role' : 'Save Changes'}
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
