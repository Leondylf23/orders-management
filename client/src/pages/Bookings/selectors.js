import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectBookingState = (state) => state.bookings || initialState;

export const selectBookingData = createSelector(selectBookingState, (state) => state.bookingsData);
export const selectBookingDetailData = createSelector(selectBookingState, (state) => state.bookingDetailData);