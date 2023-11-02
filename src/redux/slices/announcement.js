import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  announcementList: [],
  notificationList: []
};

const slice = createSlice({
  name: 'announcement',
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
    deleteAnnouncement(state, action) {
      const deleteUser = filter(state.batchList, (batch) => batch.id !== action.payload);
      state.batchList = deleteUser;
    },
    saveAnnouncement(state, action) {
      state.isLoading = false;
    },

    // GET MANAGE USERS
    getAnnouncementListSuccess(state, action) {
      state.isLoading = false;
      state.announcementList = action.payload;
    },
    getAllNotificationtListSuccess(state, action) {
      state.isLoading = false;
      state.notificationList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
export const { deleteAnnouncement } = slice.actions;
// ----------------------------------------------------------------------

export function getAnnouncementList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Announcement/showAllAnnouncements');
      console.log('announcement', response.data);
      dispatch(
        slice.actions.getAnnouncementListSuccess(
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

export function getAnnouncementByBatch(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Announcement/showAnnouncementByBatch', {
        batch_id: id
      });
      console.log('announcement', response.data);
      dispatch(
        slice.actions.getAnnouncementListSuccess(
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

export function getAnnouncementListByStudent(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Notification/showAllNotificationByStudent', {
        id
      });
      console.log(id, 'announcement', response.data);
      dispatch(
        slice.actions.getAnnouncementListSuccess(
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
export function getAllNotifications(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8080/Notification/showAllNotification');
      console.log(id, 'announcement', response.data);
      dispatch(
        slice.actions.getAllNotificationtListSuccess(
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

export function saveNotification(announcementId, userId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:8080/Notification/saveNotification', {
        id: announcementId,
        user_id: userId,
        is_deleted: 0,
        status_viewed: 0
      });
      console.log('notification', response.data);
      dispatch(slice.actions.saveAnnouncement(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateNotificationSetReadStatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    console.log(id);
    try {
      const response = await axios.post('http://localhost:8080/Notification/updateNotificationReadStatus', {
        id
      });
      console.log('notification', response.data);
      dispatch(slice.actions.saveAnnouncement(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
