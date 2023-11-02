import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SnackbarProvider } from 'notistack';
import SubmitReportsNewForm from '../components/_dashboard/user/SubmitReportsNewForm';
import useAuth from '../hooks/useAuth';
import { useDispatch, useSelector } from '../redux/store';
import { getReportsWithAssignedWorkByGroupId, getReportTypeList } from '../redux/slices/reportType';
import { getBatchesList } from '../redux/slices/batch';
import { getGroupList } from '../redux/slices/group';

const steps = ['Abstract', 'Proposal', 'SRS/SDS', 'Final Report'];

export default function HorizontalLinearStepper() {
  const dispatch = useDispatch();
  const { reportData, reportTypeList, student } = useSelector((state) => state.reportType);
  const { batchesList } = useSelector((state) => state.batch);
  const { groupList } = useSelector((state) => state.group);
  const { user } = useAuth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const callDispatch = () => {
    dispatch(
      user.role.role_name === 'Student' ? getReportsWithAssignedWorkByGroupId(user?.id || '') : getReportTypeList()
    );
  };

  useEffect(() => {
    callDispatch();
    dispatch(getGroupList());
    dispatch(getBatchesList());
  }, [dispatch]);

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {reportData.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          //   if (isStepOptional(index)) {
          //     labelProps.optional = <Typography variant="caption">Optional</Typography>;
          //   }
          //   if (isStepSkipped(index)) {
          //     stepProps.completed = false;
          //   }
          return (
            <Step key={label.id} {...stepProps}>
              <StepLabel {...labelProps}>{label.report_type}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === reportData.length ? (
        <>
          {/* <React.Fragment> */}
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
          {/* </React.Fragment> */}
        </>
      ) : (
        <>
          {/* <React.Fragment> */}
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <SnackbarProvider>
            <SubmitReportsNewForm
              msg={activeStep + 1}
              reportData={reportData[activeStep]}
              batch={
                user.role.role_name === 'Student'
                  ? batchesList.find((batch) => batch.id === student?.batch_id)?.batch || 'Not Available'
                  : 'Not Available'
              }
              group={
                user.role.role_name === 'Student'
                  ? groupList?.find((group) => group.id === student.group_id) || null
                  : null
              }
              callDispatch={callDispatch}
            />
          </SnackbarProvider>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

            <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
          {/* </React.Fragment> */}
        </>
      )}
    </Box>
  );
}
