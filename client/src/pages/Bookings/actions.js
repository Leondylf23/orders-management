import { GET_BOOKING_DATA, GET_BOOKING_DETAIL_DATA, SET_BOOKING_DATA, SET_BOOKING_DETAIL_DATA, UPDATE_BOOKING_STATUS } from "./constants";

export const getBookingsData = (isBusiness) => ({
    type: GET_BOOKING_DATA,
    isBusiness
});

export const setBookingsData = (data) => ({
    type: SET_BOOKING_DATA,
    data
});

export const getBookingDetailData = (formData, isBusiness) => ({
    type: GET_BOOKING_DETAIL_DATA,
    formData,
    isBusiness
});

export const setBookingDetailData = (data) => ({
    type: SET_BOOKING_DETAIL_DATA,
    data
});

export const updateBookingStatus = (formData, cb) => ({
    type: UPDATE_BOOKING_STATUS,
    formData,
    cb
});