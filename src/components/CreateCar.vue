<template>
  <div class="container">
    <van-nav-bar class="title" title="新建车辆" />

    <van-panel title="车辆信息">
      <van-cell-group>
       <van-field v-model="car.licensenum" center clearable label="牌照号" placeholder="请输入或识别牌照号">
         <van-button slot="button" size="small" type="primary">智能识别</van-button>
       </van-field>
       <van-field v-model="car.vin" center clearable label="底盘号" placeholder="请输入底盘号">
       </van-field>
        <van-field v-model="car.engineno" center clearable label="发动机号" placeholder="请输入底盘号">
       </van-field>
       <van-cell title="车型" @click="onShowDateSelect()" :value="order.carmodel">
         <van-icon slot="right-icon" name="search" class="custom-icon" />
       </van-cell>
       <van-cell title="领证日期" @click="onShowDateSelect()" :value="order.register_date">
         <van-icon slot="right-icon" name="search" class="custom-icon" />
       </van-cell>
      </van-cell-group>
    </van-panel>

    <van-panel title="客户信息">
      <van-cell-group>
       <van-field v-model="car.custno" center clearable label="客户号" placeholder="请输入或选择客户号">
         <van-button slot="button" size="small" type="primary" @click="onShowCust()">选择</van-button>
       </van-field>
       <van-field v-model="car.custname" center clearable label="客户名称" placeholder="请输入客户名称"/>
       <van-field v-model="car.contact" center clearable label="联系人" placeholder="请输入客户名称"/>  
       <van-field v-model="car.mobile" center clearable label="联系电话" placeholder="请输入联系电话"/>  
       <van-field v-model="car.idnum" center clearable label="身份证号" placeholder="请输入身份证号"/>  
       <van-field v-model="car.address" center clearable label="联系地址" placeholder="请输入联系地址"/>  
      </van-cell-group>
    </van-panel>

    <van-popup v-model="show" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择领证日期"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateSelect"
      @cancel="onDateCancel"
     />
    </van-popup>

   <van-popup v-model="showCust" position="right" :overlay="true">
    <van-search v-model="searchCustWord"
    placeholder="请输入搜索关键词"
    @search="onSearchCust"
    @cancel="onSearchCustCancel" />

  <van-row>
    <van-col span="8"><van-cell value="客户号" /></van-col>
    <van-col span="12"><van-cell value="客户名称" /></van-col>
  </van-row>

   <van-list
     v-model="loading"
     :finished="finished"
     finished-text="没有更多了"
     @load="getBalance"
   >
   <van-row v-for="(item, index) in balances" :key="index">
    <van-col span="8"><van-cell :title="item.itemno" /></van-col>
    <van-col span="12"><van-cell :title="item.itemname"  /></van-col>
    <van-col span="4"><van-checkbox v-model="item.checked" @change="onSelectCust()" /></van-col>
   </van-row>
   </van-list>
   </van-popup>

   <van-popup v-model="showCarModel" position="right" :overlay="true">
    <van-picker :columns="columns" @change="onChange" />
   </van-popup>

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'CreateCar',
  data() {
    return {
      show: false,
      showCust: false,
      showRepairOrder:false,
      showCarModel: false,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date(),

      repairTypes: [{name:'事故车'},{name:'保养'},{name:'返修'}],
      selectRepairItem: [],
      searchRepairItemWord: '',
      searchRepairOrder:'',
      searchCustWord:'',
      balances: [],
      loading: false,
      finished: false,
      result: [],

      active: 0,
      openid: '',
      member: {},
      order: {},
      car:{},
    };
  },
  mounted: function() {
    //this.getBalance();
  },
  methods: {
     onShowCust() {
      this.showCust = true;
    },
    onSelectCust(item) {
      this.showCust = false;
    },
    onCancelCust() {
      this.showCust = false;
    },
    onSearchCust(){

    },
    onSearchCustCancel(){

    },

    onDateSelect() {
      this.show = false;
      this.order.completeTime = this.dateFtt(
        'yyyy-MM-dd',
        this.currentDate
      );
    },
    onDateCancel() {
      this.show = false;
    },
    onShowDateSelect() {
      this.show = true;
    },

    onSearchRepairItem() {},
    onSearchRepairItemCancel() {},
    onSelectRepairItem() {
      this.selectRepairItem = this.balances.filter(p => p.checked == true);
    },
    onShowRepairItem() {
      this.showRepairItem = true;
    },

    onSearchRepairOrder(){},
    onSearchRepairOrderCancel(){},
    onShowRepairOrder() {
      this.showRepairOrder = true;
    },


    getBalance() {
      // const params = {
      //   id: 'GetMemberBalance',
      //   cmpno: 'RL018080',
      //   cardno: 'RL001060001',
      // };
      // api.getMemberBalance(params).then(
      //   response => {
      //     if (!response.ok) {
      //       this.loading = false;
      //       Toast('查询会员余额失败!请检查网络！');
      //     }
      //     if (response.data.success) {
      //       this.balances = response.data.data;
      //       this.loading = false;
      //       this.finished = true;
      //     } else {
      //       this.loading = false;
      //       Toast(response.data.message);
      //     }
      //   },
      //   response => {
      //     this.loading = false;
      //     Toast('查询会员余额失败!请检查网络');
      //   }
      // );
    },
    dateFtt(fmt, date) {
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          );
      return fmt;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 10px;
}

.van-popup {
  width: 90%;
  height: 100%;
}
</style>

