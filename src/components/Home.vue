<template>
  <div>
    <van-nav-bar title="标题" :right-text="username" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div class="tools">
       <van-row type="flex" justify="space-around">
         <van-col span="6"><van-icon name="photograph" size="48px" color="#2894FF" @click="onRouterTo"/></van-col>
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
      Toast('按钮');
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
img {
  width: 70px;
  height: 70px;
}
</style>
