import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  group: [],
  groupList: [],
  groupAttendance: [],
  groupsWithoutCommittee: []
};

const slice = createSlice({
  name: 'group',
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

    // GET GROUPS BY BATCH WITHOUT COMMITTEE
    getGroupsWithoutCommitteeSuccess(state, action) {
      state.isLoading = false;
      state.groupsWithoutCommittee = action.payload;
    },
    // GET USERS
    getGroupSuccess(state, action) {
      state.isLoading = false;
      state.group = action.payload;
    },
    saveGroupSuccess(state, action) {
      state.isLoading = false;
      state.group = action.payload;
    },

    // DELETE USERS
    deleteGroup(state, action) {
      const deleteGroupList = filter(state.groupList, (gr) => gr.id !== action.payload);
      state.groupList = deleteGroupList;
    },

    // GET MANAGE USERS
    getGroupListSuccess(state, action) {
      state.isLoading = false;
      state.groupList = action.payload;
    },

    getGroupAttendanceSuccess(state, action) {
      state.isLoading = false;
      state.groupAttendance = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { deleteGroup } = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getGroupList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Group/showAllGroups');
      console.log('groupsData', response.data[0].students[0].user.name);
      dispatch(slice.actions.getGroupListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getGroupByBatch(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showGroupsByBatch', {
        batch_id: id
      });
      dispatch(slice.actions.getGroupListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getGroupUnderSupervision(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showAllGroupsUnderSupervisions', {
        supervisor_id: id
      });
      dispatch(slice.actions.getGroupListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function showAllGroupsUnderSupervisionsByBatch(supervisorId, batchId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showAllGroupsUnderSupervisionsByBatch', {
        supervisor_id: supervisorId,
        batch_id: batchId
      });
      dispatch(slice.actions.getGroupListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getGroupUnderSupervisionByBatch(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showGroupsByBatch', {
        batch_id: id
      });
      dispatch(slice.actions.getGroupListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showGroupById', {
        id
      });
      console.log('group', response.data);
      dispatch(slice.actions.getGroupSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getGroupAttendance(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showGroupAttendanceById', {
        id
      });
      console.log('group', response.data);
      dispatch(slice.actions.getGroupAttendanceSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function SaveGroup(values) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/saveGroup', {
        project_title: values.title,
        groupStatus: 0,
        is_deleted: 0
      });
      dispatch(slice.actions.saveGroupSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updateMembers(username, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/updateMember', {
        group_id: id,
        user_name: username
      });
      dispatch(slice.actions.saveGroupSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function showGroupsByBatchWithoutCommittee(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Group/showGroupsByBatchWithoutCommittee', {
        batch_id: id
      });
      dispatch(slice.actions.getGroupsWithoutCommitteeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
