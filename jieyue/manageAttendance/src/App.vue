<template>
  <div id="app">
    <router-view/>
    <transition name="fade">
      <div v-if="rootError" class="chai_box">
        <img :src="require('@/assets/img/img_toast_2@2x.png')" alt="">
        <p>{{errorMsg}}</p>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="rootSuccess" class="del_success_box chai_box">
        <img :src="require('@/assets/img/img_toast_1@2x.png')" alt="">
        <p>{{successMsg}}</p>
      </div>
    </transition>
    <cityPicker :citys="citys" v-if="showCityPicker"></cityPicker>
  </div>
</template>

<script>
import cityPicker from '@/components/cityPicker.vue'
export default {
  name: 'app',
  data(){
    return{
      rootError:false,
      errorMsg:"",
      showCityPicker:false,
      citys:[],
      rootSuccess:false,
      successMsg:""
    }
  },
  components:{
    cityPicker
  },
  created(){
    var that = this;
    that.$root.Bus.$on('showError', value => {
      that.showError(value);
    })
    that.$root.Bus.$on("showCityPicker",function(){
      that.showCityPicker=true;
    });
    that.$root.Bus.$on("hideCityPicker",function(){
      that.showCityPicker=false;
    })
    that.$http.get('../../../static/LocList.json').then(function(ret){
        var data = ret.body;
        that.citys = data;
    })
    that.$root.Bus.$on('showSuccess', value => {
      that.showSuccess(value);
    })
  },
  methods:{
    showError(msg){
        var that = this;
        if(!that.rootError){
            that.rootError=true;
            that.errorMsg=msg;
            setTimeout(function(){
                that.rootError=false
            },2000)
        }
    },
    showSuccess(msg){
        var that = this;
        if(!that.rootSuccess){ 
            that.rootSuccess=true;
            that.successMsg=msg;
            setTimeout(function(){
                that.rootSuccess=false
            },2000)
        }
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
