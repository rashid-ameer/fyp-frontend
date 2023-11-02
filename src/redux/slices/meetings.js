import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  meetingsList: [],
  meeting: []
};

const slice = createSlice({
  name: 'meetings',
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
    getMeetingSuccess(state, action) {
      state.isLoading = false;
      state.meeting = action.payload;
    },

    // DELETE USERS

    // GET MANAGE USERS
    getMeetingListSuccess(state, action) {
      state.isLoading = false;
      state.meetingsList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
// ----------------------------------------------------------------------

export function getMeetingList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Meeting/showAllMeetings');
      console.log('announcement', response.data);
      dispatch(
        slice.actions.getMeetingListSuccess(
          response.data.sort((a, b) => {
            const x = new Date(a.createdAt);
            const y = new Date(b.createdAt);
            return y - x;
          })
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getMeetingListByGroupId(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Meeting/showMeetingByGroupId', {
        group_id: id
      });
      console.log('announcement', response.data);
      dispatch(
        slice.actions.getMeetingListSuccess(
          response.data.sort((a, b) => {
            const x = new Date(a.createdAt);
            const y = new Date(b.createdAt);
            return y - x;
          })
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
