import React, { useEffect, useState } from 'react';
import { Container, Snackbar } from '@mui/material';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import useSettings from '../hooks/useSettings';
import { PATH_DASHBOARD } from '../routes/paths';
import EvaluationForm from './EvaluationForm';
import { getRubricTypeRubrics, getRubricTypes, getMarking } from './api'; // Ensure this is the correct import path
import { Navigate, useParams } from 'react-router-dom';
import { set } from 'lodash';

function EvaluationFormWrapper() {
  const { groupId, rubricTypeId } = useParams();
  const { themeStretch } = useSettings();
  const [rubrics, setRubrics] = useState([]);
  const [rubricTypeTitle, setRubricTypeTitle] = useState('');
  const [isAlreadyEvaluated, setIsAlreadyEvaluated] = useState(true);
  const [loadingRubricTypes, setLoadingRubricTypes] = useState(true);
  const [loadingRubrics, setLoadingRubrics] = useState(true);
  const [loadingMarks, setLoadingMarks] = useState(true);

  useEffect(() => {
    const fetchRubricTypeRubrics = async () => {
      try {
        setLoadingRubrics(true);
        const data = await getRubricTypeRubrics(rubricTypeId);
        setRubrics(data);
      } catch (error) {
        console.error('Failed to fetch rubric types:', error);
      }
      setLoadingRubrics(false);
    };

    const fetchRubricTypes = async () => {
      try {
        setLoadingRubricTypes(true);
        const types = await getRubricTypes(); // Fetch all rubric types
        const foundType = types.find((type) => type.id.toString() === rubricTypeId); // Assuming id is the property to match
        if (foundType) setRubricTypeTitle(foundType.rubric_type); // Set the title of the found rubric type
      } catch (error) {
        console.error('Failed to fetch rubric type titles:', error);
      }
      setLoadingRubricTypes(false);
    };

    const checkIfAlreadyEvaluated = async () => {
      try {
        setLoadingMarks(true);
        const markingData = await getMarking({ groupId, rubricTypeId });
        console.log(markingData);
        setIsAlreadyEvaluated(markingData.length > 0);
      } catch (error) {
        console.error('Failed to fetch marking data:', error);
      }
      setLoadingMarks(false);
    };

    fetchRubricTypeRubrics();
    fetchRubricTypes();
    checkIfAlreadyEvaluated();
  }, []);

  return (
    <Page title="Evaluation">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          sx={{ marginBottom: '0' }}
          heading="Evaluation"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Evaluation List', href: PATH_DASHBOARD.evaluation.management },
            { name: `${rubricTypeTitle || 'Report'}` }
          ]}
        />
        {/* Pass the rubricTypeTitle along with rubrics and groupId to EvaluationForm */}
        {loadingMarks || loadingRubricTypes || loadingRubrics ? (
          <div>Loading...</div> // Replace with your loading component or spinner
        ) : rubrics.length !== 0 ? (
          <EvaluationForm
            criteriaData={rubrics}
            groupId={groupId}
            edit={isAlreadyEvaluated}
            rubricTypeId={rubricTypeId}
          />
        ) : (
          <Navigate to={`${PATH_DASHBOARD.evaluation.evaluationTimeline}/${groupId}`} />
        )}
      </Container>
    </Page>
  );
}

export default EvaluationFormWrapper;
