// material
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppNewInvoice,
  AppTopRelated,
  AppTotalDownloads,
  AppTotalActiveUsers,
  AppTopInstalledCountries,
  AppTotalInstalled
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="General: App | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user.name} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalInstalled />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalDownloads />
          </Grid>

          <Grid item xs={12} lg={12}>
            <AppNewInvoice />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
