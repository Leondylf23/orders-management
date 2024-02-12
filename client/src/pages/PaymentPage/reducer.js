import { produce } from 'immer';
import { SET_COUPONS_DATA, SET_PRODUCT_ID, SET_USER_INPUTS } from './constants';

export const initialState = {
    userInputData: null,
    couponsData: [],
    productId: null
};

export const storedKey = [];

const paymentPageReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SET_USER_INPUTS:
                draft.userInputData = action.data;
                break;
            case SET_COUPONS_DATA:
                draft.couponsData = action.data;
                break;
            case SET_PRODUCT_ID:
                draft.productId = action.id;
                break;
        }
    });

export default paymentPageReducer;
