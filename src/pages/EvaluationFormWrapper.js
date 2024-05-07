import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import Page from '../components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../routes/paths';
import { useLocation, useParams } from 'react-router';
import { getRubricTypeRubrics } from './api';

function EvaluationFormWrapper() {
  const { groupId, rubricTypeId } = useParams();
  const location = useLocation();
  const { reports, isEvaluated, rubricType } = location.state;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await getRubricTypeRubrics(rubricTypeId);
        setData(response);
      } catch (error) {
        console.error('Error fetching rubrics:', error);
        // Handle error appropriately, such as displaying an error message to the user
      }
    };
    fetchRubrics();
  }, [rubricType]);

  const validationSchema = Yup.object().shape({
    rubrics: Yup.array().of(
      Yup.number().required('A score is required').min(1, 'Minimum score is 1').max(5, 'Maximum score is 5')
    ),
    comments: Yup.string()
  });

  const initialValues = {
    rubrics: Array(data.rubrics.length).fill(''),
    comments: ''
  };

  const handleSubmit = async (values, actions) => {
    try {
      // Here you can send the form data to your backend API for processing
      console.log('Form values:', values);
      // Example: await submitForm(values);
      actions.setSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately, such as displaying an error message to the user
      actions.setSubmitting(false);
    }
  };

  return (
    <Page title="Rubric Evaluation">
      <Container maxWidth="md">
        <HeaderBreadcrumbs
          heading={rubricType}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation Timeline', href: PATH_DASHBOARD.evaluation.evaluationTimeline },
            { name: 'Evaluation' }
          ]}
        />

        <Paper sx={{ p: 3, mt: 3 }}>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                {data.rubrics.map((rubric, index) => (
                  <FormControl key={rubric.id} component="fieldset" fullWidth margin="normal">
                    <FormLabel
                      component="legend"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                    >
                      <span>{`PLO: ${rubric.PLO.title}`}</span>
                      <span>{`Criteria: ${rubric.criteria}`}</span>
                    </FormLabel>
                    <Field
                      as={RadioGroup}
                      name={`rubrics[${index}]`}
                      onChange={(e) => setFieldValue(`rubrics[${index}]`, parseInt(e.target.value, 10))}
                    >
                      {rubric.rubric_detials.map((rubric_detail, index) => (
                        <FormControlLabel
                          key={rubric_detail.id}
                          value={rubric_detail.id}
                          control={<Radio />}
                          label={`${rubric_detail.details} (${rubric_detail.points})`}
                        />
                      ))}
                    </Field>
                    <Typography variant="body2" color="error">
                      <ErrorMessage name={`rubrics[${index}]`} />
                    </Typography>
                  </FormControl>
                ))}
                <Field
                  name="comments"
                  as={TextField}
                  label="Comments"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                />
                <Box mt={2}>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Page>
  );
}

export default EvaluationFormWrapper;
