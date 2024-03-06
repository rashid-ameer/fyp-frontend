import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  success: false,
  committees: [],
  committee: {},
  groupsUnderCommittee: [],
  committeeDetails: {}
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

    // COMMITTEE CREATED SUCCESSFULLY
    committeCreateSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    // GET COMMITTEE SUCCESSFULLY
    getCommitteesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.committees = action.payload;
    },
    // GET COMMITTEE SUCCESS
    getCommitteeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.committee = action.payload;
    },

    // UPDATE COMMITTEE SUCCESS
    updateCommitteeSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    // GET PROJECTS UNDER COMMITTEE SUCCESS
    getProjectsUnderCommitteeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.groupsUnderCommittee = action.payload;
    },
    getCommitteeDetailsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.committeeDetails = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function createCommittee(committeeObj) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Committee/createCommittee', committeeObj);
      dispatch(slice.actions.committeCreateSuccess());
      return true;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get all the committees
export function getAllCommittees() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Committee/getAllCommittees');
      dispatch(slice.actions.getCommitteesSuccess(response.data));
      return true;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get a single  committe by id
export function getCommitteeById(committeeId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.post('http://localhost:8080/Committee/getCommittee', {
        committee_id: committeeId
      });

      dispatch(slice.actions.getCommitteeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// update a single committee
export function updateCommittee(committee) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.put(`http://localhost:8080/Committee/updateCommittee/${committee.id}`, {
        supervisors: committee.supervisors,
        groups: committee.groups
      });
      dispatch(slice.actions.updateCommitteeSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get groups under committee
export function getGroupsUnderCommittee(supervisorId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Committee/getProjectsUnderCommittee', {
        supervisor_id: supervisorId
      });
      dispatch(slice.actions.getProjectsUnderCommitteeSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

// get single committee details
export function getCommitteeDetails(committeId) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await axios.post('http://localhost:8080/Committee/getCommitteeDetails', {
        committee_id: committeId
      });

      dispatch(slice.actions.getCommitteeDetailsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
