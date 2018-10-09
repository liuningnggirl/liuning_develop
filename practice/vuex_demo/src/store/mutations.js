import {
  DECREAMENT,
  INCREAMENT
} from "./types"
import getters from './getters'

const state = {
  count:10
}

const mutations = {
  [INCREAMENT](state){
    state.count ++;
  },
  [DECREAMENT](state){
    state.count --;
  }
}

export default {
  state,
  mutations,
  getters
}
