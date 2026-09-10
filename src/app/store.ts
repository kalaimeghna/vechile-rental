import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import vehicleReducer from "../redux/vehicle/vehicleSlice";
import bookingReducer from "../redux/booking/bookingSlice";
import favoriteReducer from "../redux/favorite/favoriteSlice";
import notificationReducer from "../redux/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicle: vehicleReducer,
    booking: bookingReducer,
    favorite: favoriteReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
