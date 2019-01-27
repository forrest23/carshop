<template>
  <div class="login">
    <img class="logo" src="../assets/logo.png">
    <h2>{{ msg }}</h2>
    <van-field label="公司名" placeholder="请输入公司名" v-model="companyname" left-icon="shop-o"></van-field>
    <van-field label="用户名" placeholder="请输入用户名" v-model="username" left-icon="contact"></van-field>
    <van-field label="密码" placeholder="请输入密码" type="password" v-model="password" left-icon="certificate"></van-field>
    <van-button class="loginButton" type="primary" size="large" @click="login">登陆</van-button>
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
      companyname: '',
      username: '',
      password: '',
      show: false,
      columns: [],
    };
  },
  mounted: function() {
    this.companyname = localStorage.getItem('companyname') || '';
    this.username = localStorage.getItem('username') || '';
    this.password = localStorage.getItem('password') || '';
  },
  methods: {
    getCompanyInfo() {
      api.getCompanyInfo().then(
        response => {
          if (!response.ok) {
            Toast('获取公司信息失败！');
          }
          var data = JSON.parse(response.bodyText);
          data.result.forEach(e => {
            this.columns.push(e.fcmpname);
          });
        },
        response => {
          Toast('获取公司信息失败！请检查网络！');
        }
      );
    },
    login() {
      if (!this.username){
          Toast('请输入用户名！');
          return;
      }
      if (!this.password){
          Toast('请输入密码！');
          return;
      }
      Toast.loading({
        mask: true,
        message: '登陆中...',
      });
      var userInfo = {};
      userInfo.fcmpname = this.companyname;
      userInfo.fname = this.username;
      userInfo.fpwd = this.password;
      api.login(userInfo).then(
        response => {
          if (!response.ok) {
            Toast('登录失败!请检查网络！');
          }
          console.log(response);
          if (response.data.success) {
            sessionStorage.setItem('companyno',response.data.companyNo);
            sessionStorage.setItem('companyname', this.companyname);
            sessionStorage.setItem('username', this.username);
            localStorage.setItem('companyno', response.data.companyNo);
            localStorage.setItem('companyname', this.companyname);
            localStorage.setItem('username', this.username);
            localStorage.setItem('password', this.password);
            this.$router.push('/');
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
    onConfirm(value, index) {
      this.companyname = value;
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
  width: 258px;
  height: 83px;
}
.loginButton {
  margin-top: 15px;
}
</style>
