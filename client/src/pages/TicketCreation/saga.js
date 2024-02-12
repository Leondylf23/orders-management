import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { CREATE_NEW_TICKET, DELETE_TICKET, GET_MY_TICKET_DETAIL, UPDATE_TICKET } from './constants';
import { createNewTicket, deleteTicketApi, getMyTicketDetailApi, updateTicketApi } from '@domain/api';
import { setMyTicketDetail } from './actions';

function* doCreateNewTicket({ formData, cb }) {
    yield put(setLoading(true));

    try {
        const res = yield call(createNewTicket, formData);

        cb(res?.data?.createdId);
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doGetMyTicketDetail({ formData, cbError }) {
    yield put(setLoading(true));

    try {
        const res = yield call(getMyTicketDetailApi, formData);

        yield put(setMyTicketDetail(res?.data));
    } catch (error) {
        cbError();
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doUpdateTicket({ formData, cb }) {
    yield put(setLoading(true));

    try {
        const res = yield call(updateTicketApi, formData);
        yield put(setMyTicketDetail(res?.data?.updatedData));

        cb();
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doDeleteTicket({ formData, cb }) {
    yield put(setLoading(true));

    try {
        yield call(deleteTicketApi, formData);

        cb();
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

export default function* ticketCreationSaga() {
    yield takeLatest(CREATE_NEW_TICKET, doCreateNewTicket);
    yield takeLatest(GET_MY_TICKET_DETAIL, doGetMyTicketDetail);
    yield takeLatest(UPDATE_TICKET, doUpdateTicket);
    yield takeLatest(DELETE_TICKET, doDeleteTicket);
}
