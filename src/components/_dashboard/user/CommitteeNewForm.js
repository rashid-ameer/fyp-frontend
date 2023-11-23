import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
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
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel
} from '@mui/material';

import eyeFill from '@iconify/icons-eva/eye-fill';

import { Icon } from '@iconify/react';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getStudent } from '../../../redux/slices/student';
import { getUserList } from '../../../redux/slices/user';
import { getBatchesList } from '../../../redux/slices/batch';
import { getDepartmentList } from '../../../redux/slices/department';
import { getRoleList } from '../../../redux/slices/role';

import useAuth from '../../../hooks/useAuth';
//
import Label from '../../Label';

import axios from '../../../utils/axios';

import { UploadAvatar } from '../../upload';
import { fData } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function CommitteeNewForm({ isEdit, currentUser, roleList, projects }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const { user } = useAuth();
  let student;
  const { departmentList } = useSelector((state) => state.department);
  const { batchesList } = useSelector((state) => state.batch);
  // const { roleList } = useSelector((state) => state.role);
  useSelector((state) => {
    student = state.student.student;
  });
  const NewUserSchema = Yup.object().shape({
    committeeCode: Yup.string().required('Committee Code is required'),
    moderator: Yup.string().required('Moderator is required'),
    member: Yup.string().required('Member is required'),
    project: Yup.string().required('Project is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      committeeCode: currentUser?.committeeCode || '',
      moderator: currentUser?.moderator || '',
      member: currentUser?.member || '',
      project: currentUser?.project || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values);
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
                  select
                  fullWidth
                  label="Moderator"
                  // placeholder="Moderator"
                  {...getFieldProps('moderator')}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.moderator && errors.moderator)}
                  helperText={touched.moderator && errors.moderator}
                >
                  <option value="" />
                  {roleList.map((row) => (
                    <option key={row.id}>{row.name}</option>
                  ))}
                </TextField>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Member"
                  placeholder="Member"
                  {...getFieldProps('member')}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.member && errors.member)}
                  helperText={touched.member && errors.member}
                >
                  <option value="" />
                  {roleList.map((row) => (
                    <option key={row.id}>{row.name}</option>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Assign Project"
                  placeholder="Assign Project"
                  {...getFieldProps('project')}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.project && errors.project)}
                  helperText={touched.project && errors.project}
                >
                  <option value="" />
                  {projects.map((row) => (
                    <option key={row.id}>{row.projectTitle}</option>
                  ))}
                </TextField>
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
