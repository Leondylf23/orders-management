import { produce } from 'immer';
import { SET_TICKETS_DATA } from './constants';

export const initialState = {
    tickets: []
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SET_TICKETS_DATA:
                draft.tickets = action.data;
                break;
        }
    });

export default homeReducer;
