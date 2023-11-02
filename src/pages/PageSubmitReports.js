import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from '../redux/store';
import { getProducts } from '../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import SubmitReportsNewForm from '../components/_dashboard/user/SubmitReportsNewForm';
import PageSubmitReportStepper from './PageSubmitReportStepper';
// ----------------------------------------------------------------------

export default function PageSubmitReports() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="Submit Reports | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <h3>Submit Reports </h3>
        {/* <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a New Report' : 'Edit Report'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New Report' : name }
          ]}
        /> */}
        <PageSubmitReportStepper />
        {/* <SnackbarProvider>
          <SubmitReportsNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider> */}
      </Container>
    </Page>
  );
}
