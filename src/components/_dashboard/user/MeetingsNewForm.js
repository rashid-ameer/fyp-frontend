import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material

import { useTheme, styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Select,
  TextField,
  FormHelperText,
  InputLabel,
  Typography,
  Checkbox,
  CardHeader,
  CardContent,
  Divider,
  FormControl,
  Box
} from '@mui/material';

// utils
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import DatePicker from '@mui/lab/DatePicker';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Label from '../../Label';
import { useDispatch, useSelector } from '../../../redux/store';
import useAuth from '../../../hooks/useAuth';
import { getReportTypeList } from '../../../redux/slices/reportType';
import { saveNotification } from '../../../redux/slices/announcement';
import { getBatchesList, getAllStudent } from '../../../redux/slices/batch';
import { assignMeetingWork } from '../../../redux/slices/meetingAssignedWork';
import fakeRequest from '../../../utils/fakeRequest';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import { groups } from 'd3-array';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

MeetingsNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object
};

export default function MeetingsNewForm({ isEdit, group }) {
  console.log(group);
  const theme = useTheme();
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
    // images: Yup.array().min(1, 'Images is required'),
    deadLine: Yup.string().required('deadLine is required')
  });
  const markAttendance = async (studentId, meetingId, mark, batchId) => {
    axios.post('http://localhost:8080/Attendance/saveAttendance', {
      student_id: studentId,
      meeting_id: meetingId,
      attendance: mark
    });
    if (mark === 0) {
      const response = await axios.post('http://localhost:8080/Announcement/saveAnnouncement', {
        supervisor_id: user.id,
        title: 'You are Marked Absent',
        description: String('you were marked absent on date').concat(' ', String(new Date())),
        batch_id: batchId,
        is_deleted: 0
      });
      console.log('response of data ', response.data);
      dispatch(saveNotification(response.data.announcement.id, studentId));
    }
  };
  useEffect(() => {
    dispatch(getReportTypeList());
    dispatch(getBatchesList());
    dispatch(getAllStudent());
  }, [dispatch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      description: '',
      deadLine: '',
      member1: 0,
      member2: 0,
      member3: 0,
      member1Work: '',
      member2Work: '',
      member3Work: ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        //   const batchId = batchesList?.find((batch) => batch.batch === values.batch)?.id || '';
        const date = new Date(values.deadLine);
        date.setHours(23, 59, 59, 999);
        const responseMeeting = await axios.post('http://localhost:8080/Meeting/saveMeeting', {
          supervisor_id: user.id,
          group_id: group?.id,
          title: values.title,
          description: values.description,
          date
        });
        const response = await axios.post('http://localhost:8080/Announcement/saveAnnouncement', {
          supervisor_id: user.id,
          title: values.title,
          description: String(values.description).concat(' ', `due Date ${date}`),
          batch_id: group?.students[0].batch_id,
          is_deleted: 0
        });
        dispatch(saveNotification(response.data.announcement.id, group?.students[0]?.id));
        dispatch(saveNotification(response.data.announcement.id, group?.students[1]?.id));
        if (group?.students?.length === 3) {
          dispatch(saveNotification(response.data.announcement.id, group?.students[2]?.id));
        }

        const details = [
          {
            student_id: group?.students[0]?.id,
            action_work: values.member1Work
          },
          {
            student_id: group?.students[1]?.id,
            action_work: values.member2Work
          }
        ];

        if (group?.students?.length === 3) {
          details.push({
            student_id: group?.students[2]?.id,
            action_work: values.member3Work
          });
        }

        dispatch(
          assignMeetingWork({
            meeting_id: responseMeeting.data.id,
            details
          })
        );

        markAttendance(group?.students[0]?.id, responseMeeting.data.id, values.member1, group?.students[0].batch_id);
        markAttendance(group?.students[1]?.id, responseMeeting.data.id, values.member2, group?.students[1].batch_id);
        if (group?.students?.length === 3) {
          markAttendance(group?.students[2]?.id, responseMeeting.data.id, values.member3, group?.students[2].batch_id);
        }

        // list.map((stud) => dispatch(saveNotification(response.data.announcement.id, stud.id)));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(`${PATH_DASHBOARD.app.root}/${String(group?.id)}/meeting-list`);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  console.log('group', group);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Divider />
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Agenda"
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

            <Card>
              <CardHeader title="Assign Work to Students" />
              <CardContent>
                <Stack spacing={3}>
                  <Box key={group?.students?.[0]?.id}>
                    <Typography variant="subtitle1">{group?.students?.[0]?.user?.name}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      {...getFieldProps('member1Work')}
                      error={Boolean(touched.member1Work && errors.member1Work)}
                      helperText={touched.member1Work && errors.member1Work}
                    />
                  </Box>

                  <Box key={group?.students?.[1]?.id}>
                    <Typography variant="subtitle1">{group?.students?.[1]?.user?.name}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      {...getFieldProps('member2Work')}
                      error={Boolean(touched.member2Work && errors.member2Work)}
                      helperText={touched.member2Work && errors.member2Work}
                    />
                  </Box>

                  {group?.students?.length === 3 && (
                    <Box key={group?.students?.[2]?.id}>
                      <Typography variant="subtitle1">{group?.students?.[2]?.user?.name}</Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        {...getFieldProps('member3Work')}
                        error={Boolean(touched.member3Work && errors.member3Work)}
                        helperText={touched.member3Work && errors.member3Work}
                      />
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              style={{ display: 'block', marginLeft: 'auto', marginTop: '1rem' }}
            >
              {!isEdit ? 'Create Meeting' : 'Save Changes'}
            </LoadingButton>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ mb: 1 }}>
                <CardHeader title="Deadline" />
                <Divider />
                <CardContent>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Date"
                      {...getFieldProps('deadLine')}
                      onChange={(newValue) => {
                        setFieldValue('deadLine', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.deadLine && errors.deadLine)}
                      helperText={touched.deadLine && errors.deadLine}
                    />
                  </LocalizationProvider>
                </CardContent>
              </Card>
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Attendance" />

                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Name
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant="subtitle2">Mark</Label>
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {group?.students ? group.students[0].user.name || 'Not Available' : 'Not Available'}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row.project_title)} /> */}
                        <Checkbox onChange={(event) => setFieldValue('member1', values.member1 === 0 ? 1 : 0)} />
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {group?.students ? group.students[1].user.name || 'Not Available' : 'Not Available'}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        <Checkbox onChange={(event) => setFieldValue('member2', values.member2 === 0 ? 1 : 0)} />
                      </Typography>
                    </Stack>
                    {group?.students?.length === 3 ? (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle2">
                          {group?.students ? group.students[2]?.user.name || 'Not Available' : 'Not Available'}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          <Checkbox
                            disabled={group?.students?.length !== 3}
                            onChange={(event) => setFieldValue('member3', values.member3 === 0 ? 1 : 0)}
                          />
                        </Typography>
                      </Stack>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
