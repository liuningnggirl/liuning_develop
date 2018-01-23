<template>
    <div class="global-mask">
        <div class="pick-title"><span @click="returnRet">确定</span></div>
        <mt-picker class="cityPicker" 
        value-key="name" 
        :slots="slots" 
        @change="onValuesChange"
        ></mt-picker>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                slots: [
                    {
                        flex: 1,
                        values:this.citys,
                        className: 'slot1',
                        textAlign: 'center',
                        valueKey:"name",
                        Slot:"省"
                    }, {
                        flex: 1,
                        values:[],
                        className: 'slot2',
                        textAlign: 'center',
                        valueKey:"name",
                        name:"市"
                    }
                ],
                province:"",
                city:""
            };
        },
        props:["citys"],
        methods:{
            onValuesChange(picker, values) {
                if (values[0]==undefined) {
                    setTimeout(() => { 
                        picker.setSlotValue(0, this.citys[0]);
                        picker.setSlotValue(1, this.citys[0].children[0]);
                    }, 10);
                }
                var that = this;
                picker.slots["1"].values=values[0]==undefined?this.citys[0].children:values[0].children;
                this.province = values[0]?values[0].name:"北京";
                this.city = values[1]?values[1].name:"东城区";
            },
            returnRet(){
                this.$root.Bus.$emit("updateCitys",{province:this.province,city:this.city})
            }
        }
    }
    
</script>

<style lang="less" scoped>
    .pick-title{
        position: absolute;
        bottom:181px;
        width:100%;
        background:white;
        height:40px;
        line-height: 40px;
        color:#0f90f9;
        span{
            float:right;
            margin-right:20px;
        }
    }
    .cityPicker{
        background:white;
        position: fixed;
        bottom:0;
        left:0;
        width:100%;
        border-top:1px solid #e1e1e1;
    }
</style>


