import { OPEN_MODAL, CLOSE_MODAL } from "../constants";
const initialState = {
  modalActive: false
}

// reducer function
const modal = (store = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        modalActive: true
      }
    case CLOSE_MODAL:
      return {
        modalActive: false
      }
    default:
      return store;
  }
}

export default modal;