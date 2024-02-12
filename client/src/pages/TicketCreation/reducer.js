import { produce } from 'immer';
import { SET_MY_TICKET_DETAIL } from './constants';

export const initialState = {
    ticketData: null
};

export const storedKey = [];

const ticketCreationReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SET_MY_TICKET_DETAIL:
                draft.ticketData = action.data;
                break;
        }
    });

export default ticketCreationReducer;
