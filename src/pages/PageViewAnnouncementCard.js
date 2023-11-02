import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import androidFilled from '@iconify/icons-ant-design/android-filled';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, Grid, Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// utils

import { useDispatch, useSelector } from '../redux/store';
import { getUserList } from '../redux/slices/user';
import { getBatchesList } from '../redux/slices/batch';
import { fShortenNumber } from '../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  // textAlign: 'center',
  padding: theme.spacing(2, 3),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function PageViewAnnouncementCard({ data }) {
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);
  const { batchesList } = useSelector((state) => state.batch);
  const { themeStretch } = useSettings();
  useEffect(() => {
    dispatch(getUserList());
    dispatch(getBatchesList());
  }, [dispatch]);
  const getDate = (date) => {
    const newDate = new Date(date);
    return String(newDate.toLocaleString('en-US'));
  };
  return (
    <RootStyle>
      {/* <IconWrapperStyle>
        <Icon icon={androidFilled} width={24} height={24} />
      </IconWrapperStyle> */}
      <Typography variant="h5">{data.title}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        <div dangerouslySetInnerHTML={{ __html: data.description }} />
      </Typography>
      <br />
      <br />
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              Batch: {batchesList?.find((batch) => batch.id === data.batch_id)?.batch || 'All' || ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              Announced by: {userList?.find((user) => user.id === data.supervisor_id)?.name || '' || ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              Posted at: {getDate(data.createdAt)}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
