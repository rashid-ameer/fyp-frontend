import React, { useEffect, useState } from 'react';
import { Typography, TextField, Switch, FormControlLabel, Button, Box, Card, CardContent } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import useAuth from '../hooks/useAuth';
import { getStudentList } from '../redux/slices/student';
import { useDispatch, useSelector } from 'react-redux';
import { getIdeaDetails, submitProjectIdea, updateIdea } from './api';
import { PATH_DASHBOARD } from '../routes/paths';
import { Link } from 'react-router-dom';

function ProjectIdeaSubmissionForm() {
  const dispatch = useDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { user } = useAuth();
  const { studentList, isLoading: isGettingStudents } = useSelector((state) => state.student);
  const [ideaDetails, setIdeaDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(getStudentList());
  }, [dispatch]);

  useEffect(() => {
    if (studentList) {
      setUserData(studentList.find((student) => student.user_id === user.user_name));
    }
  }, [studentList]);

  useEffect(() => {
    if (userData) {
      getIdeaDetails({ group_id: userData.group_id }).then((data) => {
        setIdeaDetails(data);
        if (data) {
          formik.setValues({
            projectTitle: data.title,
            projectDescription: data.description,
            isOpenToAll: data.isOpenToAll
          });
          setEdit(true);
        }
      });
    }
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      projectTitle: '',
      projectDescription: '',
      isOpenToAll: 0
    },
    validationSchema: Yup.object({
      projectTitle: Yup.string().required('Project title is required'),
      projectDescription: Yup.string().required('Project description is required')
    }),
    onSubmit: (values) => {
      const projectData = {
        title: values.projectTitle,
        description: values.projectDescription,
        isOpenToAll: values.isOpenToAll,
        group_id: userData.group_id
      };
      console.log(projectData); // Or send data to your API
      if (ideaDetails?.id) {
        projectData.id = ideaDetails.id;
        updateIdea(projectData).finally(() => {
          formik.setSubmitting(false);
          setIsFormSubmitted(true);
        });
      } else {
        submitProjectIdea(projectData).finally(() => {
          formik.setSubmitting(false);
          setIsFormSubmitted(true);
        });
      }
    }
  });

  if (!isGettingStudents && !userData) {
    return <Typography variant="h5">You are required to first create group</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Submit Your Project Idea
          </Typography>
          {ideaDetails?.id && !ideaDetails.supervisor_id && (
            <Link
              style={{ textDecoration: 'none' }}
              color="primary"
              to={`${PATH_DASHBOARD.idea.root}/supervision-requests/${ideaDetails?.id}`}
            >
              Requests
            </Link>
          )}
        </div>
        <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Project Title"
            name="projectTitle"
            value={formik.values.projectTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.projectTitle && Boolean(formik.errors.projectTitle)}
            helperText={formik.touched.projectTitle && formik.errors.projectTitle}
            margin="normal"
            disabled={edit}
          />
          <TextField
            fullWidth
            label="Project Description"
            name="projectDescription"
            multiline
            rows={4}
            value={formik.values.projectDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.projectDescription && Boolean(formik.errors.projectDescription)}
            helperText={formik.touched.projectDescription && formik.errors.projectDescription}
            margin="normal"
            disabled={edit}
          />
          <FormControlLabel
            control={
              <Switch
                disabled={edit}
                name="isOpenToAll"
                checked={Boolean(formik.values.isOpenToAll)}
                onChange={() => formik.setFieldValue('isOpenToAll', formik.values.isOpenToAll ? 0 : 1)}
                color="primary"
              />
            }
            label="Open to all supervisors"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setEdit(false)}
              sx={{ display: ideaDetails?.id ? 'block' : 'none' }}
            >
              Edit
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {ideaDetails?.id
                ? formik.isSubmitting
                  ? 'Updating'
                  : 'Update'
                : formik.isSubmitting
                ? 'Submitting'
                : 'Submit'}
            </Button>
          </div>

          {isFormSubmitted && (
            <Typography variant="body2" color="textSecondary" align="center" style={{ color: 'green' }}>
              Your form has been submitted!
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProjectIdeaSubmissionForm;
