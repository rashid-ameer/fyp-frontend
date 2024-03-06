import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link } from 'react-router-dom';

// material
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Container,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Chip,
  Stack
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAllCommittees } from '../../redux/slices/committee';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

export default function CommitteeList() {
  const { themeStretch, setColor } = useSettings();
  const dispatch = useDispatch();
  const [batch, setBatch] = useState('All');
  const { committees } = useSelector((state) => state.committee);
  const { batchesList } = useSelector((state) => state.batch);

  // this is for purpose of filtering committee if a specific batch is selected
  const committeesToShow =
    batch !== 'All' ? committees.filter((committee) => committee.batch_id === batch) : committees;

  const handleChange = (event) => {
    setBatch(event.target.value);
  };

  useEffect(() => {
    dispatch(getAllCommittees());
  }, [dispatch]);

  const card = (data) => (
    <>
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography sx={{ mb: 1.5, fontWeight: 'bold', marginBottom: '0' }} variant="h2">
          {data.id}
        </Typography>
        <Chip label="Spring-2024" sx={{ backgroundColor: `${setColor.lighter}`, color: `${setColor.darker}` }} />
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" variant="outlined">
          <Link to={`${PATH_DASHBOARD.committee.root}/${data.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            View
          </Link>
        </Button>
        <Button size="small" variant="contained">
          {console.log(`${PATH_DASHBOARD.committee.root}/${data.id}/committee-edit`)}
          <Link
            to={`${PATH_DASHBOARD.committee.root}/${data.id}/committee-edit`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Edit
          </Link>
        </Button>
      </CardActions>
    </>
  );

  return (
    <Page title="Committee: List | SIBAU FYPMS ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '30px' }}>
          <HeaderBreadcrumbs
            sx={{ marginBottom: '0' }}
            heading="Committee"
            links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Committee List' }]}
          />
          <Button variant="contained">
            <Link to={`${PATH_DASHBOARD.committee.newCommittee}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              Create New Committee
            </Link>
          </Button>
        </Stack>
        <Box>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Typography variant="h6" fontWeight="bold">
              Committies
            </Typography>

            <FormControl sx={{ width: '220px' }}>
              <InputLabel id="select-batch-label">Age</InputLabel>
              <Select
                labelId="select-batch-label"
                id="select-batch"
                value={batch}
                label="Batch"
                onChange={handleChange}
              >
                <MenuItem value="All">All</MenuItem>
                {batchesList.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.batch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Grid container columnSpacing={{ xs: 2 }} rowSpacing={{ xs: 2 }} columns={{ xs: 3, sm: 8, md: 12 }}>
            {committeesToShow.map((committee) => (
              <Grid key={committee.id} item xs={4} sm={4}>
                <Card variant="outlined" sx={{ boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
                  {card(committee)}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
