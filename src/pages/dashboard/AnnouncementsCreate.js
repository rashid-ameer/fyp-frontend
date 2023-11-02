// new version of annoucements

import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AnnouncementsNewForm from '../../components/_dashboard/user/AnnouncementsNewForm';

// ----------------------------------------------------------------------

export default function AnnouncementsCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);
  return (
    <Page title="Announcements | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a New Announcement' : 'Edit Announcement'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Announcements', href: PATH_DASHBOARD.general.announcements },
            { name: !isEdit ? 'New Announcement' : name }
          ]}
        />
        <SnackbarProvider>
          <AnnouncementsNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
