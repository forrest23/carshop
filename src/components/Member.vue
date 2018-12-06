<template>
  <div class="container">
    <van-nav-bar class="title" title="我的会员" />
    <van-panel :title="member.name" :desc="member.classname" :status="member.cardno">
      <van-cell-group>
       <van-cell title="牌照号" :value="member.licensenum" />
       <van-cell title="手机号" :value="member.mobile"/>
      </van-cell-group>
    </van-panel>
     <van-panel title="卡内余额" >
      <van-cell-group>
        <van-cell v-for="balance in balances" :key="balance.itemno" :title="balance.itemname" :value="balance.balance" is-link />
      </van-cell-group>
    </van-panel>
    <van-tabs v-model="active">
      <van-tab title="储值历史">
          <van-cell-group>
        <van-cell v-for="history in historys" :key="history.serialno" :title="history.itemname" :value="history.qty" :label="history.regdate" is-link />
      </van-cell-group>
      </van-tab>
      <van-tab title="消费历史">
          <van-cell-group>
        <van-cell v-for="balance in balances" :key="balance.itemno" :title="balance.itemname" :value="balance.balance" is-link />
      </van-cell-group>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'Member',
  data() {
    return {
      active: 0,
      openid: '',
      cmpno: 'RL018080',
      member: {},
      balances: [],
      historys:[],
    };
  },
  mounted: function() {
    this.openid = 'oYXbkskh5y8g6IyImR82i-maAQMs';
    this.getMember();
  },
  methods: {
    getMember() {
      const params = {
        id: 'GetMember',
        cmpno: '1001',
        openid: this.openid,
      };
      api.getMember(params).then(
        response => {
          if (!response.ok) {
            Toast('车主信息绑定失败!请检查网络！');
          }
          if (response.data.success) {
            Toast.clear();
            this.member = response.data.data;
            this.cardno = response.data.data.cardno;
            this.getBalance();
            this.getHistory();
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('车主信息绑定失败!请检查网络');
        }
      );
    },

    getBalance() {
      const params = {
        id: 'GetMemberBalance',
        cmpno: this.cmpno,
        cardno: this.cardno,
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

    getHistory() {
      const params = {
        id: 'GetMemberBalanceInOutHis',
        cmpno: this.cmpno,
        cardno: this.cardno,
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
