<template>
  <div class="login">
    <img class="logo" src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <van-field label="公司名" placeholder="请选择公司" v-model="companyname" readonly @click="selectCompany"></van-field>
    <van-field label="用户名" placeholder="请输入用户名" v-model="username"></van-field>
    <van-field label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
    <van-button class="loginButton" type="primary" size="large" @click="login">按钮</van-button>
    <van-popup v-model="show" position="bottom">
         <van-picker
          show-toolbar
          :columns="columns"
          @cancel="show = false"
          @confirm="onConfirm"
        />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant';
import api from '../api'
export default {
  name: 'Login',
  data() {
    return {
      msg: '登陆',
      companyname: '',
      username: '',
      password: '',
      show: false,
      show2: false,
      columns: [
        '上海弘仁宝佳汽车销售有限公司',
        '上海弘仁锐豪汽车销售服务有限公司',
        '上海弘仁宝裕新能源汽车销售服务有限公司',
      ],
    };
  },
  methods: {
    selectCompany: function() {
      this.show = true;
    },
    login: function() {
      var userInfo ={};
      userInfo.Plate_num="5555";
      userInfo.name="12123";
      api.login(userInfo).then(response => {
      if(!response.ok){
        Toast('登录失败')
      }
      Toast('登录成功,欢迎光临!')
    }, response => {
      Toast('登录失败')
    })
    },
    onSelect(item) {
      this.show = false;
      this.companyname = item.name;
    },
    onChange(picker, value, index) {
      this.companyname = value;
    },
    onConfirm(value, index) {
      this.show = false;
      this.companyname = value;
    },
  },
  mounted() {},
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
}
.logo {
  width: 100px;
  height: 100px;
}
.loginButton {
  margin-top: 15px;
}
</style>
