import { createStore, combineReducers } from "redux";

import modal from './reducers/modal';
import reward from "./reducers/reward";

const reducers = combineReducers({ modal, reward });

export default createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());