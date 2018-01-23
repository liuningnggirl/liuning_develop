<template>
	<div class="mine-page content_box">
    <div class="cb_message_content">
      <div class="cb_message">
        <div class="ta_left">
          <img src="../assets/img/default_img.png" alt="">
        </div>
        <div class="ta_center">
          <p class="tc_name">曹治强</p>
          <p class="tc_type">资产管理经理</p>
        </div>
        <div class="ta_right">
          <p class="tr_status chai">出差</p>
        </div>
      </div>
    </div>
    <div class="cu_content_box" id="pullrefresh" data-pulltorefresh="1">
      <div class="cb_ul mui-table-view mui-table-view-chevron"><li class="mui-table-view-cell"><div class="cb_ul"><div class="cu_content">
        <p class="cc_p_date">2017-11-02</p>
        <ul class="list-ul"><li class="list-li" delflag="1" cid="2606">
          <div class="ul_li_content border">
            <div class="cc_status chai_date">出差</div>
            <div class="cc_date">10:30</div>
            <div class="cc_box">
              <div class="cc_where"><span>海外 巴布亚新几内亚</span></div>                        <div class="cc_reason"><span>海外将大家可拉风姐弟恋伐大家</span></div>                    </div>
          </div>
          <div class="btn" style="height: 131px; line-height: 131px;">删除</div>                </li><li class="list-li" delflag="1" cid="2605">
          <div class="ul_li_content border">
            <div class="cc_status another_date">其他</div>
            <div class="cc_date">10:29</div>
            <div class="cc_box">
            </div>
          </div>
          <div class="btn" style="height: 79px; line-height: 79px;">删除</div>                </li><li class="list-li" delflag="1" cid="2604">
          <div class="ul_li_content">
            <div class="cc_status leave_date">休假</div>
            <div class="cc_date">10:29</div>
            <div class="cc_box">
            </div>
          </div>
          <div class="btn" style="height: 78px; line-height: 78px;">删除</div>                </li></ul>
      </div></div></li><li class="mui-table-view-cell"><div class="cb_ul"><div class="cu_content">
        <p class="cc_p_date">2017-11-01</p>
        <ul class="list-ul"><li class="list-li" delflag="0" cid="2590">
          <div class="ul_li_content">
            <div class="cc_status normal_date">正常</div>
            <div class="cc_date">14:56</div>
            <div class="cc_box">
            </div>
          </div>
        </li></ul>
      </div></div></li></div>
      <div class="mui-pull-bottom-tips"><div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading"></span></div></div></div>
    <div class="footer-box">
      <div class="box-item" @click="showPanelIndex">
        <span>首页</span>
      </div>
      <div class="center-button">
        <img @click="" src="../assets/img/check_in_white.png" alt="">
      </div>
      <div class="box-item">
        <span>我的</span>
      </div>
    </div>

  </div>
</template>

<script>
	import { required,numeric } from 'vuelidate/lib/validators'
	import { Popup } from 'mint-ui';
	export default {
		name:"",
		components:{

		},
		methods:{
      showPanelIndex:function(){
        //this.$router.push({path:'/Index', query: {employeeid: data.responseBody.returnparam.employeeid}});
        this.$router.push({path:'/Index'});
      }
		}
	}
</script>

