import { takeLatest, call, put } from 'redux-saga/effects';

import { showPopup, setLoading } from '@containers/App/actions';
import { GET_COUPONS_DATA, SEND_BOOKING_DATA } from './constants';
import { createBookingApi, getAllCouponsByTicketId } from '@domain/api';
import { decryptDataAES } from '@utils/allUtils';
import { setCouponsData } from './actions';

function* doGetCouponDatas({ formData }) {
    yield put(setLoading(true));
    try {
        const res = yield call(getAllCouponsByTicketId, formData);
        const decryptPrice = res?.data?.map(coupon => ({
            ...coupon,
            priceCut: parseFloat(decryptDataAES(coupon?.priceCut))
        }));

        yield put(setCouponsData(decryptPrice));
    } catch (error) {
        yield put(showPopup());
    }
    yield put(setLoading(false));
}

function* doSendBookingData({ formData, cb }) {
    yield put(setLoading(true));
    try {
        yield call(createBookingApi, formData);
        
        cb();
    } catch (error) {
        yield put(showPopup());
    }
    yield put(setLoading(false));
}

export default function* paymentPageSaga() {
    yield takeLatest(GET_COUPONS_DATA, doGetCouponDatas);
    yield takeLatest(SEND_BOOKING_DATA, doSendBookingData);
}
