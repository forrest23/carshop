<template>
  <div class="container">
    <van-nav-bar class="title" title="绑定会员卡" />
    <img class="logo" src="../assets/vip.jpg">
    <van-cell-group>
     <van-field
      v-model="name"
      required
      clearable
      label="车主姓名"
      icon="question"
      placeholder="请输入车主姓名"
      @click-icon="$toast('请输入车主姓名')"
     />

    <van-field
      v-model="plate_num"
      required
      clearable
      label="车牌号码"
      icon="question"
      placeholder="车牌号，无车牌输车架号后8位"
      @click-icon="$toast('请输入车牌号码，无车牌号码请输入车架号后8位')"
      @blur="blur"
    />

    <van-field
      v-model="mobile"
      required
      clearable
      label="手机号码"
      icon="question"
      type= "tel"
      placeholder="请输入办理会员时登记的手机号码"
      @click-icon="$toast('请输入办理会员时登记的手机号码')"
    />

    <van-button class="button" type="primary" size="large" @click="submit">提交绑定</van-button>

    <van-panel title="绑定车主说明" desc="绑定后你会得到积分变动微信提醒" >
   </van-panel>
</van-cell-group>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import api from '../api';
export default {
  name: 'Login',
  data() {
    return {
      name: '',
      plate_num: '',
      mobile:'',
      openid: '',
      cmpno:'',
    };
  },
  mounted: function() {
    this.openid = this.$cookies.get('openid');
    this.cmpno = this.$route.query.cmpno;
  },
  methods: {
    blur(){
      this.plate_num = this.plate_num.toUpperCase();
    },
    submit() {
      if (!this.name) {
        Toast('请先输入车主姓名！');
        return;
      }
      if (!this.plate_num) {
        Toast('请先输入车牌号码，无车牌号请输车架号后8位！');
        return;
      }
      if (this.plate_num.trim().length < 6 ) {
        Toast('请先输入正确的车牌号码，无车牌号请输车架号后8位！');
        return;
      }
      if (!this.mobile) {
        Toast('请输入办理会员时登记的手机号码！');
        return;
      }
      if (this.mobile.trim().length !=11) {
        Toast('请输入11位手机号码！');
        return;
      }
      if (!this.openid) {
        Toast('获取微信用户信息失败，请关闭当前页面再试！');
        return;
      }
      Toast.loading({
        mask: true,
        message: '提交数据中...',
      });
      var member = {};
      member.cmpno = this.cmpno;
      member.openid = this.openid;
      member.name = this.name;
      member.licensenum = this.plate_num;
      member.mobile = this.mobile;
      api.updateOpenId(member).then(
        response => {
          if (!response.ok) {
            Toast('车主信息绑定失败!请检查网络！');
          }
          if (response.data.success) {
            Toast.clear();
            Dialog.alert({
              message: '车主信息绑定成功！',
            }).then(() => {
              WeixinJSBridge.invoke('closeWindow',{},function(res){
              });
            });
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
</style>
