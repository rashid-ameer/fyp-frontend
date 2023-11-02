import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  report_type: [],
  submittedFiles: [],
  student: [],
  reportData: [],
  filesSubmitted: [],
  submittedFilesByGroups: []
};

const slice = createSlice({
  name: 'groupSubmittedFiles',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // GET USERS
    getReportTypeSuccess(state, action) {
      state.isLoading = false;
      state.report_type = action.payload;
    },
    getReportDataSuccess(state, action) {
      state.isLoading = false;
      state.reportData = action.payload;
    },
    getAssignedWorkSuccess(state, action) {
      state.isLoading = false;
      state.reportData = action.payload;
    },
    getStudentSuccess(state, action) {
      state.isLoading = false;
      state.student = action.payload;
    },
    // DELETE USERS
    deleteSubmittedFiles(state, action) {
      const deleteUser = filter(state.batchList, (batch) => batch.id !== action.payload);
      state.batchList = deleteUser;
    },

    getSubmittedFilesByAllGroupSuccess(state, action) {
      state.isLoading = false;
      state.submittedFilesByGroups = action.payload;
    },
    // GET MANAGE USERS
    getSubmittedFilesSuccess(state, action) {
      state.isLoading = false;
      state.submittedFiles = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
export const { deleteSubmittedFiles } = slice.actions;
// ----------------------------------------------------------------------

// export function getReportTypeList() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('http://localhost:8080/ReportType/showAllReports');
//       console.log('report_tpes', response.data);
//       dispatch(slice.actions.getReportTypeListSuccess(response.data));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
export function getSubmittedFilesByGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/saveGroupFiles/showSubmittedFilesByGroup', {
        group_id: id
      });
      console.log(response);
      dispatch(slice.actions.getSubmittedFilesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSubmittedFilesByAllGroup() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/saveGroupFiles/showSubmittedFilesByAllGroup');
      console.log(response);
      dispatch(slice.actions.getSubmittedFilesByAllGroupSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getSubmittedFilesByAssignedWork(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/saveGroupFiles/showSubmittedFilesByAssignedWork', {
        id
      });
      console.log('date', response.data);
      dispatch(slice.actions.getAssignedWorkSuccess(response.data[0]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSubmittedFilesByAssignedWorkId(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/saveGroupFiles/showSubmittedFilesByAssignedWorkId', {
        id
      });
      console.log(response);
      dispatch(slice.actions.getSubmittedFilesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// export function getReportsWithAssignedWorkByGroupId(id) {
//   return async (dispatch) => {
//     try {
//       const studentResponse = await axios.post('http://localhost:8080/Student/showStudentByCMS', {
//         id
//       });
//       dispatch(slice.actions.getStudentSuccess(studentResponse.data));
//       dispatch(slice.actions.startLoading());
//       const response = await axios.post('http://localhost:8080/ReportType/showAllReportsWithAssignedWorkByBatch', {
//         id: studentResponse.data.batch_id,
//         group_id: studentResponse.data.group_id
//       });
//       console.log('student', studentResponse.data, 'reportData', response.data);
//       dispatch(slice.actions.getReportDataSuccess(response.data));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
