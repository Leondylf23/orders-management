import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { GET_BOOKING_DATA, GET_BOOKING_DETAIL_DATA, UPDATE_BOOKING_STATUS } from './constants';
import { getBookingDetailApi, getAllBookingsApi, getAllBusinessBookingsApi, getBusinessBookingDetailApi, updateBookingStatusApi } from '@domain/api';
import { setBookingDetailData, setBookingsData } from './actions';

function* doGetBookingData({ isBusiness }) {
    yield put(setLoading(true));

    try {
        const res = yield call(isBusiness ? getAllBusinessBookingsApi : getAllBookingsApi);

        yield put(setBookingsData(res?.data));
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doGetBookingDetailData({ formData, isBusiness }) {
    yield put(setLoading(true));

    try {
        const res = yield call(isBusiness ? getBusinessBookingDetailApi : getBookingDetailApi, formData);

        yield put(setBookingDetailData(res?.data));
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

function* doUpdateBookingStatus({ formData, cb }) {
    yield put(setLoading(true));

    try {
        yield call(updateBookingStatusApi, formData);

        cb();
    } catch (error) {
        yield put(showPopup());
    }

    yield put(setLoading(false));
}

export default function* bookingsSaga() {
    yield takeLatest(GET_BOOKING_DATA, doGetBookingData);
    yield takeLatest(GET_BOOKING_DETAIL_DATA, doGetBookingDetailData);
    yield takeLatest(UPDATE_BOOKING_STATUS, doUpdateBookingStatus);
}
