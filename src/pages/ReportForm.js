import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../routes/paths';
import { getAllRubricTypes, createReportType, updateReportType, getReportType } from './api';
import { useLocation, useNavigate, useParams } from 'react-router';

function ReportManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = location.pathname.includes('edit');

  const [rubrics, setRubrics] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch rubrics from the server
  useEffect(() => {
    const fetchRubrics = async () => {
      setLoading(true);
      try {
        const rubrics = await getAllRubricTypes();
        setRubrics(rubrics);
        setSuccess(true);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error('Failed to fetch rubrics:', error);
      }
    };
    fetchRubrics();
  }, []);

  const formik = useFormik({
    initialValues: {
      reportName: '',
      rubricTypes: []
    },
    validationSchema: Yup.object({
      reportName: Yup.string().required('Report name is required'),
      rubricTypes: Yup.array().min(1, 'At least one rubric type is required')
    }),
    onSubmit: (values) => {
      console.log('Submitting:', values);

      const data = {
        reportName: values.reportName,
        rubricIds: values.rubricTypes
      };

      if (isEdit) {
        // Update the report
        updateReportType(id, data).then((response) => {
          console.log('Report updated:', response);
          formik.resetForm();
          setSuccess(true);
          formik.setSubmitting(false);
          navigate(PATH_DASHBOARD.report.reportList);
        });
      } else {
        createReportType(data)
          .then((response) => {
            console.log('Report created:', response);
            formik.resetForm();
            setSuccess(true);
            formik.setSubmitting(false);
          })
          .catch((error) => {
            console.error('Failed to create report:', error);
          });
      }
    }
  });

  useEffect(() => {
    if (isEdit) {
      getReportType(id).then((report) => {
        formik.setValues({
          reportName: report.report_type,
          rubricTypes: report.rubric_types.map((rubric) => rubric.id)
        });
      });
    }
  }, []);

  if (loading) {
    <Typography variant="h4">Loading...</Typography>;
  }

  if (success && rubrics.length === 0) {
    <Typography variant="h4">No rubrics found</Typography>;
  }

  if (error) {
    <Typography variant="h4" color="red">
      {error.message}
    </Typography>;
  }

  return (
    <Page title="Report Management">
      <Container>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Committee"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Report List', href: PATH_DASHBOARD.report.reportList },
            {
              name: isEdit ? 'Edit Report' : 'Create Report'
            }
          ]}
        />

        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth sx={{ mt: 3 }}>
            <TextField
              id="reportName"
              name="reportName"
              label="Report Name"
              value={formik.values.reportName}
              onChange={formik.handleChange}
              error={formik.touched.reportName && Boolean(formik.errors.reportName)}
              helperText={formik.touched.reportName && formik.errors.reportName}
              variant="outlined"
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="rubric-select-label">Rubric Types</InputLabel>
            <Select
              labelId="rubric-select-label"
              id="rubricTypes"
              name="rubricTypes"
              multiple
              value={formik.values.rubricTypes}
              onChange={formik.handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Rubric Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={rubrics.find((rubric) => rubric.id === value)?.rubric_type || value} />
                  ))}
                </Box>
              )}
            >
              {rubrics.map((rubric) => (
                <MenuItem key={rubric.id} value={rubric.id}>
                  {rubric.rubric_type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.rubricTypes && formik.errors.rubricTypes && (
              <Box sx={{ mt: 2, ml: 2, color: 'error.main' }}>{formik.errors.rubricTypes}</Box>
            )}
          </FormControl>

          <Button disabled={formik.isSubmitting} type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            {!isEdit
              ? formik.isSubmitting
                ? 'Submitting...'
                : 'Submit'
              : formik.isSubmitting
              ? 'Updating...'
              : 'Update'}
          </Button>
        </form>
      </Container>
    </Page>
  );
}

export default ReportManagement;
