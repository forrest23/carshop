<template>
  <div class="container">
    <van-nav-bar class="title" title="维修历史" left-text="返回" left-arrow  @click-left="onClickLeft"/>
   <van-list
     v-model="loadingHistory"
     :finished="finishedHistory"
     finished-text="没有更多了"
     @load="getRepairHistory"
   >
   <van-row class="vanrow" v-for="(item, index) in history" :key="index" >
    <van-row class="vanChildRow" >
      <van-col span="14"><span class="label" >结算单号：</span><span @click="showHistoryDetail(item.fjsdjh)">{{item.fjsdjh}}</span></van-col>
      <van-col span="10"><span class="label">日期：</span><span>{{item.fxlrq}}</span></van-col>
    </van-row>

    <van-row class="vanChildRow">
      <van-col span="14"><span class="label">修理类型：</span><span>{{item.fxllx}}</span></van-col>
      <van-col span="10"><span class="label">里程：</span><span>{{item.fgls}}</span></van-col>
    </van-row>

      <van-row class="vanChildRow">
        <van-col span="14"><span class="label">服务顾问：</span><span>{{item.fywjd}}</span></van-col>
        <van-col span="10"><span class="label">金额：</span><span>{{item.fzje}}</span></van-col>
    </van-row>
   </van-row>
   </van-list>
    
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'RepairHistory',
  data() {
    return {
      plate_num: this.$route.params.plate_num,
      history: [],
      loadingHistory: false,
      finishedHistory: false,
    };
  },
  mounted: function() {
    this.getRepairHistory();
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onGetHistory() {
      this.loadingHistory = false;
      this.finishedHistory = false;
    },
    getRepairHistory() {
      const params = {
        id: 'GetRepairHistory',
        strPzh: this.plate_num,
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取车辆维修历史失败!请检查网络！');
          }
          if (response.data.success) {
            this.history = response.data.data;
            this.loadingHistory = false;
            this.finishedHistory = true;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取车辆维修历史失败!请检查网络!');
        }
      );
    },
    showHistoryDetail(fjsdjh) {
      this.$router.push({
        path: '/repairHistoryDetail',
        name: 'RepairHistoryDetail',
        params: {
          fjsdjh: fjsdjh,
        },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.container {
  padding: 10px;
  text-align: center;
}
.title {
  margin-bottom: 10px;
}
.logo {
  width: 300px;
  height: 130px;
  margin-bottom: 10px;
}
.button {
  margin-top: 25px;
}
.vanrow {
  border-bottom-width: 1px;
  border-bottom-color: #969799;
  border-bottom-style: solid;
  margin-bottom: 6px;
}
.vanChildRow {
  text-align: left;
  padding-bottom: 3px;
}
.label {
  color: #969799;
}
</style>
