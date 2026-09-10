import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Booking } from "../../types/booking";

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },

    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },

    setBookingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setBookings, setSelectedBooking, setBookingLoading } =
  bookingSlice.actions;

export default bookingSlice.reducer;
