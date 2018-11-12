<template>
  <div>
    <van-nav-bar title="锐龙4S店移动管理系统" :right-text="username" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div class="tools">
       <van-row type="flex" justify="space-around">
         <van-col span="6">
           <van-icon name="photograph" size="48px" color="#2894FF" @click="onRouterTo"/>
           <span>拍照识别</span>
          </van-col>
         <van-col span="6"></van-col>
         <van-col span="6"></van-col>
       </van-row>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home">主页</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  name: 'Home',
  data() {
    return {
      username: '',
      active: 0,
    };
  },
  created: function() {
    this.username = sessionStorage.getItem('username') || '';
  },
  methods: {
    onRouterTo() {
       this.$router.push('/Photo');
    },
    onClickLeft() {},
    onClickRight() {
      sessionStorage.setItem('companyname', '');
      sessionStorage.setItem('username', '');
      this.$router.push('/login');
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
.tools {
  padding-top: 10px;
}
.van-col {
    text-align: center;
    height: 100px;
    float: none;
    display: inline-block;
    vertical-align: middle;
  }
  .van-icon {
    display: block;
    font-size: 32px;
    margin: 5px 0;
    color: rgba(69, 90, 100, .8);
  }
  span {
    font-size: 14px;
  }
</style>
