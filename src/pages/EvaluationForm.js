import React, { useState } from 'react';
import {
  Typography,
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
  Alert,
  TextField
} from '@mui/material';
import { addReportMarking, updateMarking } from './api';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';

function EvaluationForm({ criteriaData, groupId, edit, rubricTypeId }) {
  console.log(rubricTypeId);
  const [selectedPerformances, setSelectedPerformances] = useState(criteriaData.rubrics.map(() => ''));
  const [comments, setComments] = useState('');
  const [currentCriteriaIndex, setCurrentCriteriaIndex] = useState(0);
  const [isCommentStep, setIsCommentStep] = useState(false); // New state to manage the comment step
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const navigate = useNavigate();

  const progress = ((currentCriteriaIndex + 1) / (criteriaData.rubrics.length + 1)) * 100; // Adjusted for extra comment step

  const handlePerformanceChange = (event) => {
    const newSelectedPerformances = [...selectedPerformances];
    newSelectedPerformances[currentCriteriaIndex] = event.target.value;
    setSelectedPerformances(newSelectedPerformances);
  };

  const handleCommentChange = (event) => {
    setComments(event.target.value);
  };

  const handleNext = async () => {
    if (currentCriteriaIndex < criteriaData.rubrics.length - 1) {
      setCurrentCriteriaIndex(currentCriteriaIndex + 1);
    } else if (!isCommentStep) {
      setIsCommentStep(true); // Move to the comment step
    } else {
      // Prepare data for submission including comments
      const data = { groupId, rubric_details_ids: selectedPerformances, comments };

      if (edit) {
        data.rubric_type_id = rubricTypeId;
        await updateMarking(data);
        setSnackbarInfo({
          open: true,
          severity: 'success',
          message: 'Evaluation updated successfully!'
        });
      } else {
        await addReportMarking(data);
        setSnackbarInfo({
          open: true,
          severity: 'success',
          message: 'Evaluation completed successfully!'
        });
      }
      navigate(PATH_DASHBOARD.general.appPage);
    }
  };

  const handleBack = () => {
    if (isCommentStep) {
      setIsCommentStep(false); // Return from comment step
    } else if (currentCriteriaIndex > 0) {
      setCurrentCriteriaIndex(currentCriteriaIndex - 1);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  return (
    <Card variant="outlined" sx={{ minWidth: 300, marginTop: '2rem' }}>
      <CardContent>
        <LinearProgress variant="determinate" value={progress} />
        {!isCommentStep ? (
          <>
            <Stack direction="row" justifyContent="space-between" marginY={4} marginX={2}>
              <Typography component="h3" fontWeight="bold">
                PLO:{' '}
                <span style={{ fontWeight: 'normal' }}>{criteriaData.rubrics[currentCriteriaIndex].PLO.title}</span>
              </Typography>
              <Typography component="h3" fontWeight="bold">
                Criteria:{' '}
                <span style={{ fontWeight: 'normal' }}>{criteriaData.rubrics[currentCriteriaIndex].criteria}</span>
              </Typography>
            </Stack>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="performance"
                name="performance"
                value={selectedPerformances[currentCriteriaIndex]}
                onChange={handlePerformanceChange}
              >
                {criteriaData.rubrics[currentCriteriaIndex].rubric_details.map((detail, index) => (
                  <FormControlLabel
                    key={index}
                    value={detail.id}
                    control={<Radio sx={{ marginInline: 2 }} />}
                    label={`${detail.details} (${detail.points} Points)`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </>
        ) : (
          <TextField
            fullWidth
            label="Additional Comments"
            value={comments}
            onChange={handleCommentChange}
            multiline
            rows={4}
            margin="normal"
          />
        )}
        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ marginTop: '2rem' }}>
          <Button variant="contained" onClick={handleBack} disabled={currentCriteriaIndex === 0 && !isCommentStep}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isCommentStep && selectedPerformances[currentCriteriaIndex] === ''}
          >
            {isCommentStep ? 'Submit Evaluation' : 'Next'}
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
