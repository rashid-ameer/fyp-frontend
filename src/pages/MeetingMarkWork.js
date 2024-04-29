import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Checkbox, Container, Typography, Button } from '@mui/material';
import { getMeetingDetails, updateMeetingWorkStatus } from './api'; // Ensure you have this API function
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../routes/paths';

const MeetingList = () => {
  const { id, groupId } = useParams();

  console.log(id, groupId);
  const [meetingData, setMeetingData] = useState([]);
  const [workStatus, setWorkStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMeetingDetails(id);
        setMeetingData(data);
        const initialStatus = data.meeting_assigned_works.reduce((acc, work) => {
          acc[work.student_id] = work.status === '1';
          return acc;
        }, {});
        setWorkStatus(initialStatus);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, [id]);

  const handleCheckboxChange = (studentId) => {
    setWorkStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: !prevStatus[studentId]
    }));
  };

  const handleSubmit = async () => {
    const students = meetingData.meeting_assigned_works.map((work) => ({
      status: workStatus[work.student_id] ? 1 : 0,
      student_id: work.student_id
    }));

    try {
      await updateMeetingWorkStatus({ meeting_id: id, students });
      alert('Update successful!');
    } catch (error) {
      console.error('Failed to update data', error);
      alert('Failed to update!');
    }
  };

  if (meetingData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Page title="Meeting List | SIBAU FYPMS">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Meeting"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Meeting List', href: `${PATH_DASHBOARD.app.root}/${groupId}/meeting-list` },
            { name: 'Meeting' }
          ]}
        />
        <Typography variant="h4" component="h2">
          {meetingData.agenda}
        </Typography>
        {meetingData?.meeting_assigned_works.map((work, index) => (
          <div
            key={index}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}
          >
            <div>
              <Typography variant="h6" component="h3">
                {work.student.user.name}
              </Typography>
              <Typography>{work.action_work}</Typography>
            </div>
            <Checkbox
              checked={workStatus[work.student_id] || false}
              onChange={() => handleCheckboxChange(work.student_id)}
            />
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ display: 'block', marginLeft: 'auto' }}
        >
          Submit Changes
        </Button>
      </Container>
    </Page>
  );
};

export default MeetingList;
