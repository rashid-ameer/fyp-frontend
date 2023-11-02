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
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
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

// ----------------------------------------------------------------------

StudentNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function StudentNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const { user } = useAuth();
  let student;
  const { departmentList } = useSelector((state) => state.department);
  const { batchesList } = useSelector((state) => state.batch);
  const { roleList } = useSelector((state) => state.role);
  useSelector((state) => {
    student = state.student.student;
  });
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone Number is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
    batch: Yup.string().required('Batch is required'),
    cmsId: Yup.string().required('CMS ID is required'),
    department: Yup.string().required('Department is required')
    // specialization: Yup.string().required('Specialization is required'),
    // avatarUrl: Yup.mixed().required('Avatar is required')
  });
  useEffect(() => {
    dispatch(getBatchesList());
    dispatch(getDepartmentList());
    dispatch(getRoleList());
    dispatch(getStudent(currentUser ? currentUser.id : ''));
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      password: currentUser?.password || '',
      role: currentUser?.role?.role_name || 'Student' || 'Student',
      cmsId: currentUser?.user_name || '',
      department: currentUser
        ? departmentList.find((dep) => dep.id === currentUser.department_id)?.department_name || ''
        : departmentList[0]?.department_name || '',
      avatarUrl: currentUser?.imgUrl || null,
      isVerified: currentUser?.is_varified || 1,
      status: currentUser?.isActive || 1,
      batch: student ? batchesList.find((batch) => batch.id === student.batch_id)?.batch || '' : batchesList[0].batch
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          const data = new FormData();
          if (values.avatarUrl !== null) {
            data.append('image', values.avatarUrl);
          } else {
            data.append('image', '');
          }
          data.append('id', currentUser.id);
          data.append('user_name', values.cmsId);
          data.append('name', values.name);
          data.append('email', values.email);
          data.append('password', values.password);
          data.append('phoneNumber', values.phoneNumber);
          data.append('batch_id', batchesList?.find((batch) => batch.batch === values.batch)?.id || '');
          data.append('isActive', values.status);
          data.append('is_varified', values.isVerified);
          data.append('is_deleted', 0);
          data.append('role_id', roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '');
          data.append(
            'department_id',
            departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
          );
          axios.post('http://localhost:8080/Student/updateStudent', data, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          });
          dispatch(getUserList());
        } else {
          const data = new FormData();
          if (values.avatarUrl !== null) {
            data.append('image', values.avatarUrl);
          } else {
            data.append('image', '');
          }
          data.append('user_name', values.cmsId);
          data.append('name', values.name);
          data.append('email', values.email);
          data.append('password', values.password);
          data.append('phoneNumber', values.phoneNumber);
          data.append('batch_id', batchesList?.find((batch) => batch.batch === values.batch)?.id || '');
          data.append('isActive', values.status);
          data.append('is_varified', values.isVerified);
          data.append('is_deleted', 0);
          data.append('role_id', roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '');
          data.append(
            'department_id',
            departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
          );
          axios.post('http://localhost:8080/Student/saveStudent', data, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(
          user.role.role_name === 'Super Admin' || user.role.role_name === 'Coordinator'
            ? PATH_DASHBOARD.user.list
            : PATH_DASHBOARD.general.studentProfile
        );
      } catch (error) {
        console.error(error);
        alert(error?.error?.errors[0].message || 'not submitted');
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFieldValue(
        'avatarUrl',
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
    },
    [setFieldValue]
  );

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Label
                color={values.status !== 1 ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status === 1 ? 'active' : 'banned'}
              </Label>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.avatarUrl}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />

                {/* <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText> */}
              </Box>
              <FormControlLabel
                disabled={user.role.role_name === 'Student'}
                labelPlacement="start"
                control={
                  <Switch
                    onChange={(event) => setFieldValue('status', event.target.checked ? 1 : 0)}
                    checked={values.status === 1}
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

              <FormControlLabel
                disabled={user.role.role_name === 'Student'}
                labelPlacement="start"
                control={
                  <Switch
                    {...getFieldProps('isVerified')}
                    onChange={(event) => setFieldValue('isVerified', event.target.checked ? 1 : 0)}
                    checked={values.isVerified === 1}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Verified Status
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phoneNumber')}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                  <TextField
                    select
                    disabled
                    fullWidth
                    label="Role"
                    placeholder="role"
                    {...getFieldProps('role')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  >
                    {roleList.map((row) => (
                      <option>{row.role_name}</option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    disabled={user.role.role_name === 'Student'}
                    fullWidth
                    label="CMS ID"
                    {...getFieldProps('cmsId')}
                    error={Boolean(touched.cmsId && errors.cmsId)}
                    helperText={touched.cmsId && errors.cmsId}
                  />
                  <TextField
                    disabled={user.role.role_name === 'Student'}
                    select
                    fullWidth
                    label="department"
                    placeholder="department"
                    {...getFieldProps('department')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.department && errors.department)}
                    helperText={touched.department && errors.department}
                  >
                    {departmentList.map((row) => (
                      <option>{row.department_name}</option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {/* <TextField
                    fullWidth
                    label="Password"
                    {...getFieldProps('password')}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  /> */}
                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    {...getFieldProps('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <TextField
                    disabled={user.role.role_name === 'Student'}
                    select
                    fullWidth
                    label="batch"
                    placeholder="batch"
                    {...getFieldProps('batch')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.batch && errors.batch)}
                    helperText={touched.batch && errors.batch}
                  >
                    {batchesList.map((row) => (
                      <option>{row.batch}</option>
                    ))}
                  </TextField>
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Student' : 'Save Changes'}
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
