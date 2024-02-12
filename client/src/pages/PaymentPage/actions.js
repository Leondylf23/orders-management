import { GET_COUPONS_DATA, SEND_BOOKING_DATA, SET_COUPONS_DATA, SET_PRODUCT_ID, SET_USER_INPUTS } from "./constants";

export const setUserInputs = (data) => ({
    type: SET_USER_INPUTS,
    data
});

export const getCouponsData = (formData) => ({
    type: GET_COUPONS_DATA,
    formData
});

export const setCouponsData = (data) => ({
    type: SET_COUPONS_DATA,
    data
});

export const setProductId = (id) => ({
    type: SET_PRODUCT_ID,
    id
});

export const sendBookingData = (formData, cb) => ({
    type: SEND_BOOKING_DATA,
    formData,
    cb
});

