<template>
  <div class="container">
    <van-nav-bar class="title" title="会员项目历史" left-text="返回" left-arrow  @click-left="onClickLeft"/>
    <van-panel :title="member.name" :desc="member.classname" :status="member.cardno">
      <van-cell-group>
       <van-cell title="牌照号" :value="member.licensenum" />
       <van-cell title="手机号" :value="member.mobile"/>
      </van-cell-group>
    </van-panel>
     <van-panel :title="itemname" >
      <van-cell-group>
        <van-cell v-for="history in historys" :key="history.serialno" :title="history.itemname" :value="history.qty" :label="history.regdate" />
      </van-cell-group>
    </van-panel>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'Member',
  data() {
    return {
      openid: '',
      cmpno: this.$route.params.cmpno,
      member: this.$route.params.member,
      cardno: this.$route.params.cardno,
      itemno: this.$route.params.itemno,
      itemname: "【" + this.$route.params.itemname + "】历史",
      historys: [],
    };
  },
  mounted: function() {
    this.openid = 'oYXbkskh5y8g6IyImR82i-maAQMs';
    this.getHistory();
  },
  methods: {
    onClickLeft() {
         this.$router.back(-1);
    },

    getHistory() {
      const params = {
        id: 'GetMemberBalanceInOutHis',
        cmpno: this.cmpno,
        cardno: this.cardno,
        itemno: this.itemno
      };
      api.getMemberBalance(params).then(
        response => {
          if (!response.ok) {
            Toast('车主信息绑定失败!请检查网络！');
          }
          if (response.data.success) {
            Toast.clear();
            this.historys = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('车主信息绑定失败!请检查网络');
        }
      );
    },
   
    getBalanceDetail() {
      const params = {
        id: 'GetMemberBalanceDetail',
        cmpno: this.cmpno,
        cardno: this.cardno,
        itemno: this.itemno
      };
      api.getMemberBalance(params).then(
        response => {
          if (!response.ok) {
            Toast('车主信息绑定失败!请检查网络！');
          }
          if (response.data.success) {
            Toast.clear();
            this.balances = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('车主信息绑定失败!请检查网络');
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
</style>
