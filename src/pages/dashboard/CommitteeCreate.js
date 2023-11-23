import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';

// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CommitteeNewForm from '../../components/_dashboard/user/CommitteeNewForm';
import { AvailableSupervisorList } from '../../components/_dashboard/user/list';
// ----------------------------------------------------------------------

export default function CommitteeCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);

  // dummy data: delte it later
  const [roleList, setRoleList] = useState([
    { id: '14555', name: 'Khalid Hussain', specialization: 'Software Development' },
    { id: '14556', name: 'Dr.Ghulam Mujtaba', specialization: 'Artifical Intelligence & Software Development' },
    { id: '13557', name: 'Dr.Ghulam Mustafa', specialization: 'Artifical Intelligence' },
    { id: '13558', name: 'Dr.Qamaruddin Khand', specialization: 'Software Development' },
    { id: '13559', name: 'Faryal Shamsi', specialization: 'Compiler' },
    { id: '13560', name: 'Sana Fatima', specialization: 'Software Development' },
    { id: '13561', name: 'Dr.Faisal', specialization: 'Networking' },
    { id: '13562', name: 'Dr.Zakria', specialization: 'Artifical Intelligence & Networking' },
    {
      id: '13563',
      name: 'Fahad Shahzad',
      specialization: 'Artifical Intelligence, Software Development & Mobile App Developement'
    }
  ]);

  // dummy data: delte it later
  const [projects, setProjects] = useState([
    { id: '16661', projectTitle: 'Ai Assistant' },
    { id: '16662', projectTitle: 'Final Year Management System' },
    { id: '16663', projectTitle: 'Free Fire' },
    { id: '16664', projectTitle: 'Smart Glasses' },
    { id: '16665', projectTitle: 'Smart Qeueue' },
    { id: '16666', projectTitle: 'WhatBot' }
  ]);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="User: Add a new Student | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Add a New Committee' : 'Edit Committee'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Committee', href: PATH_DASHBOARD.committee.list },
            { name: !isEdit ? 'New Committee' : name }
          ]}
        />
        <SnackbarProvider>
          <CommitteeNewForm isEdit={isEdit} currentUser={currentUser} roleList={roleList} projects={projects} />
        </SnackbarProvider>
        <AvailableSupervisorList roleList={roleList} setRoleList={setRoleList} />
      </Container>
    </Page>
  );
}
