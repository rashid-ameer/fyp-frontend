// import { useEffect } from 'react';
// import { paramCase } from 'change-case';
// import { useParams, useLocation } from 'react-router-dom';
// // material
// import { Container } from '@mui/material';
// // redux
// import { SnackbarProvider } from 'notistack';
// import { useDispatch, useSelector } from '../../redux/store';
// import { getUserList } from '../../redux/slices/user';
// // routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// // hooks
// import useSettings from '../../hooks/useSettings';
// // components
// import Page from '../../components/Page';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import UserNewForm from '../../components/_dashboard/user/UserNewForm';

// import AnnouncementsNewForm from '../../components/_dashboard/user/AnnouncementsNewForm';
// import AnnouncementsNewForm1 from '../../components/_dashboard/user/AnnouncementsNewForm1';

// // ----------------------------------------------------------------------

// export default function AnnouncementsCreate() {
//   const { themeStretch } = useSettings();
//   const dispatch = useDispatch();
//   const { pathname } = useLocation();
//   const { name } = useParams();
// const { userList } = useSelector((state) => state.user);
//   const isEdit = pathname.includes('edit');
// const currentUser = userList.find((user) => paramCase(user.name) === name);

//   useEffect(() => {
//     dispatch(getUserList());
//   }, [dispatch]);

//   return (
// <Page title="Announcements | SIBAU FYPMS">
//   <Container maxWidth={themeStretch ? false : 'lg'}>
//     <HeaderBreadcrumbs
//       heading={!isEdit ? 'Create a New Announcements' : 'Edit Announcement'}
//       links={[
//         { name: 'Dashboard', href: PATH_DASHBOARD.root },
//         { name: 'User', href: PATH_DASHBOARD.user.root },
//         { name: !isEdit ? 'New Announcement' : name }
//       ]}
//     />
//     <SnackbarProvider>
//       <AnnouncementsNewForm1 isEdit={isEdit} currentUser={currentUser} />
//     </SnackbarProvider>
//   </Container>
// </Page>
//   );
// }

// new version of annoucements

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
import AnnouncementsNewForm from '../components/_dashboard/user/ReportsNewForm';
import SubmitIdeaNewForm from '../components/_dashboard/user/SubmitIdeaNewForm';

// ----------------------------------------------------------------------

export default function PageCreateGroup() {
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
    <Page title="Create Reports | SIBAU FYPMS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create Group' : 'Edit Idea'}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: !isEdit ? 'Group Creation' : name }]}
        />
        <SnackbarProvider>
          <SubmitIdeaNewForm isEdit={isEdit} currentUser={currentUser} />
        </SnackbarProvider>
      </Container>
    </Page>
  );
}
