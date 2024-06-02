import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, useFormik, FormikProvider } from 'formik';
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
import { useLocation, useNavigate, useParams } from 'react-router';
import { getRubricTypeRubrics, addReportMarking } from './api';
import useAuth from '../hooks/useAuth';
import { getGroup } from '../redux/slices/group';
import { useSelector, useDispatch } from 'react-redux';
import { comment } from 'stylis';

function EvaluationFormWrapper() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { group } = useSelector((state) => state.group);
  const { groupId, rubricTypeId } = useParams();
  const location = useLocation();
  const { reports, isEvaluated, rubricType } = location.state;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  console.log(reports, isEvaluated, rubricType);

  const validationSchema = Yup.object().shape({
    rubrics: Yup.array().of(Yup.number().required('Please select a rubric')),
    comments: Yup.string()
  });

  const initialValues = {
    rubrics: [],
    comments: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      const data = {
        rubric_details_id: values.rubrics,
        comments: values.comments,
        group_id: groupId,
        batch_id: group.students[0].batch_id,
        reports,
        rubric_type_id: rubricTypeId
      };
      try {
        addReportMarking(data).then((response) => {
          console.log(response);
          navigate(`${PATH_DASHBOARD.evaluation.evaluationTimeline}/${groupId}`, {
            state: { batchId: group.students[0].batch_id }
          });
        });
        setSubmitting(false);
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error appropriately, such as displaying an error message to the user
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const fetchRubrics = async () => {
      setLoading(true);
      try {
        const response = await getRubricTypeRubrics(rubricTypeId);
        setData(response);
        formik.setValues({
          rubrics: response.rubrics.map(() => ''),
          comments: ''
        });
      } catch (error) {
        console.error('Error fetching rubrics:', error);
        // Handle error appropriately, such as displaying an error message to the user
      } finally {
        setLoading(false);
      }
    };
    fetchRubrics();
  }, []);

  useEffect(() => {
    dispatch(getGroup(groupId));
  }, []);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.id) {
    return <div>No rubrics found</div>;
  }

  return (
    <Page title="Rubric Evaluation">
      <Container maxWidth="md">
        <HeaderBreadcrumbs
          heading={rubricType}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation Timeline', href: `${PATH_DASHBOARD.evaluation.evaluationTimeline}/${groupId}` },
            { name: 'Evaluation' }
          ]}
        />

        <Paper sx={{ p: 3, mt: 3 }}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              {data?.rubrics?.map((rubric, index) => (
                <FormControl key={rubric.id} component="fieldset" fullWidth margin="normal">
                  <FormLabel
                    component="legend"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <span>{`PLO: ${rubric.PLO.title}`}</span>
                    <span>{`Criteria: ${rubric.criteria}`}</span>
                  </FormLabel>
                  <Field
                    as={RadioGroup}
                    name={`rubrics[${index}]`}
                    onChange={(e) => setFieldValue(`rubrics[${index}]`, parseInt(e.target.value, 10))}
                  >
                    {rubric.rubric_details.map((rubric_detail, index) => (
                      <FormControlLabel
                        key={rubric_detail.id}
                        value={rubric_detail.id}
                        control={<Radio />}
                        label={`${rubric_detail.details} (${rubric_detail.points} points)`}
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
          </FormikProvider>
        </Paper>
      </Container>
    </Page>
  );
}

export default EvaluationFormWrapper;
