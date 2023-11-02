import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getInstructorList } from '../../redux/slices/instructor';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';

// ----------------------------------------------------------------------

export default function SupervisorCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.instructor);
  const isEdit = pathname.includes('edit');
  const currentUser = userList?.find((user) => paramCase(user?.user?.name) === name);

  useEffect(() => {
    dispatch(getInstructorList());
  }, [dispatch]);

  return (
    <Page title="User: Add a new supervisor | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Add a New Supervisor' : 'Edit Supervisor'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New Supervisor' : name }
          ]}
        />
        <SnackbarProvider>
          <UserNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
