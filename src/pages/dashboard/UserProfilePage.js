import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getInstructorList } from '../../redux/slices/instructor';
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.instructor);
  const isEdit = true;
  const currentUser = userList.find((u) => u.id === user.id);

  useEffect(() => {
    dispatch(getInstructorList());
  }, [dispatch]);

  console.log('Userparam', name);

  return (
    <Page title="Supervisor Profile | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Supervisor Profile"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: !isEdit ? 'Supervisor Profile' : name }]}
        />
        <SnackbarProvider>
          <UserNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