<style lang="less" scoped>
  body{ background:#FBFCFF;}
  img[src=""]{
    opacity: 0;
  }
  /*模糊_start*/
  .filter{filter:blur(30px);  -webkit-filter:blur(30px);  -moz-filter:blur(30px);  -ms-filter:blur(30px);  -o-filter:blur(30px);}
  /*模糊_end*/

  .cb_message{ padding: 16px 15px;  background: #fff;  box-sizing: border-box;  overflow: hidden;  box-shadow: 0 2px 4px 0 rgba(212,212,212,0.50);  border-radius: 1px;  position: relative; width:100%;margin: 15px 0;}
  .cb_message .ta_left img{ width:52px;height:52px; border-radius:5px; border:none; display: inline-block; outline: none; }
  .cb_message .ta_left{border:none;margin:0 15px 0 0;}
  .cb_message .ta_right{float:right;text-align: right;margin-top: -16px;}
  .cb_message .ta_center .tc_name{font-size:20px; color:#333;text-align:left;margin: -5px 0 0 0;}
  .cb_message .ta_center .tc_type{font-size:14px; color:#999; margin: 10px 0 0 0;}
  .cb_message .ta_right .tr_status{font-size:14px;position: relative;}
  .cb_message .ta_right .tr_day_num{font-size:14px;margin: 16px 0 0 0;}
  .cb_message div{float:left;}
  .cb_message .ta_core{ width:18px; position:absolute;top:0px;right:0px;}

  /*顶部圆点颜色_start*/
  .normal{ color:#0C97ED;}
  .normal:before{content:"";display:inline-block; width:7px; height:7px; background:#0C97ED;border-radius:50%;position: absolute; right: 40px;  top: 6px;}
  .leave{ color:#FF5156;}
  .leave:before{content:"";display:inline-block; width:7px; height:7px; background:#FF5156;border-radius:50%;position: absolute; right: 40px;  top: 6px;}
  .another{ color:#C6CACB;}
  .another:before{content:"";display:inline-block; width:7px; height:7px; background:#C6CACB;border-radius:50%;position: absolute; right: 40px;  top: 6px;}
  .goout{ color:#FFB10A;}
  .goout:before{content:"";display:inline-block; width:7px; height:7px; background:#FFB10A;border-radius:50%;position: absolute; right: 40px;  top: 6px;}
  .chai{ color:#0CB3B0;}
  .chai:before{content:"";display:inline-block; width:7px; height:7px; background:#0CB3B0;border-radius:50%;position: absolute; right: 40px;  top: 6px;}
  /*顶部圆点颜色_start*/

  .con .no_content img{ width: 50%; display: block; margin: 50% auto;}
  .cu_content .cc_p_date{ color:#999; font-size:13px;margin: 0 0 6px 0;}
  .content_box .cb_ul{box-sizing:border-box;z-index:1;background: #FBFCFF;}
  .content_box .mui-table-view-cell{ padding:0 15px; box-sizing:border-box;z-index:1;}
  .content_box .cb_ul .cu_content{ margin:0 0 25px 0;}
  .content_box .cb_ul .cu_content ul li .cc_status{font-size:16px; color:#333; float:left; position: relative;}
  .content_box .cb_ul .cu_content ul li .cc_status:before{ content:""; width:7px; height:7px;border-radius:50%; background:#0C97ED; display:inline-block;position: absolute; left: -17px;  top: 7px;}
  .content_box .cb_ul .cu_content ul li .cc_date{font-size:13px; color:#999; float:right; margin-top: 6px;}
  .content_box .cb_ul .cu_content ul li .cc_reason,.content_box .cb_ul .cu_content ul li .cc_where{font-size:13px; color:#B7B7B7;clear:both; position: relative; margin: 10px 0 0 0; }
  .content_box .cb_ul .cu_content ul li .cc_where{ margin:10px 0 0 0;}
  .content_box .cb_ul .cu_content ul li .cc_reason:before{    background:url("../assets/img/img_icon_action@2x.png") no-repeat; background-size:100%;  content: "";  width:12px;  height: 12px;  display: inline-block;  position: absolute;  left: -19px;  top: 3px;}
  .content_box .cb_ul .cu_content ul li .cc_where:before{    background:url("../assets/img/img_icon_laction@2x.png") no-repeat; background-size:100%;  content: "";  width:12px;  height: 12px;  display: inline-block;  position: absolute;  left: -19px;  top: 3px;}
  .content_box .cb_ul .cu_content ul li{ box-sizing:border-box;padding: 0 0 0 15px; }
  .content_box .cb_ul .cu_content ul li .ul_li_content{padding: 24px 15px 24px 25px; overflow:hidden;}
  .content_box .cb_ul .cu_content ul{box-shadow: 0 2px 9px 0 rgba(212,212,212,0.50); border-radius: 4px;overflow: hidden; -webkit-overflow-scrolling: touch;}
  .content_box .cb_ul .cu_content ul li .border{border-bottom: 1px solid #EFEFEF;}
  .none_message img{ width:50%;}
  .none_message{ margin:62% 0 0 0; text-align:center;}
  .none_message p{ font-size:15px; color:#666; margin:5.4% 0 0 0;}
  .cb_message_content{ background: #FBFCFF; overflow: hidden; position:fixed; top:0px; left:4%; width:92%;z-index:2;}
  .content_box .cb_ul .cu_content ul li .cc_box{ margin-top: 30px;clear:both;}

  /*列表颜色_start*/
  .content_box .cb_ul .cu_content ul li .normal_date{ color:#0C97ED;padding-top: 5px;}
  .content_box .cb_ul .cu_content ul li .normal_date:before{ content:""; width:7px; height:7px;border-radius:50%;display:inline-block;position: absolute; left: -17px;  top: 11px;  background:#0C97ED;}
  .content_box .cb_ul .cu_content ul li .leave_date{ color:#FF5156;}
  .content_box .cb_ul .cu_content ul li .leave_date:before{ background:#FF5156; content:""; width:7px; height:7px;border-radius:50%;display:inline-block;position: absolute; left: -17px;  top: 7px; }
  .content_box .cb_ul .cu_content ul li .another_date{ color:#C6CACB;}
  .content_box .cb_ul .cu_content ul li .another_date:before{background:#C6CACB; content:""; width:7px; height:7px;border-radius:50%;display:inline-block;position: absolute; left: -17px;  top: 7px; }
  .content_box .cb_ul .cu_content ul li .goout_date{ color:#FFB10A;}
  .content_box .cb_ul .cu_content ul li .goout_date:before{background:#FFB10A; content:""; width:7px; height:7px;border-radius:50%;display:inline-block;position: absolute; left: -17px;  top: 7px; }
  .content_box .cb_ul .cu_content ul li .chai_date{ color:#0CB3B0;}
  .content_box .cb_ul .cu_content ul li .chai_date:before{background:#0CB3B0; content:""; width:7px; height:7px;border-radius:50%;display:inline-block;position: absolute; left: -17px;  top: 7px; }
  /*列表颜色_end*/

  .cb_status{ padding:14px 0; background:#51BBFF; text-align:center;}
  .cb_status img{ width:17px;animation: rotating .8s linear infinite;}
  .cu_content_box{ overflow:hidden;height:100%; text-align: left;}
  .list-ul {
    overflow: hidden
  }

  .list-li {
    border-bottom: 1px solid #fcfcfc;
    position: relative;
    padding: 0 12px;
    color: #666;
    transform:translateX(0px);
    -ms-transform:translateX(0px);	/* IE 9 */
    -moz-transform:translateX(0px);/* Firefox */
    -webkit-transform:translateX(0px);/* Safari 和 Chrome */
    -o-transform:translateX(0px);
  }
  .li-translateX{
    transform:translateX(-80px);
    -ms-transform:translateX(-80px);	/* IE 9 */
    -moz-transform:translateX(-80px);/* Firefox */
    -webkit-transform:translateX(-80px);/* Safari 和 Chrome */
    -o-transform:translateX(-80px);
  }

  .btn {
    position: absolute;
    top: 0;
    right: -80px;
    text-align: center;
    background: #ffcb20;
    color: #fff;
    width: 80px
  }
  html,body{ overflow-y: scroll; overflow-x: hidden;}

  .del_success_box{ display: none; text-align: center; width:150px; height:100px;background: #FFFFFF; box-shadow: 0 2px 24px 0 rgba(18,24,53,0.16); border-radius: 6px; position:fixed; top:40%; left:50%; margin-left:-75px;z-index:999;  }
  .del_success_box img{ width:64px;}
  .del_success_box p{ font-size: 14px; color: #51BBFF;  letter-spacing: -0.11px;}


  .mui-table-view-cell {
    position: relative;
    -webkit-touch-callout: none;}
  .mui-table-view-cell {
    position: relative;
    overflow: hidden;
    padding: 0px;
    -webkit-touch-callout: none;
  }
  .mui-table-view-cell:after,.mui-table-view-cell:after,.mui-table-view-cell:after, .mui-table-view-cell:after,.mui-table-view:before,.mui-table-view:after {
    height: 0px;
  }
  .mui-table-view-cell.mui-active{background:#fff;}
  .cu_content_box{ padding-top:125px;}
  .mui-pull-bottom-tips {
    margin-bottom: 70px;
  }
  .footer-box{
    box-shadow: 0 0 0 1px #f1f1f1;
    background:white;
    z-index: 1;
    position: fixed;
    bottom:0;
    width:100%;
    height: 45px;
    line-height: 45px;
    display: flex;
    .center-button{
      height: 50px;
      width:42px;
      position: relative;
      img{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        margin: auto;
        top: -12px;
      }
    }
    .box-item{
      flex:1;
    }
  }

</style>


