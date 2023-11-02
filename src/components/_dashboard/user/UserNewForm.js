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
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getInstructor, getInstructorList } from '../../../redux/slices/instructor';
import { getDepartmentList } from '../../../redux/slices/department';
import { getUserList } from '../../../redux/slices/user';
import { getRoleList } from '../../../redux/slices/role';
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';

import axios from '../../../utils/axios';

import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  let instructor;
  const { departmentList } = useSelector((state) => state.department);
  const { roleList } = useSelector((state) => state.role);
  useSelector((state) => {
    instructor = state.instructor.users;
  });
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone Number is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string().required('Role is required'),
    officeAddress: Yup.string().required('Office Address is required'),
    cmsId: Yup.string().required('CMS ID is required'),
    department: Yup.string().required('Department is required'),
    specialization: Yup.string().required('Specialization is required')
    // avatarUrl: Yup.mixed().required('Avatar is required')
  });
  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(getRoleList());
    dispatch(getInstructor(currentUser ? currentUser.user_name : ''));
  }, [dispatch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.user.name || '',
      email: currentUser?.user.email || '',
      phoneNumber: currentUser?.user.phoneNumber || '',
      password: currentUser?.user.password || '',
      role: currentUser ? roleList.find((role) => role.id === currentUser.user.role_id)?.role_name : 'Supervisor',
      cmsId: currentUser?.user.user_name || '',
      department: currentUser
        ? departmentList.find((dep) => dep.id === currentUser.user.department_id)?.department_name || 'Computer Science'
        : 'Computer Science',
      avatarUrl: currentUser?.user.imgUrl || null,
      isVerified: currentUser?.user.is_varified || 1,
      status: currentUser?.user.isActive || 1,
      officeAddress: currentUser?.office || '' || '',
      specialization: currentUser?.specialization || '' || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values);
      try {
        if (isEdit) {
          const data = new FormData();
          if (values.avatarUrl !== null) {
            data.append('image', values.avatarUrl);
          } else {
            data.append('image', '');
          }
          data.append('id', currentUser?.id);
          data.append('user_name', values.cmsId);
          data.append('name', values.name);
          data.append('email', values.email);
          data.append('password', values.password);
          data.append('phoneNumber', values.phoneNumber);
          data.append('office', values.officeAddress);
          data.append('isActive', values.status);
          data.append('specialization', values.specialization);
          data.append('is_varified', values.isVerified);
          data.append('is_deleted', 0);
          data.append('role_id', roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '');
          data.append(
            'department_id',
            departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
          );
          axios.post('http://localhost:8080/Supervisor/updateSupervisor', data, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          });
          // axios.post('http://localhost:8080/Supervisor/updateSupervisor', {
          //   id: currentUser.id,
          //   user_name: values.cmsId,
          //   name: values.name,
          //   email: values.email,
          //   password: values.password,
          //   phoneNumber: values.phoneNumber,
          //   office: values.officeAddress,
          //   specialization: values.specialization,
          //   is_varified: values.isVerified,
          //   isActive: values.status,
          //   imgUrl: values.imgUrl,
          //   role_id: roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '',
          //   department_id: departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
          // });
          dispatch(getInstructorList());
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
          data.append('office', values.officeAddress);
          data.append('isActive', values.status);
          data.append('specialization', values.specialization);
          data.append('is_varified', values.isVerified);
          data.append('is_deleted', 0);
          console.log(roleList, '----', values.role);
          data.append('role_id', roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '');
          data.append(
            'department_id',
            departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
          );
          axios.post('http://localhost:8080/Supervisor/saveSupervisor', data, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          });
          // axios.post('http://localhost:8080/Supervisor/saveSupervisor', {
          //   user_name: values.cmsId,
          //   name: values.name,
          //   email: values.email,
          //   password: values.password,
          //   phoneNumber: values.phoneNumber,
          //   office: values.officeAddress,
          //   specialization: values.specialization,
          //   isActive: values.status,
          //   is_varified: values.isVerified,
          //   imgUrl: values.imgUrl,
          //   is_deleted: 0,
          //   role_id: roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '',
          //   department_id: departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
          // });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(
          user.role.role_name === 'Super Admin' || user.role.role_name === 'Coordinator'
            ? PATH_DASHBOARD.user.list
            : PATH_DASHBOARD.general.userProfile
        );
      } catch (error) {
        console.error(error);
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

  const getRoleListFiltered = () =>
    roleList.filter((role) => role.role_name !== 'Super Admin' && role.role_name !== 'Student');

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
                disabled={user.role.role_name === 'Supervisor'}
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
                      Apply disable User
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />

              <FormControlLabel
                disabled={user.role.role_name === 'Supervisor'}
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
                    disabled={user.role.role_name === 'Supervisor'}
                    select
                    fullWidth
                    label="Role"
                    placeholder="role"
                    {...getFieldProps('role')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  >
                    {getRoleListFiltered().map((row, index) => (
                      <option key={row.role_name}>{row.role_name}</option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    disabled={user.role.role_name === 'Supervisor'}
                    fullWidth
                    label="CMS ID"
                    {...getFieldProps('cmsId')}
                    error={Boolean(touched.cmsId && errors.cmsId)}
                    helperText={touched.cmsId && errors.cmsId}
                  />
                  <TextField
                    disabled={user.role.role_name === 'Supervisor'}
                    select
                    fullWidth
                    label="department"
                    placeholder="department"
                    {...getFieldProps('department')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.department && errors.department)}
                    helperText={touched.department && errors.department}
                  >
                    {departmentList.map((row, index) => (
                      <option key={row.department_name}>{row.department_name}</option>
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
                    fullWidth
                    label="Specialization"
                    {...getFieldProps('specialization')}
                    error={Boolean(touched.specialization && errors.specialization)}
                    helperText={touched.specialization && errors.specialization}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Office Address"
                    {...getFieldProps('officeAddress')}
                    error={Boolean(touched.officeAddress && errors.officeAddress)}
                    helperText={touched.officeAddress && errors.officeAddress}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Save' : 'Save Changes'}
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
