import { CREATE_NEW_TICKET, DELETE_TICKET, GET_MY_TICKET_DETAIL, SET_MY_TICKET_DETAIL, UPDATE_TICKET } from "./constants";

export const getMyTicketDetail = (formData, cbError) => ({
    type: GET_MY_TICKET_DETAIL,
    formData,
    cbError
});

export const setMyTicketDetail = (data) => ({
    type: SET_MY_TICKET_DETAIL,
    data
});

export const createNewTicket = (formData, cb) => ({
    type: CREATE_NEW_TICKET,
    formData,
    cb
});

export const updateTicket = (formData, cb) => ({
    type: UPDATE_TICKET,
    formData,
    cb
});

export const deleteTicket = (formData, cb) => ({
    type: DELETE_TICKET,
    formData,
    cb
});