import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { store } from '../redux/store';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import GuestGuard from '../guards/GuestGuard';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <SnackbarProvider store={store}>
              <GuestGuard>
                <Login />
              </GuestGuard>
            </SnackbarProvider>
          )
        },
        {
          path: 'register',
          element: (
            <SnackbarProvider store={store}>
              <GuestGuard>
                <Register />
              </GuestGuard>
            </SnackbarProvider>
          )
        },
        {
          path: 'login-unprotected',
          element: (
            <SnackbarProvider store={store}>
              <Login />
            </SnackbarProvider>
          )
        },
        {
          path: 'register-unprotected',
          element: (
            <SnackbarProvider store={store}>
              <Register />
            </SnackbarProvider>
          )
        },
        {
          path: 'reset-password',
          element: (
            <SnackbarProvider store={store}>
              <ResetPassword />
            </SnackbarProvider>
          )
        },
        {
          path: 'verify',
          element: (
            <SnackbarProvider store={store}>
              <VerifyCode />
            </SnackbarProvider>
          )
        }
      ]
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Navigate to="/dashboard/homepage" replace /> },
        {
          path: 'homepage',
          element: (
            <Provider store={store}>
              <GeneralApp />
            </Provider>
          )
        },
        { path: 'manageusers', element: <PageManageUsers /> },
        {
          path: 'user-profile',
          element: (
            <Provider store={store}>
              <UserProfilePage />
            </Provider>
          )
        },
        {
          path: 'student-profile',
          element: (
            <Provider store={store}>
              <StudentProfilePage />
            </Provider>
          )
        },
        {
          path: 'newannouncement',
          element: (
            <Provider store={store}>
              <AnnouncementsCreate />
            </Provider>
          )
        },
        {
          path: 'viewannouncements',
          element: (
            <Provider store={store}>
              <PageViewAnnouncements />
            </Provider>
          )
        },
        {
          path: 'createGroup',
          element: (
            <Provider store={store}>
              <PageCreateGroup />
            </Provider>
          )
        },

        {
          path: 'viewgroups',
          element: (
            <Provider store={store}>
              <PageGroups />
            </Provider>
          )
        },
        {
          path: 'groups-under-supervision',
          element: (
            <Provider store={store}>
              <PageGroupsUnderSupervision />
            </Provider>
          )
        },
        {
          path: 'groups-under-committee',
          element: (
            <Provider store={store}>
              <PageGroupsUnderCommittee />
            </Provider>
          )
        },

        {
          path: 'view-all-attendance',
          element: (
            <Provider store={store}>
              <ViewAllAttendance />
            </Provider>
          )
        },
        {
          path: 'view-student-attendance',
          element: (
            <Provider store={store}>
              <ViewStudentAttendance />
            </Provider>
          )
        },
        {
          path: 'projectsarchive',
          element: (
            <Provider store={store}>
              <PageProjectsArchive />
            </Provider>
          )
        },
        {
          path: 'reports',
          element: (
            <Provider store={store}>
              <ReportsList />
            </Provider>
          )
        },

        {
          path: 'createreport',
          element: (
            <Provider store={store}>
              <PageCreateReports />
            </Provider>
          )
        },

        {
          path: 'submitreports',
          element: (
            <Provider store={store}>
              <PageSubmitReports />
            </Provider>
          )
        },

        {
          path: 'app',
          children: [
            { element: <Navigate to="/dashboard/app/four" replace /> },
            {
              path: 'announcements',
              element: (
                <Provider store={store}>
                  <Announcements />
                </Provider>
              )
            },
            {
              path: ':name/create-meeting',
              element: (
                <Provider store={store}>
                  <PageCreateMeeting />
                </Provider>
              )
            },
            {
              path: ':name/meeting-list',
              element: (
                <Provider store={store}>
                  <MeetingList />
                </Provider>
              )
            },
            {
              path: 'supervisor-specialization',
              element: (
                <Provider store={store}>
                  <SupervisorSpecialization />
                </Provider>
              )
            }
          ]
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace /> },
            {
              path: ':name/groups-under-supervision-progress',
              element: (
                <Provider store={store}>
                  <GroupsUnderSupervisionProgress />
                </Provider>
              )
            },

            {
              path: ':name/submitted-reports',
              element: (
                <Provider store={store}>
                  <ReportsSubmitted />
                </Provider>
              )
            },
            { path: 'cards', element: <UserCards /> },
            {
              path: 'list',
              element: (
                <Provider store={store}>
                  <UserList />
                </Provider>
              )
            },

            {
              path: 'userbatch',
              element: (
                <Provider store={store}>
                  <UserBatch />
                </Provider>
              )
            },
            {
              path: 'userrole',
              element: (
                <Provider store={store}>
                  <UserRole />
                </Provider>
              )
            },

            {
              path: 'newsupervisor',
              element: (
                <Provider store={store}>
                  <SupervisorCreate />
                </Provider>
              )
            },
            {
              path: ':name/approvegroup',
              element: (
                <Provider store={store}>
                  <ApproveGroups />
                </Provider>
              )
            },
            {
              path: ':name/supervisoredit',
              element: (
                <Provider store={store}>
                  <SupervisorCreate />
                </Provider>
              )
            },
            {
              path: 'newstudent',
              element: (
                <Provider store={store}>
                  <StudentCreate />
                </Provider>
              )
            },
            {
              path: ':name/studentedit',
              element: (
                <Provider store={store}>
                  <StudentCreate />
                </Provider>
              )
            },
            {
              path: 'newrole',
              element: (
                <Provider store={store}>
                  <RoleCreate />
                </Provider>
              )
            },
            {
              path: ':name/roleedit',
              element: (
                <Provider store={store}>
                  <RoleCreate />
                </Provider>
              )
            },

            {
              path: 'newbatch',
              element: (
                <Provider store={store}>
                  <BatchCreate />
                </Provider>
              )
            },
            {
              path: ':name/batchedit',
              element: (
                <Provider store={store}>
                  <BatchCreate />
                </Provider>
              )
            },
            {
              path: ':name/reportedit',
              element: (
                <Provider store={store}>
                  <PageCreateReports />
                </Provider>
              )
            },
            {
              path: 'announcementedit',
              element: (
                <Provider store={store}>
                  <AnnouncementsCreate />
                </Provider>
              )
            }
          ]
        },
        {
          path: 'committee',
          children: [
            {
              path: 'list',
              element: (
                <Provider store={store}>
                  <CommitteeList />
                </Provider>
              )
            },
            {
              path: 'newcommittee',
              element: (
                <Provider store={store}>
                  <CommitteeCreate />
                </Provider>
              )
            },
            {
              path: ':name/committee-edit',
              element: (
                <Provider store={store}>
                  <CommitteeCreate />
                </Provider>
              )
            },
            {
              path: ':committeeId',
              element: (
                <Provider store={store}>
                  <CommitteeView />
                </Provider>
              )
            }
          ]
        },
        {
          path: 'evaluation',
          children: [
            {
              path: 'management',
              element: (
                <Provider store={store}>
                  <EvaluationManagement />
                </Provider>
              )
            },
            {
              path: 'manage-plo',
              element: (
                <Provider store={store}>
                  <PloForm />
                </Provider>
              )
            },
            {
              path: 'manage-rubrics',
              element: (
                <Provider store={store}>
                  <RubricsForm />
                </Provider>
              )
            },
            {
              path: 'manage-rubric-details',
              element: (
                <Provider store={store}>
                  <RubricsDetailsForm />
                </Provider>
              )
            },
            {
              path: 'manage-rubric-types',
              element: (
                <Provider store={store}>
                  <RubricsTypeForm />
                </Provider>
              )
            }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: (
        <GuestGuard>
          <SnackbarProvider>
            <Login />
          </SnackbarProvider>
        </GuestGuard>
      )
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const PageManageUsers = Loadable(lazy(() => import('../pages/PageManageUsers')));
const PageCreateGroup = Loadable(lazy(() => import('../pages/PageCreateGroup')));
const PageGroups = Loadable(lazy(() => import('../pages/PageGroups')));
const PageGroupsUnderSupervision = Loadable(lazy(() => import('../pages/PageGroupsUnderSupervision')));
const PageGroupsUnderCommittee = Loadable(lazy(() => import('../pages/PageGroupsUnderCommittee')));

const PageProjectsArchive = Loadable(lazy(() => import('../pages/PageProjectsArchive')));
const PageCreateReports = Loadable(lazy(() => import('../pages/PageCreateReports')));
const PageCreateMeeting = Loadable(lazy(() => import('../pages/PageCreateMeeting')));
const PageSubmitReports = Loadable(lazy(() => import('../pages/PageSubmitReports')));

const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const SupervisorCreate = Loadable(lazy(() => import('../pages/dashboard/SupervisorCreate')));
const ApproveGroups = Loadable(lazy(() => import('../pages/dashboard/ApproveGroups')));

const UserRole = Loadable(lazy(() => import('../pages/dashboard/UserRole')));
const RoleCreate = Loadable(lazy(() => import('../pages/dashboard/RoleCreate')));
const UserBatch = Loadable(lazy(() => import('../pages/dashboard/UserBatch')));
const BatchCreate = Loadable(lazy(() => import('../pages/dashboard/BatchCreate')));
const Announcements = Loadable(lazy(() => import('../pages/dashboard/AnnouncementsList')));
const ViewAllAttendance = Loadable(lazy(() => import('../pages/dashboard/ViewAllAttendance')));
const ViewStudentAttendance = Loadable(lazy(() => import('../pages/dashboard/ViewStudentAttendance')));
const SupervisorSpecialization = Loadable(lazy(() => import('../pages/dashboard/SupervisorSpecialization')));
const ReportsList = Loadable(lazy(() => import('../pages/dashboard/ReportsList')));
const MeetingList = Loadable(lazy(() => import('../pages/dashboard/MeetingList')));

const ReportsSubmitted = Loadable(lazy(() => import('../pages/dashboard/ReportsSubmitted')));
const UserProfilePage = Loadable(lazy(() => import('../pages/dashboard/UserProfilePage')));
const StudentProfilePage = Loadable(lazy(() => import('../pages/dashboard/StudentProfilePage')));
const GroupsUnderSupervisionProgress = Loadable(
  lazy(() => import('../pages/dashboard/GroupsUnderSupervisionProgress'))
);
const AnnouncementsCreate = Loadable(lazy(() => import('../pages/dashboard/AnnouncementsCreate')));
const PageViewAnnouncements = Loadable(lazy(() => import('../pages/PageViewAnnouncements')));

const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const StudentCreate = Loadable(lazy(() => import('../pages/dashboard/StudentCreate')));

const CommitteeCreate = Loadable(lazy(() => import('../pages/dashboard/CommitteeCreate')));
const CommitteeList = Loadable(lazy(() => import('../pages/dashboard/CommitteeList')));
const CommitteeView = Loadable(lazy(() => import('../pages/PageViewCommittee')));

const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Main
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));

// evaluation
const EvaluationManagement = Loadable(lazy(() => import('../pages/dashboard/EvaluationManagement')));
const RubricsForm = Loadable(lazy(() => import('../pages/RubricsForm')));
const RubricsDetailsForm = Loadable(lazy(() => import('../pages/RubricsDetailsForm')));
const PloForm = Loadable(lazy(() => import('../pages/PloForm')));
const RubricsTypeForm = Loadable(lazy(() => import('../pages/RubricsTypeForm')));
