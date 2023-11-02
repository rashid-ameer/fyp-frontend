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
  reportTypeList: [],
  student: [],
  reportData: []
};

const slice = createSlice({
  name: 'reportType',
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

    getStudentSuccess(state, action) {
      state.isLoading = false;
      state.student = action.payload;
    },
    // DELETE USERS
    deleteReport(state, action) {
      const deleteUser = filter(state.batchList, (batch) => batch.id !== action.payload);
      state.batchList = deleteUser;
    },

    // GET MANAGE USERS
    getReportTypeListSuccess(state, action) {
      state.isLoading = false;
      state.reportTypeList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
export const { deleteReport } = slice.actions;
// ----------------------------------------------------------------------

export function getReportTypeList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/ReportType/showAllReports');
      console.log('report_tpes', response.data);
      dispatch(slice.actions.getReportTypeListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getReportType(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/ReportType/showReportById', {
        id
      });
      dispatch(slice.actions.getReportTypeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getReportsWithAssignedWorkByGroupId(id) {
  return async (dispatch) => {
    try {
      const studentResponse = await axios.post('http://localhost:8080/Student/showStudentByCMS', {
        id
      });
      dispatch(slice.actions.getStudentSuccess(studentResponse.data));
      dispatch(slice.actions.startLoading());
      const response = await axios.post('http://localhost:8080/ReportType/showAllReportsWithAssignedWorkByBatch', {
        id: studentResponse.data.batch_id,
        group_id: studentResponse.data.group_id
      });
      console.log('student', studentResponse.data, 'reportData', response.data);
      dispatch(slice.actions.getReportDataSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
