import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getRoleList } from '../../redux/slices/role';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import RoleNewForm from '../../components/_dashboard/user/RoleNewForm';

// ----------------------------------------------------------------------

export default function RoleCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { roleList } = useSelector((state) => state.role);
  const isEdit = pathname.includes('edit');
  const currentRole = roleList.find((role) => paramCase(role.role_name) === name);

  useEffect(() => {
    dispatch(getRoleList());
  }, [dispatch]);

  return (
    <Page title="User: Add a new Role | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Add a New Role' : 'Edit Role'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New Role' : name }
          ]}
        />
        <SnackbarProvider>
          <RoleNewForm isEdit={isEdit} currentUser={currentRole} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
