import * as types from './types'
export default{
  increment:({commit})=>{
    commit(types.INCREAMENT)
  },
  decrement:({commit})=>{
    commit(types.DECREAMENT)
  },
  clickOdd:({commit,state})=>{
    if(state.mutations.count % 2 ==0){
      commit(types.INCREAMENT)
    }
  },
  clickAsync:({commit,state})=>{
    new Promise((resolve)=>{
      setTimeout(function(){
        commit(types.INCREAMENT);
        resolve();
      },1000)
    })
  }
}
