import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
import useAuth from '../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import StudentNewForm from '../../components/_dashboard/user/StudentNewForm';

// ----------------------------------------------------------------------

export default function StudentProfilePage() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.user);
  const isEdit = true;
  const currentUser = userList.find((u) => u.id === user.id);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="Student Profile | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Student Profile"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: !isEdit ? 'Student Profile' : name }]}
        />
        <SnackbarProvider>
          <StudentNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
