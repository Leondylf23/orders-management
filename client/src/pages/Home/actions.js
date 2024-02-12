import { GET_MY_TICKETS_DATA, GET_TICKETS_DATA, SET_TICKETS_DATA } from "./constants";

export const getTicketsData = (formData) => ({
    type: GET_TICKETS_DATA,
    formData
});

export const getMyTicketsData = (formData) => ({
    type: GET_MY_TICKETS_DATA,
    formData
});

export const setTicketsData = (data) => ({
    type: SET_TICKETS_DATA,
    data
});