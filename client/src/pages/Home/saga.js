import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { GET_MY_TICKETS_DATA, GET_TICKETS_DATA } from './constants';
import { getAllTickets, getMyAllTickets } from '@domain/api';
import { setTicketsData } from './actions';

function* doGetTicketData({ formData }) {
    yield put(setLoading(true));

    try {
        const res = yield call(getAllTickets, formData);
        yield put(setTicketsData(res?.data));
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doGetMyTicketData({ formData }) {
    yield put(setLoading(true));
    
    try {
        const res = yield call(getMyAllTickets, formData);
        yield put(setTicketsData(res?.data));
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

export default function* homeSaga() {
    yield takeLatest(GET_TICKETS_DATA, doGetTicketData);
    yield takeLatest(GET_MY_TICKETS_DATA, doGetMyTicketData);
}
