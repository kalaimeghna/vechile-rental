import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Your notification state and slice code here...

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (item) => item._id === action.payload,
      );

      if (notification) {
        notification.read = true;
      }
    },
  },
});

export const { setNotifications, markAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
