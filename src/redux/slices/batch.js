import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  batch: [],
  batchesList: [],
  studentList: []
};

const slice = createSlice({
  name: 'batch',
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
    getBatchSuccess(state, action) {
      state.isLoading = false;
      state.batch = action.payload;
    },

    // DELETE USERS
    deleteBatch(state, action) {
      const deleteUser = filter(state.batchList, (batch) => batch.id !== action.payload);
      state.batchesList = deleteUser;
    },

    // GET MANAGE USERS
    getBatchListSuccess(state, action) {
      state.isLoading = false;
      state.batchesList = action.payload;
    },
    getStudentsSuccess(state, action) {
      state.isLoading = false;
      state.studentList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
export const { deleteBatch } = slice.actions;
// ----------------------------------------------------------------------

export function getBatchesList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Batch/showAllBatches');
      dispatch(slice.actions.getBatchListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getBatch(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Batch/showBatchById', {
        id
      });
      dispatch(slice.actions.getBatchSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getStudentByBatch(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    console.log('id', id);
    try {
      const response = await axios.post('http://localhost:8080/Batch/showStudentByBatch', {
        id
      });
      console.log('batch', response.data);
      dispatch(slice.actions.getStudentsSuccess(response.data.students));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAllStudent() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Student/showAllStudents');
      console.log('batch', response.data);
      dispatch(slice.actions.getStudentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
