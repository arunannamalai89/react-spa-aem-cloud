import { RESET_REWARD_CODE, SET_REWARD_CODE } from "../constants";

const INITIAL_STATE = {
  rewardCode: ''
}

//reducer function
const reward = (store = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_REWARD_CODE:
      return {
        ...store,
        rewardCode: action.data.rewardCode
      }
    case RESET_REWARD_CODE:
      return {
        ...store,
        rewardCode: ''
      }
    default:
      return store;
  }
}
export default reward;
