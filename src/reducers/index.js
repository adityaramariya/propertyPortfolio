import { combineReducers } from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr'
import {
    Set_Header_Link_Data
   } from '../actions';

function headerLinkData(state = [], action) {
    switch (action.type) {
        case Set_Header_Link_Data:
            return action.data;
        default:
            return state;
    }
};



const rootReducer = combineReducers({
    state: (state = {}) => state,
    toastr: toastrReducer,
    headerLinkData
    });

export default rootReducer;
