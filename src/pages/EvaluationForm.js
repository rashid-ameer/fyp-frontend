import React, { useState } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Snackbar,
  Stack,
  Alert
} from '@mui/material';
import { addReportMarking, updateMarking } from './api';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';

function EvaluationForm({ criteriaData, groupId, edit, rubricTypeId }) {
  const [selectedPerformances, setSelectedPerformances] = useState(criteriaData.rubrics.map(() => ''));
  const [currentCriteriaIndex, setCurrentCriteriaIndex] = useState(0);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const navigate = useNavigate();

  const currentCriteria = criteriaData.rubrics[currentCriteriaIndex];
  const progress = ((currentCriteriaIndex + 1) / criteriaData.rubrics.length) * 100;

  const handlePerformanceChange = (event) => {
    const newSelectedPerformances = [...selectedPerformances];
    newSelectedPerformances[currentCriteriaIndex] = event.target.value;
    setSelectedPerformances(newSelectedPerformances);
  };

  console.log(criteriaData);

  const handleNext = async () => {
    if (selectedPerformances[currentCriteriaIndex] !== '') {
      if (currentCriteriaIndex < criteriaData.rubrics.length - 1) {
        setCurrentCriteriaIndex(currentCriteriaIndex + 1);
      } else {
        const data = { groupId, rubric_details_ids: selectedPerformances };

        if (edit) {
          data.rubric_type_id = rubricTypeId;
          await updateMarking(data);
          setSnackbarInfo({
            open: true,
            severity: 'success',
            message: 'Abstract Evaluation updated successfully!'
          });
        } else {
          await addReportMarking(data);
          setSnackbarInfo({
            open: true,
            severity: 'success',
            message: 'Abstract Evaluation completed successfully!'
          });
        }
        navigate(PATH_DASHBOARD.general.appPage);
      }
    }
  };

  const handleBack = () => {
    if (currentCriteriaIndex > 0) {
      setCurrentCriteriaIndex(currentCriteriaIndex - 1);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  return (
    <Card variant="outlined" sx={{ minWidth: 300, marginTop: '2rem' }}>
      <CardContent>
        {/* <Typography variant="h6" gutterBottom>
          Evaluate Students
        </Typography> */}
        <LinearProgress variant="determinate" value={progress} />

        <Stack direction="row" justifyContent="space-between" marginY={4} marginX={2}>
          <Typography component="h3" fontWeight="bold">
            PLO: <span style={{ fontWeight: 'normal' }}>{currentCriteria.PLO.title}</span>
          </Typography>
          <Typography component="h3" fontWeight="bold">
            Criteria: <span style={{ fontWeight: 'normal' }}>{currentCriteria.criteria}</span>{' '}
          </Typography>
        </Stack>

        <FormControl component="fieldset">
          <RadioGroup
            aria-label="performance"
            name="performance"
            value={selectedPerformances[currentCriteriaIndex]}
            onChange={handlePerformanceChange}
          >
            {currentCriteria.rubric_details.map((detail, index) => (
              <FormControlLabel
                key={index}
                value={detail.id} // Set value to detail.points and convert to string
                control={<Radio sx={{ marginInline: 2 }} />}
                label={`${detail.details} (${detail.points} Points)`} // Show both detail and points
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ marginTop: '2rem' }}>
          <Button variant="contained" onClick={handleBack} disabled={currentCriteriaIndex === 0}>
            Back
          </Button>

          <Button variant="contained" onClick={handleNext} disabled={selectedPerformances[currentCriteriaIndex] === ''}>
            {currentCriteriaIndex === criteriaData.rubrics.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Stack>

        <Snackbar open={snackbarInfo.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
            {snackbarInfo.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default EvaluationForm;
