<template>
  <div class="login">
    <img class="logo" src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <van-field label="公司名" placeholder="请选择公司" v-model="companyname" readonly @click="show = true"></van-field>
    <van-field label="用户名" placeholder="请输入用户名" v-model="username"></van-field>
    <van-field label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
    <van-button class="loginButton" type="primary" size="large" @click="login">按钮</van-button>
    <van-popup v-model="show" position="bottom">
         <van-picker show-toolbar :columns="columns"  @cancel="show = false" @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant';
import api from '../api';
export default {
  name: 'Login',
  data() {
    return {
      msg: '登陆',
      companyname: '',
      username: '',
      password: '',
      show: false,
      columns: [
        '上海弘仁宝佳汽车销售有限公司',
        '上海弘仁锐豪汽车销售服务有限公司',
        '上海弘仁宝裕新能源汽车销售服务有限公司',
      ],
    };
  },
  created: function() {
    this.companyname = localStorage.getItem('companyname') || '';
    this.username = localStorage.getItem('username') || '';
  },
  methods: {
    login: function() {
      Toast.loading({
        mask: true,
        message: '登陆中...',
      });
      var userInfo = {};
      userInfo.Plate_num = '5555';
      userInfo.name = '12123';
      api.login(userInfo).then(
        response => {
          if (!response.ok) {
            Toast('登录失败');
          }
          sessionStorage.setItem('companyname', this.companyname);
          sessionStorage.setItem('username', this.username);
          localStorage.setItem('companyname', this.companyname);
          localStorage.setItem('username', this.username);
          this.$router.push('/');
          Toast.clear();
        },
        response => {
          Toast('登录失败');
        }
      );
    },
    onConfirm(value, index) {
      this.companyname= value;
      this.show = false;
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
.login {
  padding: 10px;
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px;
}
.loginButton {
  margin-top: 15px;
}
</style>
