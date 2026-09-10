import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Vehicle } from "../../types/vehicle";

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,

  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
      state.error = null;
    },

    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
    },

    setVehicleLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setVehicleError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearVehicles: (state) => {
      state.vehicles = [];
      state.selectedVehicle = null;
      state.error = null;
    },

    clearVehicleError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setVehicles,
  setSelectedVehicle,
  setVehicleLoading,
  setVehicleError,
  clearVehicles,
  clearVehicleError,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
