import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import userReducer from './slices/user';
import roleReducer from './slices/role';
import batchReducer from './slices/batch';
import studentReducer from './slices/student';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import departmentReducer from './slices/department';
import instructorReducer from './slices/instructor';
import announcementReducer from './slices/announcement';
import groupReducer from './slices/group';
import reportTypeReducer from './slices/reportType';
import assignedWorkReducer from './slices/assignedWork';
import groupSubmittedFilesReducer from './slices/groupSubmittedFiles';
import meetingsReducer from './slices/meetings';
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  role: roleReducer,
  batch: batchReducer,
  student: studentReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  department: departmentReducer,
  instructor: instructorReducer,
  announcement: announcementReducer,
  group: groupReducer,
  reportType: reportTypeReducer,
  assignedWork: assignedWorkReducer,
  groupSubmittedFiles: groupSubmittedFilesReducer,
  meetings: meetingsReducer,
  product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };
