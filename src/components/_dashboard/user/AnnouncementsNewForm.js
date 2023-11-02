import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
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
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

import axios from '../../../utils/axios';
import useAuth from '../../../hooks/useAuth';
import { useDispatch, useSelector } from '../../../redux/store';
import { getBatchesList, getStudentByBatch, getAllStudent } from '../../../redux/slices/batch';
import { saveNotification } from '../../../redux/slices/announcement';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

AnnouncementsNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function AnnouncementsNewForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { batchesList } = useSelector((state) => state.batch);
  const { studentList } = useSelector((state) => state.batch);
  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    description: Yup.string().required('Description is required')
  });
  useEffect(() => {
    dispatch(getBatchesList());
    dispatch(getAllStudent());
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      batch: currentProduct?.batch || 'All',
      images: currentProduct?.images || []
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(user.user_name, values);
      try {
        // if (isEdit) {
        //   await axios.post('http://localhost:8080/Announcement/saveAnnouncement', {
        //     supervisor_id: user.id,
        //     title: values.title,
        //     description: values.description,
        //     batch_id: batchesList?.find((batch) => batch.batch === values.batch)?.id || '',
        //     is_deleted: 0
        //   });
        // } else {
        const response = await axios.post('http://localhost:8080/Announcement/saveAnnouncement', {
          supervisor_id: user.id,
          title: values.title,
          description: values.description,
          batch_id:
            values.batch === 'All' ? null : batchesList?.find((batch) => batch.batch === values.batch)?.id || '',
          is_deleted: 0
        });
        console.log(studentList);
        studentList.map((stud) => dispatch(saveNotification(response.data.announcement.id, stud.id)));
        // }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.app.announcements);
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

  const batchSelectHandler = (e) => {
    if (e.target.value === 'All') {
      dispatch(getAllStudent());
    } else {
      dispatch(getStudentByBatch(batchesList?.find((batch) => batch.batch === e.target.value)?.id || ''));
    }
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
                  label="Annoucement Title"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />

                <div>
                  <LabelStyle>Description</LabelStyle>
                  <QuillEditor
                    simple
                    id="description"
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
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Batch</InputLabel>
                    <Select
                      label="Batch"
                      native
                      {...getFieldProps('batch')}
                      onChange={(event) => {
                        setFieldValue('batch', event.target.value);
                        batchSelectHandler(event);
                      }}
                    >
                      <option>All</option>
                      {batchesList.map((batch) => (
                        <option key={batch.id} value={batch.batch}>
                          {batch.batch}
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
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Annoucement' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
