import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectHomeData = (state) => state.home || initialState;

export const selectProductData = createSelector(selectHomeData, (state) => state.products);
