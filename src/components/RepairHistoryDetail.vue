<template>
  <div class="container">
    <van-nav-bar class="title" title="维修历史明细" left-text="返回" left-arrow  @click-left="onClickLeft"/>
   <van-list
     v-model="loadingHistory"
     :finished="finishedHistory"
     finished-text="没有更多了"
     @load="getRepairHistory"
   >
   <van-row class="vanrow" v-for="(item, index) in history" :key="index">
    <van-row class="vanChildRow">
      <van-col span="24"><span class="label">项目代码：</span><span>{{item.fgwh}}</span></van-col>
    </van-row>

    <van-row class="vanChildRow">
      <van-col span="24"><span class="label">项目名称：</span><span>{{item.fxlnr}}</span></van-col>
    </van-row>

      <van-row class="vanChildRow">
        <van-col span="24"><span class="label">项目数量：</span><span>{{item.fsl}}</span></van-col>
    </van-row>
   </van-row>
   </van-list>
    
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'RepairHistoryDetail',
  data() {
    return {
      type: '',
      fjsdjh: '',
      fwtsh: '',
      history: [],
      loadingHistory: false,
      finishedHistory: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.type = to.query.type;
      vm.fjsdjh = to.query.fjsdjh;
      vm.fwtsh = to.query.fwtsh;
    });
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
      var params = {};
      if (this.type == '已结算') {
        params = {
          id: 'GetRepairHistoryDetail',
          strJsdjh: this.fjsdjh,
        }
      } else {
        params = {
          id: 'GetRepairDetailWtsh',
          strWtsh: this.fwtsh,
        }
      }
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取车辆维修历史明细失败!请检查网络！');
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
          Toast('获取车辆维修历史明细失败!请检查网络!');
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
.vanChildRow {
  text-align: left;
  padding-bottom: 3px;
}
.label {
  color: #969799;
}
</style>
