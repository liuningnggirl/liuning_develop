<template>
    <div class="cb_ul">
        <div class="cu_content">
            <p class="cc_p_date">{{date}}</p>
            <ul class="list-ul">
                <XingChengTime :isMine="isMine" :obj="item" v-for="item in obj[date]"></XingChengTime>
            </ul>
        </div>
    </div>
</template>

<script>
import XingChengTime from "@/components/XingChengTime"
export default {
  name:"dateList",
  props:["obj","isMine"],
  components:{
      XingChengTime
  },
  data(){
      return{
          date:this.getItemName(1,this.obj)
      }
  }
}
</script>

<style lang="less" scoped>
    .cb_ul{
        padding:0 16px;
        .cu_content{
            .cc_p_date{
                text-align: left;
                color: #999;
                font-size: 13px;
            }
            .list-ul{
                box-shadow: 0 2px 9px 0 rgba(212,212,212,0.50);
                border-radius: 4px;
                overflow: hidden;
            }
        }
    }
</style>




