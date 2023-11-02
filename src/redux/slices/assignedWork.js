import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  assignedWorkList: []
};

const slice = createSlice({
  name: 'assignedWork',
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
    getAssignedWorkSuccess(state, action) {
      state.isLoading = false;
      state.batch = action.payload;
    },

    // DELETE USERS
    deleteAssignedWork(state, action) {
      const deleteUser = filter(state.batchList, (batch) => batch.id !== action.payload);
      state.assignedWorkList = deleteUser;
    },
    saveAnnouncement(state, action) {
      state.isLoading = false;
    },

    // GET MANAGE USERS
    getAssignedWorkListSuccess(state, action) {
      state.isLoading = false;
      state.assignedWorkList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
export const { deleteAssignedWork } = slice.actions;
// ----------------------------------------------------------------------

export function getAssignedWorkList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/AssignedWork/showAllAssignedWork');
      console.log('assignedWork', response.data);
      dispatch(slice.actions.getAssignedWorkListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getAssignedWorkByBatch(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/AssignedWork/showAssignedWorkByBatch', {
        batch_id: id
      });
      console.log('assignedWork', response.data);
      dispatch(slice.actions.getAssignedWorkListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
