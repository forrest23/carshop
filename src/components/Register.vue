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
      @click-icon="$toast('question')"
     />

    <van-field
      v-model="plate_num"
      required
      clearable
      label="牌照号"
      icon="question"
      placeholder="请输入牌照号"
      @click-icon="$toast('question')"
    />

    <van-button class="button" type="primary" size="large" @click="submit">提交绑定</van-button>

    <van-panel title="绑定车主说明" desc="绑定后你会得到积分变动提醒" >
   </van-panel>
</van-cell-group>
  </div>
</template>

<script>
import { Toast } from 'vant';
import api from '../api';
export default {
  name: 'Login',
  data() {
    return {
      msg: '锐龙4S店移动管理系统',
      name: '',
      plate_num: '',
      openid:'',
    };
  },
  mounted: function() {
    this.openid = this.$cookies.get('openid');
  },
  methods: {
    submit() {
       if (!this.openid){
          Toast('获取用户信息失败，请关闭当前页面再试！');
          return;
       }
        Toast.loading({
        mask: true,
        message: '提交数据中...',
      });
      var member = {};
      member.openid = this.openid;
      member.name = this.name;
      member.licensenum = this.plate_num;
      api.updateMember(member).then(
        response => {
          if (!response.ok) {
            Toast('登录失败!请检查网络！');
          }
          console.log(response);
          if (response.data.success) {
            this.$router.push('/Photo');
            Toast.clear();
          }else{
            Toast('登录失败!用户名或密码错误！');
          }
        },
        response => {
          Toast('登录失败!');
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
