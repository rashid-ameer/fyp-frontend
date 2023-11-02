import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  departments: [],
  departmentList: []
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

    // GET DEPARTMENT
    getDepartmentSuccess(state, action) {
      state.isLoading = false;
      state.departments = action.payload;
    },

    // DELETE Department
    deleteDepartment(state, action) {
      const deleteUser = filter(state.departmentList, (department) => department.id !== action.payload);
      state.departmentList = this.deleteDepartment;
    },

    // GET MANAGE Departments
    getDepartmentListSuccess(state, action) {
      state.isLoading = false;
      state.departmentList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getDepartmentList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Department/showAllDepartments');
      dispatch(slice.actions.getDepartmentListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------

export function getDepartment() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Department/showAllDepartments');
      dispatch(slice.actions.getDepartmentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
