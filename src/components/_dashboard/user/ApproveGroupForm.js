import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getInstructorList } from '../../../redux/slices/instructor';
import { getDepartmentList } from '../../../redux/slices/department';
import { getRoleList } from '../../../redux/slices/role';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';

import axios from '../../../utils/axios';

import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

ApproveGroupForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function ApproveGroupForm({ isEdit, currentUser }) {
  console.log(currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { departmentList } = useSelector((state) => state.department);
  const { roleList } = useSelector((state) => state.role);
  const { userList } = useSelector((state) => state.instructor);
  const NewUserSchema = Yup.object().shape({
    member1: Yup.string().required('Member 1 is required'),
    member1cms: Yup.string().required('Member 1 CMS ID is required'),
    member2: Yup.string().required('Member 2 is required'),
    member2cms: Yup.string().required('Member 2 CMS ID is required'),
    member3: Yup.string().required('Member 3 required'),
    member3cms: Yup.string().required('Member 3 CMS ID is required'),
    supervisor: Yup.string().required('Please select a supervisor')
  });
  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(getRoleList());
    dispatch(getInstructorList());
  }, [dispatch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      member1: currentUser?.students[0]?.user.name || '' || '',
      member1cms: currentUser?.students[0]?.user_id || '' || '',
      member2: currentUser?.students[1]?.user.name || '',
      member2cms: currentUser?.students[1]?.user_id || '' || '',
      member3: currentUser?.students[2]?.user.name || '' || 'Not Available',
      member3cms: currentUser?.students[2]?.user_id || '' || 'Not Available',
      status: currentUser?.groupStatus || 1,
      supervisor: currentUser?.supervisor_id
        ? userList.find((user) => user.id === currentUser.supervisor_id)?.user.name
        : '' || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(
        'caluse',
        userList.find((user) => user.id === values.supervisor)
      );
      try {
        axios.post('http://localhost:8080/Group/addSupervisor', {
          id: currentUser.id,
          groupStatus: values.status,
          supervisor_id: userList.find((user) => user.user.name === values.supervisor)?.user.id || '' || ''
        });
        //   if (isEdit) {
        //     axios.post('http://localhost:8080/Supervisor/updateSupervisor', {
        //       id: currentUser.id,
        //       user_name: values.cmsId,
        //       name: values.name,
        //       email: values.email,
        //       password: values.password,
        //       phoneNumber: values.phoneNumber,
        //       office: values.officeAddress,
        //       specialization: values.specialization,
        //       is_varified: values.isVerified,
        //       isActive: values.status,
        //       imgUrl: values.imgUrl,
        //       role_id: roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '',
        //       department_id: departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
        //     });
        //   } else {
        //     axios.post('http://localhost:8080/Supervisor/saveSupervisor', {
        //       user_name: values.cmsId,
        //       name: values.name,
        //       email: values.email,
        //       password: values.password,
        //       phoneNumber: values.phoneNumber,
        //       office: values.officeAddress,
        //       specialization: values.specialization,
        //       isActive: values.status,
        //       is_varified: values.isVerified,
        //       imgUrl: values.imgUrl,
        //       is_deleted: 0,
        //       role_id: roleList ? roleList.find((rol) => rol.role_name === values.role)?.id || '' : '',
        //       department_id: departmentList?.find((dep) => dep.department_name === values.department)?.id || '' || ''
        //     });
        // }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.general.viewGroups);
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
                color={values.status !== 1 ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status === 1 ? 'approved' : 'rejected'}
              </Label>

              <FormControlLabel
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
                      Approval Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Approve or Reject Group
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
                    label="Member 1"
                    {...getFieldProps('member1')}
                    error={Boolean(touched.member1 && errors.member1)}
                    helperText={touched.member1 && errors.member1}
                  />
                  <TextField
                    fullWidth
                    label="Member 1 CMS ID"
                    {...getFieldProps('member1cms')}
                    error={Boolean(touched.member1cms && errors.member1cms)}
                    helperText={touched.member1cms && errors.member1cms}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Member 2"
                    {...getFieldProps('member2')}
                    error={Boolean(touched.member2 && errors.member2)}
                    helperText={touched.member2 && errors.member2}
                  />
                  <TextField
                    fullWidth
                    label="Member 2 CMS ID"
                    {...getFieldProps('member2cms')}
                    error={Boolean(touched.member2cms && errors.member2cms)}
                    helperText={touched.member2cms && errors.member2cms}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Member 3"
                    {...getFieldProps('member3')}
                    error={Boolean(touched.member3 && errors.member3)}
                    helperText={touched.member3 && errors.member3}
                  />
                  <TextField
                    fullWidth
                    label="Member 3 CMS ID"
                    {...getFieldProps('member3cms')}
                    error={Boolean(touched.member3cms && errors.member3cms)}
                    helperText={touched.member3cms && errors.member3cms}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Assign Supervisor"
                    placeholder="role"
                    {...getFieldProps('supervisor')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.supervisor && errors.supervisor)}
                    helperText={touched.supervisor && errors.supervisor}
                  >
                    {userList.map((row) => (
                      <option key={row.id}>{row.user.name}</option>
                    ))}
                  </TextField>
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Save Changes' : 'Save Changes'}
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
