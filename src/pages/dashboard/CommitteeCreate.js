import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';

// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
import { getCommitteeById } from '../../redux/slices/committee';
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
  const { committee } = useSelector((state) => state.committee);

  const formattedCommittee = {};
  if (committee?.id) {
    formattedCommittee.id = committee.id;
    formattedCommittee.batch = committee.batch;
    formattedCommittee.committeeHead = committee.supervisor_id;
    formattedCommittee.supervisor_committees = {};
    formattedCommittee.supervisor_committees = committee.supervisor_committees.map((item) => ({
      supervisor_committee_id: item.id,
      user: item.supervisor.user,
      id: item.supervisor.id
    }));

    formattedCommittee.groups = committee.groups;
  }

  useEffect(() => {
    if (isEdit) {
      dispatch(getCommitteeById(name));
    }
  }, [dispatch]);

  return (
    <Page title="Committee: Create New Committee  | SIBAU FYPMS">
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
          {isEdit && !committee?.id ? (
            <h2>Loading...</h2>
          ) : (
            <CommitteeNewForm isEdit={isEdit} committee={formattedCommittee} />
          )}
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
