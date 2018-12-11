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
        <van-cell v-for="balance in balances" :key="balance.itemno" :title="balance.itemname" :value="balance.balance" @click="showDetail(balance.itemno,balance.itemname)" is-link />
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
      active: 0,
      openid: '',
      cmpno: this.$route.query.cmpno,
      member: {},
      balances: [],
      addHistorys: [],
      reduceHistorys: [],
    };
  },
  mounted: function() {
    this.openid = this.$cookies.get('openid');
    this.getMember();
  },
  methods: {
    getMember() {
      const params = {
        id: 'GetMember',
        cmpno: this.cmpno,
        openid: this.openid,
      };
      api.getMember(params).then(
        response => {
          if (!response.ok) {
            Toast('会员信息查询失败!请检查网络！');
          }
          if (response.data.success) {
            Toast.clear();
            this.member = response.data.data;
            this.cardno = response.data.data.cardno;
            this.getBalance();
          } else {
              Dialog.alert({
              message: '您还未绑定会员信息，请先到会员绑定菜单绑定会员信息！',
            }).then(() => {
              WeixinJSBridge.invoke('closeWindow',{},function(res){
              });
            });
          }
        },
        response => {
          Toast('会员信息查询失败!请稍后再试！');
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
            this.addHistorys = response.data.data.filter(
              item => item.ftype === '储值'
            );
            this.reduceHistorys = response.data.data.filter(
              item => item.ftype === '消费'
            );
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('车主信息绑定失败!请检查网络');
        }
      );
    },
    showDetail(itemno,itemname) {
      this.$router.push({
        path: '/memberItem',
        name: 'MemberItem',
        params: {
          member: this.member,
          cmpno: this.cmpno,
          cardno: this.cardno,
          itemno,
          itemname,
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
