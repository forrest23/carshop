<template>
  <div class="container">
    <van-nav-bar class="title" title="维修接单" />
    <van-panel title="委托书">
      <van-cell-group>
       <van-cell title="委托书号">
         <van-icon slot="right-icon" name="add" class="custom-icon" />
         <van-icon slot="right-icon" name="search" class="custom-icon" />
       </van-cell>
       <van-field v-model="member.licensenum1" center clearable label="牌照号" placeholder="请输入或识别牌照号">
            <van-button slot="button" size="small" type="primary">智能识别</van-button>
       </van-field>
       <van-cell title="车型名称"  :value="member.classname"/>
       <van-cell title="会员卡号"  :value="member.licensenum" />
       <van-cell title="客户名称"  :value="member.mobile"/>
       <van-cell title="联系人"  :value="member.mobile"/>
       <van-cell title="联系电话"  :value="member.mobile"/>
       <van-cell title="修理类型">
         <van-icon slot="right-icon" name="search" class="custom-icon" />
       </van-cell>
       <van-field v-model="member.licensenum1" center clearable label="公里数" placeholder="请输入公里数"></van-field>
       <van-cell title="工时单价" :value="member.mobile"/>
       <van-cell title="预计交车时间" @click="showSelect()" :value="order.completeTime">
         <van-icon slot="right-icon" name="search" class="custom-icon" />
       </van-cell>
        <van-cell title="维修项目" @click="onShowRepairItem()">
         <van-icon slot="right-icon" name="search" class="custom-icon" />
       </van-cell>
      </van-cell-group>

  <van-row v-for="(item, index) in selectRepairItem" :key="index">
    <van-col span="8"><van-cell :title="item.itemno" /></van-col>
    <van-col span="12"><van-cell :title="item.itemname" /></van-col>
   </van-row>

    </van-panel>
     <!-- <van-panel title="维修项目">
        <van-icon slot="right-icon" name="search" class="custom-icon" />
     </van-panel> -->
    <van-popup v-model="show" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择预计交车时间"
      type="datetime"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onSelect"
      @cancel="onCancel"
     />
    </van-popup>

   <van-popup v-model="showRepairItem" position="right" :overlay="true">
    <van-search v-model="searchWord"
    placeholder="请输入搜索关键词"
    @search="onSearch"
    @cancel="onSearchCancel" />

  <van-row>
    <van-col span="8"><van-cell value="项目代码" /></van-col>
    <van-col span="12"><van-cell value="项目名称" /></van-col>
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
    <van-col span="4"><van-checkbox v-model="item.checked" @change="onSelectRepairItem()" /></van-col>
   </van-row>
   </van-list>
 
   </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'RepairOrder',
  data() {
    return {
      show: false,
      showRepairItem: false,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date(),

      selectRepairItem:[],
      searchWord: '',
      balances: [],
      loading: false,
      finished: false,
      result: [],

      active: 0,
      openid: '',
      cmpno: this.$route.query.cmpno || '1001',
      member: {},
      order: {},
    };
  },
  mounted: function() {
    this.openid = this.$cookies.get('openid') || 'oYXbkskh5y8g6IyImR82i-maAQMs';
    this.getBalance();
  },
  methods: {
    onSelect() {
      this.show = false;
      this.order.completeTime = this.dateFtt(
        'yyyy-MM-dd hh:mm',
        this.currentDate
      );
    },
    onCancel() {
      this.show = false;
    },
    onSearch() {
      
    },
    onSearchCancel() {},
    onShowRepairItem() {
      this.showRepairItem = true;
    },
    showSelect() {
      this.show = true;
    },
    onSelectRepairItem() {
      this.selectRepairItem = this.balances.filter(p=>p.checked == true);
    },
    getBalance() {
      const params = {
        id: 'GetMemberBalance',
        cmpno: 'RL018080',
        cardno: 'RL001060001',
      };
      api.getMemberBalance(params).then(
        response => {
          if (!response.ok) {
            this.loading = false;
            Toast('查询会员余额失败!请检查网络！');
          }
          if (response.data.success) {
            this.balances = response.data.data;
            this.loading = false;
            this.finished = true;
          } else {
            this.loading = false;
            Toast(response.data.message);
          }
        },
        response => {
          this.loading = false;
          Toast('查询会员余额失败!请检查网络');
        }
      );
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
  width: 80%;
  height: 100%;
}
</style>

