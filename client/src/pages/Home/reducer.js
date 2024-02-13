import { produce } from 'immer';
import { SET_PRODUCTS_DATA } from './constants';

export const initialState = {
  products: [],
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PRODUCTS_DATA:
        draft.products = action.data;
        break;
    }
  });

export default homeReducer;
