<template>
  <div class="container">
    <van-nav-bar class="title" title="在修车统计" left-text="返回" left-arrow  @click-left="onClickLeft"/>
   <van-list
     v-model="loadingHistory"
     :finished="finishedHistory"
     finished-text="没有更多了"
     @load="getRepairCarStatisticsDetail"
   >
   <van-row class="vanrow" v-for="(item, index) in statistics" :key="index">
    <van-row class="vanChildRow">
      <van-col span="14"><span class="label">委托书号：</span><span @click="showStatisticsDetail(item.ffzjgno)">{{item.fwtsh}}</span></van-col>
      <van-col span="10"><span class="label">牌照号：</span><span>{{item.fpzh }}</span></van-col>
    </van-row>

   <van-row class="vanChildRow">
      <van-col span="14"><span class="label">修理日期：</span><span>{{item.fxlrq}}</span></van-col>
      <van-col span="10"><span class="label">类型：</span><span>{{item.fxllx}}</span></van-col>
    </van-row>

      <van-row class="vanChildRow">
        <van-col span="14"><span class="label">服务顾问：</span><span>{{item.fywjd}}</span></van-col>
        <van-col span="10"><span class="label">里程：</span><span>{{item.fgls}}</span></van-col>
    </van-row>
   </van-row>
   </van-list>
    
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'RepairCarStatistics',
  data() {
    return {
      ffzjgno: this.$route.params.ffzjgno,
      statistics: [],
      loadingHistory: false,
      finishedHistory: false,
    };
  },
  mounted: function() {
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onGetHistory() {
      this.loadingHistory = false;
      this.finishedHistory = false;
    },
    getRepairCarStatisticsDetail() {
      const params = {
        id: 'GetRepairCarDetail',
        strCmpNo: this.ffzjgno,
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取在修车统计明细失败!请检查网络！');
          }
          if (response.data.success) {
            this.statistics = response.data.data;
            this.loadingHistory = false;
            this.finishedHistory = true;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取在修车统计明细失败!请检查网络!');
        }
      );
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
.vanChildRow{
  text-align: left;
  padding-bottom: 3px;
}
.label{
  color: #969799;
}
</style>
