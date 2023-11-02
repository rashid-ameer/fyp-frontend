import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getGroupList, deleteGroup } from '../../redux/slices/group';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ApproveGroupForm from '../../components/_dashboard/user/ApproveGroupForm';

// ----------------------------------------------------------------------

export default function SupervisorCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { groupList } = useSelector((state) => state.group);
  const isEdit = pathname.includes('edit');
  const currentUser = groupList.find((group) => paramCase(String(group.id)) === name);

  useEffect(() => {
    dispatch(getGroupList());
  }, [dispatch]);

  return (
    <Page title="User: Add a new supervisor | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Approve Group and Assign Supervisor' : 'Approve Group'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'Approve Group' : name }
          ]}
        />
        <SnackbarProvider>
          <ApproveGroupForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
