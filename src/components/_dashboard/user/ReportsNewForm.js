import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import DatePicker from '@mui/lab/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from '../../../redux/store';
import useAuth from '../../../hooks/useAuth';
import { getReportTypeList } from '../../../redux/slices/reportType';
import { saveNotification } from '../../../redux/slices/announcement';
import { getBatchesList, getAllStudent } from '../../../redux/slices/batch';
import fakeRequest from '../../../utils/fakeRequest';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import { parseISO } from 'date-fns';
import { getAllRubricTypes } from '../../../pages/api';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

ReportNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object
};

export default function ReportNewForm({ isEdit, currentData }) {
  const { reportTypeList } = useSelector((state) => state.reportType);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { batchesList } = useSelector((state) => state.batch);
  const { studentList } = useSelector((state) => state.batch);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    reportType: Yup.string().required('Report Type is required'),
    batch: Yup.string().required('Batch is required'),
    deadLine: Yup.string().required('DeadLine is required'),
    points: Yup.number().required('Points are required')
  });

  useEffect(() => {
    dispatch(getReportTypeList());
    dispatch(getBatchesList());
    dispatch(getAllStudent());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: currentData?.title || '',
      description: currentData?.description || '',
      images: currentData?.images || [],
      reportType: currentData
        ? reportTypeList.find((report) => report.id === currentData.report_type_id).report_type
        : reportTypeList[0]?.report_type || '',
      batch: currentData
        ? batchesList.find((batch) => batch.id === currentData.batch_id).batch
        : batchesList[0]?.batch || '',
      deadLine: currentData?.deadLine || '',
      points: currentData?.total_points || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values);
      try {
        if (isEdit) {
          const date = new Date(values.deadLine);
          date.setHours(23, 59, 59, 999);
          const batchId = batchesList?.find((batch) => batch.batch === values.batch)?.id || '';
          await axios.post('http://localhost:8080/AssignedWork/updateAssignWork', {
            id: currentData.id,
            title: values.title,
            description: values.description,
            total_points: values.points,
            deadLine: date,
            report_type_id: reportTypeList.find((report) => report.report_type === values.reportType)?.id || '',
            batch_id: batchesList.find((batch) => batch.batch === values.batch)?.id || ''
          });
          const response = await axios.post('http://localhost:8080/Announcement/saveAnnouncement', {
            supervisor_id: user.id,
            title: String('Update in').concat(' ', values.title),
            description: String(values.description).concat(' ', `due Date ${date}`),
            batch_id: batchId,
            is_deleted: 0
          });
          console.log(studentList);
          const list = studentList.filter((stud) => stud.batch_id === batchId);
          list.map((stud) => dispatch(saveNotification(response.data.announcement.id, stud.id)));
        } else {
          const batchId = batchesList?.find((batch) => batch.batch === values.batch)?.id || '';
          const date = new Date(values.deadLine);
          date.setHours(23, 59, 59, 999);
          await axios.post('http://localhost:8080/AssignedWork/saveAssignedWork', {
            title: values.title,
            description: values.description,
            total_points: values.points,
            deadLine: date,
            report_type_id: reportTypeList.find((report) => report.report_type === values.reportType)?.id || '',
            batch_id: batchId
          });
          // create announcement
          const response = await axios.post('http://localhost:8080/Announcement/saveAnnouncement', {
            supervisor_id: user.id,
            title: values.title,
            description: String(values.description).concat(' ', `due Date ${date}`),
            batch_id: batchId,
            is_deleted: 0
          });
          console.log(studentList);
          const list = studentList.filter((stud) => stud.batch_id === batchId);
          list.map((stud) => dispatch(saveNotification(response.data.announcement.id, stud.id)));
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.general.reports);
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
      setFieldValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images.filter((_file) => _file !== file);
    setFieldValue('images', filteredItems);
  };
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Report Type Title"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />

                <div>
                  <LabelStyle>Description</LabelStyle>
                  <QuillEditor
                    simple
                    id="product-description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                {/* <FormControlLabel
                  control={<Switch {...getFieldProps('inStock')} checked={values.inStock} />}
                  label="In stock"
                  sx={{ mb: 2 }}
                /> */}

                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      label="Report Type"
                      native
                      {...getFieldProps('reportType')}
                      // SelectProps={{ native: true }}
                      error={Boolean(touched.reportType && errors.reportType)}
                      helperText={touched.reportType && errors.reportType}
                    >
                      {reportTypeList.map((reportType) => (
                        <option>{reportType.report_type}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Batch</InputLabel>
                    <Select
                      label="Batch"
                      native
                      {...getFieldProps('batch')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.batch && errors.batch)}
                      helperText={touched.batch && errors.batch}
                    >
                      {batchesList.map((row) => (
                        <option>{row.batch}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Deadline"
                      {...getFieldProps('deadLine')}
                      onChange={(newValue) => {
                        setFieldValue('deadLine', newValue);
                      }}
                      value={typeof values.deadLine === 'string' ? parseISO(values.deadLine) : values.deadLine}
                      renderInput={(params) => <TextField {...params} />}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.deadLine && errors.deadLine)}
                      helperText={touched.deadLine && errors.deadLine}
                    />
                  </LocalizationProvider>
                  <TextField
                    fullWidth
                    label="Total Points"
                    {...getFieldProps('points')}
                    error={Boolean(touched.points && errors.points)}
                    helperText={touched.points && errors.points}
                  />
                </Stack>
              </Card>

              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Report' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
