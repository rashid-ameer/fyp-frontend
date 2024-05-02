// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

// -----Path Auth copied------------
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

// -------------------end----
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    appPage: path(ROOTS_DASHBOARD, '/homepage'),
    manageUsers: path(ROOTS_DASHBOARD, '/manageusers'),
    userProfile: path(ROOTS_DASHBOARD, '/user-profile'),
    studentProfile: path(ROOTS_DASHBOARD, '/student-profile'),
    announcements: path(ROOTS_DASHBOARD, '/announcements'),
    anntesting: path(ROOTS_DASHBOARD, '/anntesting'),
    viewAllAttendance: path(ROOTS_DASHBOARD, '/view-all-attendance'),
    viewStudentAttendance: path(ROOTS_DASHBOARD, '/view-student-attendance'),
    newAnnouncement: path(ROOTS_DASHBOARD, '/newannouncement'),
    viewAnnouncements: path(ROOTS_DASHBOARD, '/viewannouncements'),
    approveGroups: path(ROOTS_DASHBOARD, '/approvegroups'),
    createGroup: path(ROOTS_DASHBOARD, '/creategroup'),

    viewGroups: path(ROOTS_DASHBOARD, '/viewgroups'),
    groupsUnderSupervision: path(ROOTS_DASHBOARD, '/groups-under-supervision'),
    groupsUnderCommittee: path(ROOTS_DASHBOARD, '/groups-under-committee'),
    assignSupervisors: path(ROOTS_DASHBOARD, '/assignsupervisors'),
    assignWork: path(ROOTS_DASHBOARD, '/assignwork'),
    projectsArchive: path(ROOTS_DASHBOARD, '/projectsarchive'),
    reports: path(ROOTS_DASHBOARD, '/reports'),
    createReport: path(ROOTS_DASHBOARD, '/createreport'),
    submitReports: path(ROOTS_DASHBOARD, '/submitreports')
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/app'),
    announcements: path(ROOTS_DASHBOARD, '/app/announcements'),
    supervisorSpecialization: path(ROOTS_DASHBOARD, '/app/supervisor-specialization'),

    meetingsList: path(ROOTS_DASHBOARD, '/app/meeting-list'),
    meetingMarkWork: path(ROOTS_DASHBOARD, '/app/meeting-mark-work'),
    createMeeting: path(ROOTS_DASHBOARD, '/app/create-meeting'),

    pageFive: path(ROOTS_DASHBOARD, '/app/five'),
    pageSix: path(ROOTS_DASHBOARD, '/app/six')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    // profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    userbatch: path(ROOTS_DASHBOARD, '/user/userbatch'),
    userRole: path(ROOTS_DASHBOARD, '/user/userrole'),

    newSupervisor: path(ROOTS_DASHBOARD, '/user/newsupervisor'),
    newStudent: path(ROOTS_DASHBOARD, '/user/newstudent'),
    newRole: path(ROOTS_DASHBOARD, '/user/newrole'),
    newBatch: path(ROOTS_DASHBOARD, '/user/newbatch'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  committee: {
    root: path(ROOTS_DASHBOARD, '/committee'),
    list: path(ROOTS_DASHBOARD, '/committee/list'),
    newCommittee: path(ROOTS_DASHBOARD, '/committee/newcommittee')
  },
  evaluation: {
    root: path(ROOTS_DASHBOARD, '/evaluation'),
    management: path(ROOTS_DASHBOARD, '/evaluation/management'),
    managePlo: path(ROOTS_DASHBOARD, '/evaluation/manage-plo'),
    manageRubrics: path(ROOTS_DASHBOARD, '/evaluation/manage-rubrics'),
    manageRubricDetails: path(ROOTS_DASHBOARD, '/evaluation/manage-rubric-details'),
    manageRubricTypes: path(ROOTS_DASHBOARD, '/evaluation/manage-rubric-types'),
    evaluationTimeline: path(ROOTS_DASHBOARD, '/evaluation/evaluation-timeline'),
    evaluationForm: path(ROOTS_DASHBOARD, '/evaluation/evaluation-form')
  },
  idea: {
    root: path(ROOTS_DASHBOARD, '/idea'),
    submitIdea: path(ROOTS_DASHBOARD, '/idea/submit-idea'),
    ideaList: path(ROOTS_DASHBOARD, '/idea/list')
  }
};
