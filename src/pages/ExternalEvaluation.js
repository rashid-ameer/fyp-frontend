import React, { useEffect, useState } from 'react';
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
  TextField,
  Container
} from '@mui/material';

import { PATH_DASHBOARD } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Page from '../components/Page';
import useSettings from '../hooks/useSettings';
import { useParams } from 'react-router';

function EvaluationForm() {
  const { groupId } = useParams();
  const { themeStretch } = useSettings();
  const [selectedPerformances, setSelectedPerformances] = useState(['', '', '']); // Dummy state for performance selection
  const [comments, setComments] = useState('');
  const [currentCriteriaIndex, setCurrentCriteriaIndex] = useState(0);
  const [isCommentStep, setIsCommentStep] = useState(false);
  const [criteriaData, setCriteriaData] = useState([]); // Dummy data for criteria [API call required
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    severity: 'success',
    message: ''
  });
  const [totalMarks, setTotalMarks] = useState(-1);

  useEffect(() => {
    fetch('http://localhost:8080/RubricReportMapping/getExternalReportRubrics')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCriteriaData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/Grades/getAllGrades')
      .then((res) => res.json())
      .then((data) => {
        let totalMarks = data.find((grade) => grade.grade_type === 'external')?.marks || 0;
        setTotalMarks((totalMarks / 100) * 200);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePerformanceChange = (event) => {
    const newSelectedPerformances = [...selectedPerformances];
    newSelectedPerformances[currentCriteriaIndex] = event.target.value;
    setSelectedPerformances(newSelectedPerformances);
  };

  const handleCommentChange = (event) => {
    setComments(event.target.value);
  };

  const handleSubmit = () => {
    const evaluationData = {
      performances: selectedPerformances,
      comments
    };

    // fetch('http://localhost:8080/submitEvaluation', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(evaluationData)
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Success:', data);
    //     setSnackbarInfo({
    //       open: true,
    //       severity: 'success',
    //       message: 'Evaluation completed successfully!'
    //     });
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //     setSnackbarInfo({
    //       open: true,
    //       severity: 'error',
    //       message: 'Evaluation submission failed!'
    //     });
    //   });

    // let totalPoints = 0;
    // const pointsSecured = criteriaData[0].rubrics.reduce((acc, rubric) => {
    //   totalPoints += 1;
    //   let point = rubric.rubric_details.find((detail) =>
    //     Boolean(selectedPerformances.findIndex((id) => id === detail.id))
    //   )?.points;
    //   return acc + point;
    // }, 0);

    // console.log(pointsSecured, totalPoints);
    let totalPoints = 0;
    let securedPoints = criteriaData[0].rubrics.reduce((acc, rubric) => {
      totalPoints += 1;
      let point = rubric.rubric_details.find((detail) =>
        selectedPerformances.find((id) => parseInt(id) === detail.id)
      )?.points;

      return acc + point;
    }, 0);

    totalPoints = totalPoints * criteriaData[0].rubrics[0].rubric_details.length;
    console.log(securedPoints, totalPoints, totalMarks);

    const external_marks = (securedPoints / totalPoints) * totalMarks;

    fetch(`http://localhost:8080/GroupGrades/updateGroupMarks/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_marks,
        group_id: groupId
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setSnackbarInfo({
          open: true,
          severity: 'success',
          message: 'Evaluation completed successfully!'
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setSnackbarInfo({
          open: true,
          severity: 'error',
          message: 'Evaluation submission failed!'
        });
      });
  };

  const handleNext = () => {
    if (currentCriteriaIndex < criteriaData[0].rubrics.length - 1) {
      setCurrentCriteriaIndex(currentCriteriaIndex + 1);
    } else if (!isCommentStep) {
      setIsCommentStep(true);
    } else {
      handleSubmit(); // Call the submit handler when all steps are completed
    }
  };

  const handleBack = () => {
    if (isCommentStep) {
      setIsCommentStep(false);
    } else if (currentCriteriaIndex > 0) {
      setCurrentCriteriaIndex(currentCriteriaIndex - 1);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  if (totalMarks === 0) {
    return <Typography variant="h6">No grades found for evaluation. Kindly update grades</Typography>;
  }

  if (criteriaData.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }
  const progress = ((currentCriteriaIndex + 1) / (criteriaData[0].rubrics.length + 1)) * 100;

  if (criteriaData[0]?.rubrics?.length === 0) {
    return <Typography variant="h6">No criteria found for evaluation</Typography>;
  }

  return (
    <Page title="Committee: Create New Committee  | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'External Evaluation'}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'External Evaluation' }]}
        />
        <Card variant="outlined" sx={{ minWidth: 300, marginTop: '2rem' }}>
          <CardContent>
            <LinearProgress variant="determinate" value={progress} />
            {!isCommentStep ? (
              <>
                <Stack direction="row" justifyContent="space-between" marginY={4} marginX={2}>
                  <Typography component="h3" fontWeight="bold">
                    PLO:{' '}
                    <span style={{ fontWeight: 'normal' }}>
                      {criteriaData[0].rubrics[currentCriteriaIndex].PLO.title}
                    </span>
                  </Typography>
                  <Typography component="h3" fontWeight="bold">
                    Criteria:{' '}
                    <span style={{ fontWeight: 'normal' }}>
                      {criteriaData[0].rubrics[currentCriteriaIndex].criteria}
                    </span>
                  </Typography>
                </Stack>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="performance"
                    name="performance"
                    value={selectedPerformances[currentCriteriaIndex]}
                    onChange={handlePerformanceChange}
                  >
                    {criteriaData[0].rubrics[currentCriteriaIndex].rubric_details.map((detail, index) => (
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
      </Container>
    </Page>
  );
}

export default EvaluationForm;
