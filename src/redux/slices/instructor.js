import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  users: [],
  userList: [],
  availableSupervisorsForCommittee: []
};

const slice = createSlice({
  name: 'instructor',
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
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // DELETE USERS
    deleteUser(state, action) {
      const deleteUser = filter(state.userList, (user) => user.id !== action.payload);
      state.userList = deleteUser;
    },
    // GET MANAGE USERS
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },
    // GET THE SUPERVISORS WHO ARE NOT COMMITEE MEMBERS
    getAvailableSupervisorsForCommitteeSuccess(state, action) {
      state.isLoading = false;
      state.availableSupervisorsForCommittee = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { deleteUser } = slice.actions;
// ----------------------------------------------------------------------

export function getInstructorList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Supervisor/showAllSupervisors');
      console.log('datasupervisor', response.data);
      dispatch(slice.actions.getUserListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getInstructor(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Supervisor/showSupervisorByINS', {
        user_name: id
      });
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------
// GET THOSE INSTRUCTORS WHO ARE NOT COMMITTEE MEMBERS
export function getAvailableSupervisorsForCommittee(id) {
  console.log('id', id);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`http://localhost:8080/Supervisor/getAvailableSupervisorsForCommittee/${id}`);

      dispatch(slice.actions.getAvailableSupervisorsForCommitteeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
