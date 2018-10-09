import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

var state ={
  count:10
};

const mutations ={//这里就处理一个函数，处理数据的变化
  increment(state){
    state.count++;
  },
  decrement(state){//变化状态
    state.count--;
  }
};

const actions={//管理动作
  increment:({commit})=>{//处理你要干什么，异步请求，判断，流程控制
    commit('increment')//commit 给了mutations
  },
  decrement:({commit})=>{//返回对象中包含commit   ->解构
    commit('decrement')
  },
  clickOdd:({commit,state})=>{
    if(state.count%2==0){
      commit('increment')
    }
  },
  clickAsync:({commit})=>{
    new Promise((resolve)=>{
      setTimeout(function(){
        commit('increment');
        resolve();
      },1000)
    })
  }
};

const getters={
  count(state){
    return state.count
  },
  getOdd(state){
    return state.count % 2 ==0?'偶数':'奇数'
  }
}

//需要导出store对象
export default new Vuex.Store({
  actions,
  state,
  mutations,
  getters
})
