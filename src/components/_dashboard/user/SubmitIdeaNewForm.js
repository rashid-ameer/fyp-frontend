import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel
} from '@mui/material';
// utils
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// routes
import axios from '../../../utils/axios';
import fakeRequest from '../../../utils/fakeRequest';
import useAuth from '../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../redux/store';
import { SaveGroup, updateMembers } from '../../../redux/slices/group';
import { getStudentList } from '../../../redux/slices/student';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

SubmitIdeaNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function SubmitIdeaNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { studentList } = useSelector((state) => state.student);
  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    memberOne: Yup.string().required('CMS ID is required'),
    memberTwo: Yup.string().required('CMS ID is required')
    // memberThree: Yup.string().required('Member 3 is required')
  });
  const checkMember = (member) => {
    const s = studentList?.find((student) => student.user_id === member) || null;
    const res = s?.user_id === member || false;
    let result = 0;
    if (res === true) {
      if (s.group_id === null) {
        result = 1;
      } else {
        result = 2;
      }
    } else {
      result = 0;
    }
    console.log(result);
    return result;
  };
  useEffect(() => {
    dispatch(getStudentList());
  }, [dispatch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: currentUser?.name || '',
      memberOne: user.role.role_name === 'Student' ? user.user_name : '',
      memberTwo: currentUser?.memberTwo || '',
      memberThree: currentUser?.memberThree || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let result = checkMember(values.memberOne.trim());
        if (result === 0) {
          alert(String(values.memberOne).concat(' ', 'is not registered!'));
          throw NewProductSchema.fields.memberOne;
        } else if (result === 2) {
          alert(String(values.memberOne).concat(' ', 'is already in group!'));
          throw NewProductSchema.fields.memberOne;
        }
        result = checkMember(values.memberTwo);
        if (result === 0) {
          alert(String(values.memberTwo).concat(' ', 'is not registered!'));
          throw NewProductSchema.fields.memberOne;
        } else if (result === 2) {
          alert(String(values.memberTwo).concat(' ', 'is already in group!'));
          throw NewProductSchema.fields.memberOne;
        } else if (values.memberOne === values.memberTwo) {
          alert(String(values.memberOne).concat(' and ', values.memberTwo.concat(' ', 'are same')));
          throw NewProductSchema.fields.memberOne;
        }
        result = checkMember(values.memberThree.trim());
        if (values.memberThree.trim() !== '') {
          if (result === 0) {
            alert(String(values.memberThree).concat(' ', 'is not registered!'));
            throw NewProductSchema.fields.memberOne;
          } else if (result === 2) {
            alert(String(values.memberThree).concat(' ', 'is not registered!'));
            throw NewProductSchema.fields.memberOne;
          } else if (values.memberTwo === values.memberThree) {
            alert(String(values.memberTwo).concat(' and ', values.memberThree.concat(' ', 'are same')));
            throw NewProductSchema.fields.memberOne;
          } else if (values.memberOne === values.memberThree) {
            alert(String(values.memberOne).concat(' and ', values.memberThree.concat(' ', 'are same')));
            throw NewProductSchema.fields.memberOne;
          }
        }

        const response = await axios.post('http://localhost:8080/Group/saveGroup', {
          project_title: values.title,
          groupStatus: 2,
          is_deleted: 0
        });

        await dispatch(updateMembers(values.memberOne, response.data.id));
        await dispatch(updateMembers(values.memberTwo, response.data.id));
        if (values.memberThree !== '') {
          await dispatch(updateMembers(values.memberThree, response.data.id));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={4}>
                <TextField
                  fullWidth
                  label="Project-Title"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
                <TextField
                  fullWidth
                  label="CMS ID"
                  {...getFieldProps('memberOne')}
                  disabled={user.role.role_name === 'Student'}
                  error={Boolean(touched.memberOne && errors.memberOne)}
                  helperText={touched.memberOne && errors.memberOne}
                />
                <TextField
                  fullWidth
                  label="CMS ID"
                  {...getFieldProps('memberTwo')}
                  error={Boolean(touched.memberTwo && errors.memberTwo)}
                  helperText={touched.memberTwo && errors.memberTwo}
                />
                <TextField
                  fullWidth
                  label="CMS ID"
                  {...getFieldProps('memberThree')}
                  // error={Boolean(touched.memberThree && errors.memberThree)}
                  // helperText={touched.memberThree && errors.memberThree}
                />
                <div>
                  <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                    {!isEdit ? 'Submit' : 'Save Changes'}
                  </LoadingButton>
                </div>
              </Stack>
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Supervisor</InputLabel>
                    <Select label="Supervisor" native {...getFieldProps('category')} value={values.category}>
                      {userList.map((user) => (
                        <option key={user.user.id} value={user.user.name}>
                          {user.user.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <div>
                    <LabelStyle>Add Files</LabelStyle>
                    <UploadMultiFile
                      showPreview
                      maxSize={3145728}
                      accept="image/*"
                      files={values.images}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      error={Boolean(touched.images && errors.images)}
                    />
                  </div>
                </Stack>
              </Card>
              
            </Stack>
          </Grid> */}
        </Grid>
      </Form>
    </FormikProvider>
  );
}
