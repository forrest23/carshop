<template>
  <div class="container">
    <van-nav-bar class="title" title="在修车统计" left-text="返回" left-arrow  @click-left="onClickLeft"/>
   <van-list
     v-model="loadingHistory"
     :finished="finishedHistory"
     finished-text="没有更多了"
     @load="getRepairCarStatistics"
   >
   <van-row class="vanrow" v-for="(item, index) in statistics" :key="index">
    <van-row class="vanChildRow">
      <van-col span="24"><span class="label">公司编号：</span><span @click="showStatisticsDetail(item.ffzjgno)">{{item.ffzjgno}}</span></van-col>
    </van-row>

    <van-row class="vanChildRow">
      <van-col span="24"><span class="label">公司名称：</span><span>{{item.fgsmc}}</span></van-col>
    </van-row>

      <van-row class="vanChildRow">
        <van-col span="24"><span class="label">数量：</span><span>{{item.fcount}}</span></van-col>
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
      cmpname: localStorage.getItem('companyname') || '',
      statistics: [],
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
    getRepairCarStatistics() {
      const params = {
        id: 'GetRepairCar',
        strCmpName: this.cmpname,
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取在修车统计失败!请检查网络！');
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
          Toast('获取在修车统计失败!请检查网络!');
        }
      );
    },
    showStatisticsDetail(ffzjgno) {
      this.$router.push({
        path: '/repairCarStatisticsDetail',
        name: 'RepairCarStatisticsDetail',
        params: {
          ffzjgno: ffzjgno,
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
.vanChildRow{
  text-align: left;
  padding-bottom: 3px;
}
.label{
  color: #969799;
}
</style>
