import { createSelector } from 'reselect';
import { initialState } from '@containers/App/reducer';

const selectTicketCreationState = (state) => state.ticketCreation || initialState;

export const selectMyTicketData = createSelector(selectTicketCreationState, (state) => state.ticketData);
