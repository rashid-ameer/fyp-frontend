import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { formatDistanceToNow, formatDistance } from 'date-fns';
// material
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Card, Grid, Stack, Button, Divider, CardContent, CardHeader, Typography, FormHelperText } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import download from 'downloadjs';
import Label from '../../Label';
// utils
// routes

import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { UploadMultiFile } from '../../upload';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

SubmitReportsNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function SubmitReportsNewForm({ isEdit, currentProduct, msg, reportData, batch, group, callDispatch }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewProductSchema = Yup.object().shape({
    files: Yup.array().min(1, 'Files are required')
  });

  console.log('reportData', reportData);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      files: currentProduct?.files || []
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values.files[0]);
      const formdata = new FormData();
      let response;
      try {
        if (reportData.assigned_work.group_submitted_file === null) {
          response = await axios.post('http://localhost:8080/saveGroupFiles/saveGroupSubmission', {
            group_id: group.id,
            assigned_work_id: reportData.assigned_work.id,
            submission_date_time: String(new Date())
          });
          console.log(response);
          values.files.map((file) => {
            formdata.append('file', file);
            formdata.append('group_submitted_files_id', response.data.id);
            return axios.post('http://localhost:8080/File/saveFiles', formdata);
          });
        } else {
          axios.post('http://localhost:8080/saveGroupFiles/updateGroupSubmission', {
            id: reportData.assigned_work.group_submitted_file.id,
            submission_date_time: String(new Date())
          });
          console.log(values.files);
          values.files.map((file) => {
            formdata.append('file', file);
            formdata.append('group_submitted_files_id', reportData.assigned_work.group_submitted_file.id);
            return axios.post('http://localhost:8080/File/updateFiles', formdata);
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(reportData.assigned_work.group_submitted_file === null ? 'Create success' : 'Update success', {
          variant: 'success'
        });
        callDispatch();
        navigate(PATH_DASHBOARD.eCommerce.list);
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
        'files',
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
    setFieldValue('files', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.files.filter((_file) => _file !== file);
    setFieldValue('files', filteredItems);
  };

  const getColor = () => {
    let color = '';
    if (reportData.assigned_work !== null) {
      if (reportData.assigned_work.group_submitted_file !== null) {
        if (
          new Date(reportData.assigned_work.deadLine) >
          new Date(reportData.assigned_work.group_submitted_file.submission_date_time)
        ) {
          color = 'success';
        } else {
          color = 'error';
        }
      } else {
        const date = new Date(reportData.assigned_work.deadLine);
        if (new Date(reportData.assigned_work.deadLine) < new Date()) {
          color = 'error';
        } else {
          color = 'warning';
        }
      }
    } else {
      color = 'warning';
    }
    return color;
  };
  const getDisabledStatus = () => {
    let result;
    if (reportData.assigned_work === null) {
      result = true;
    } else if (group.groupStatus !== 1) {
      result = true;
    } else {
      result = false;
    }

    return result;
  };

  const getStatus = () => {
    let result = '';
    if (reportData.assigned_work !== null) {
      if (reportData.assigned_work.group_submitted_file !== null) {
        if (
          new Date(reportData.assigned_work.deadLine) >
          new Date(reportData.assigned_work.group_submitted_file.submission_date_time)
        ) {
          result = String('submitted ').concat(
            String(
              formatDistance(
                new Date(reportData.assigned_work.deadLine),
                new Date(reportData.assigned_work.group_submitted_file.submission_date_time)
              )
            ),
            ' before'
          );
        } else {
          result = String('submitted ').concat(
            String(
              formatDistance(
                new Date(reportData.assigned_work.deadLine),
                new Date(reportData.assigned_work.group_submitted_file.submission_date_time)
              )
            ),
            ' late'
          );
        }
      } else {
        const date = new Date(reportData.assigned_work.deadLine);
        if (new Date(reportData.assigned_work.deadLine) < new Date()) {
          result = String(formatDistanceToNow(new Date(reportData.assigned_work.deadLine))).concat(' ', 'late');
        } else {
          result = String(formatDistanceToNow(new Date(reportData.assigned_work.deadLine))).concat(' ', 'Remaining');
        }
      }
    } else {
      result = 'Not Posted yet.';
    }
    return result;
  };
  const getDate = (date) => {
    const newDate = new Date(date);
    return String(newDate.toLocaleString('en-US'));
  };
  const downloadFile = async (files) => {
    const method = 'GET';
    const url = `http://localhost:8080/File/download/${files[0].file_name}`;
    axios
      .request({
        url,
        method,
        responseType: 'blob'
      })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', files[0].file_name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  const getGroupColor = () => {
    let result;
    console.log(group);
    if (group !== null) {
      if (group.groupStatus === 0) {
        result = 'error';
      } else if (group.groupStatus === 1) {
        result = 'success';
      } else {
        result = 'warning';
      }
    } else {
      result = 'error';
    }
    return result;
  };
  const getGroupStatus = () => {
    let result;
    console.log(group);
    if (group !== null) {
      if (group.groupStatus === 0) {
        result = 'Rejected';
      } else if (group.groupStatus === 1) {
        result = 'Approved';
      } else {
        result = 'in Progress';
      }
    } else {
      result = 'Not created yet';
    }
    return result;
  };
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <LabelStyle>
                  <b>{reportData.assigned_work?.title}</b>
                  <div
                    dangerouslySetInnerHTML={{ __html: reportData.assigned_work?.description || 'Not Posted Yet' }}
                  />
                </LabelStyle>
                <div>
                  <LabelStyle>Add Files</LabelStyle>
                  <UploadMultiFile
                    // disabled={getDisabledStatus()}
                    showPreview={false}
                    files={values.files}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    onUpload={handleSubmit}
                    error={Boolean(touched.files && errors.files)}
                  />
                  {touched.files && errors.files && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.files && errors.files}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
            {reportData.assigned_work?.group_submitted_file ? (
              <Card sx={{ p: 3, mt: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row">
                    <Button
                      sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
                      onClick={() => downloadFile(reportData.assigned_work?.group_submitted_file.files)}
                    >
                      <Assignment /> {reportData.assigned_work?.group_submitted_file.files[0].file_name}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            ) : null}
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ mb: 3 }}>
                <CardHeader title={group?.project_title || 'Not Available'} />

                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Group Status:
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={getGroupColor()}>
                          {getGroupStatus()}
                        </Label>
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Member 1:
                      </Typography>
                      <Typography variant="subtitle2">
                        {group?.students ? group.students[0].user.name || 'Not Available' : 'Not Available'}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Member 2:
                      </Typography>
                      <Typography variant="subtitle2">
                        {group?.students ? group.students[1].user.name || 'Not Available' : 'Not Available'}
                      </Typography>
                    </Stack>
                    {group?.students?.length === 3 ? (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Member 3:
                        </Typography>
                        <Typography variant="subtitle2">
                          {group?.students ? group.students[2]?.user.name || 'Not Available' : 'Not Available'}
                        </Typography>
                      </Stack>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardHeader title={`${reportData.report_type} Document`} />

                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Status:
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={getColor()}>
                          {getStatus()}
                        </Label>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Posted on:
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                          {reportData.assigned_work ? getDate(reportData.assigned_work.createdAt) : 'Not Available'}
                        </Label>
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Due Date:
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                          {reportData.assigned_work ? getDate(reportData.assigned_work.deadLine) : 'Not Available'}
                        </Label>
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Submitted on:
                      </Typography>
                      <Typography variant="subtitle2">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={reportData.assigned_work?.group_submitted_file ? 'success' : 'error'}
                        >
                          {reportData.assigned_work?.group_submitted_file
                            ? getDate(reportData.assigned_work?.group_submitted_file?.submission_date_time)
                            : 'Not Submitted yet'}
                        </Label>
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              {/* <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <LabelStyle>Group Info:</LabelStyle>
                    <LabelStyle>Project title: {group?.project_title || 'Not Available'}</LabelStyle>
                    <LabelStyle>
                      Member 1: {group?.students ? group.students[0].user.name || 'Not Available' : 'Not Available'}
                    </LabelStyle>
                    <LabelStyle>
                      Member 2: {group?.students ? group.students[1].user.name || 'Not Available' : 'Not Available'}
                    </LabelStyle>
                    <LabelStyle>
                      Member 3: {group?.students ? group.students[2]?.user.name || 'Not Available' : 'Not Available'}
                    </LabelStyle>
                  </FormControl>
                </Stack>
              </Card> */}
              {/* <Card sx={{ mt: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <LabelStyle>
                      Status:
                      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={getColor()}>
                        {getStatus()}
                      </Label>
                    </LabelStyle>
                    <LabelStyle>
                      Report Type:
                      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                        {reportData.report_type} Document
                      </Label>
                    </LabelStyle>
                    <LabelStyle>Batch: {batch}</LabelStyle>
                    <LabelStyle>
                      Posted on:
                      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}>
                        {reportData.assigned_work ? getDate(reportData.assigned_work.createdAt) : 'Not Available'}
                      </Label>
                    </LabelStyle>
                    <LabelStyle>
                      Submitted on:
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={reportData.assigned_work?.group_submitted_file ? 'success' : 'error'}
                      >
                        {reportData.assigned_work?.group_submitted_file
                          ? getDate(reportData.assigned_work?.group_submitted_file?.submission_date_time)
                          : 'Not Submitted yet'}
                      </Label>
                    </LabelStyle>
                  </FormControl>
                </Stack>
              </Card> */}
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
