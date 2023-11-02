import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../../redux/store';
import { getBatchesList } from '../../redux/slices/batch';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import BatchNewForm from '../../components/_dashboard/user/BatchNewForm';

// ----------------------------------------------------------------------

export default function BatchCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { batchesList } = useSelector((state) => state.batch);
  const isEdit = pathname.includes('edit');
  const currentUser = batchesList.find((batch) => paramCase(batch.batch) === name);
  useEffect(() => {
    dispatch(getBatchesList());
  }, [dispatch]);

  return (
    <Page title="User: Add a new Batch | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Add a New Batch' : 'Edit Batch'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New Batch' : name }
          ]}
        />
        <SnackbarProvider>
          <BatchNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
