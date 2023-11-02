import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import MeetingsNewForm from '../components/_dashboard/user/MeetingsNewForm';
import { useDispatch, useSelector } from '../redux/store';
import { getGroup } from '../redux/slices/group';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function PageCreateMeeting() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { group } = useSelector((state) => state.group);
  const isEdit = pathname.includes('edit');
  // const currentUser = assignedWorkList.find((user) => paramCase(String(user.id)) === name);

  useEffect(() => {
    dispatch(getGroup(name));
  }, [dispatch]);

  return (
    <Page title="Create Meeting | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a New Meeting' : 'Edit Meeting'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Meetings', href: `${PATH_DASHBOARD.app.root}/${String(name)}/meeting-list` },
            { name: !isEdit ? 'New Meeting' : group?.project_title || '' }
          ]}
        />
        <SnackbarProvider>
          <MeetingsNewForm isEdit={isEdit} group={group} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
