import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  roles: [],
  roleList: []
};

const slice = createSlice({
  name: 'role',
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

    // GET ROLE
    getRolesSuccess(state, action) {
      state.isLoading = false;
      state.roles = action.payload;
    },

    // DELETE roles
    deleteRole(state, action) {
      const deleteRole = filter(state.roleList, (role) => role.id !== action.payload);
      state.roleList = deleteRole;
    },

    // GET  Roles List
    getRoleListSuccess(state, action) {
      state.isLoading = false;
      state.roleList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { deleteRole } = slice.actions;

// ----------------------------------------------------------------------

export function getRoleList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Role/showAllRoles');
      dispatch(slice.actions.getRoleListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRoles() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Role/showAllRoles');
      dispatch(slice.actions.getRolesSuccess(response.data.roles));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
