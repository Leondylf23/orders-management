import { produce } from 'immer';
import { SET_BOOKING_DATA, SET_BOOKING_DETAIL_DATA } from './constants';

export const initialState = {
    bookingsData: [],
    bookingDetailData: null
};

export const storedKey = [];

const bookingsReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SET_BOOKING_DATA:
                draft.bookingsData = action.data;
                break;
            case SET_BOOKING_DETAIL_DATA:
                draft.bookingDetailData = action.data;
                break;
        }
    });

export default bookingsReducer;
