import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectTicketDetailState = (state) => state.ticketDetail || initialState;

export const selectTicketDetail = createSelector(selectTicketDetailState, (state) => state.productData);
