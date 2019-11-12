<template>
  <div>
    <van-nav-bar title="锐龙4S店移动管理系统" :right-text="username" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div class="tools">
       <van-row type="flex" justify="space-around">
         <van-col span="6">
           <van-icon name="photograph" size="48px" color="#2894FF" @click="onRouterTo('智能识别')"/>
           <span>智能识别</span>
          </van-col>
           <van-col span="6">
           <van-icon name="records" size="48px" color="#2894FF" @click="onRouterTo('维修接单')"/>
           <span>维修接单</span>
          </van-col>
            <van-col span="6">
           <van-icon name="logistics" size="48px" color="#2894FF" @click="onRouterTo('在修车查询')"/>
           <span>在修车查询</span>
          </van-col>
            <van-col span="6">
           <van-icon name="user-o" size="48px" color="#2894FF" @click="onRouterTo('会员识别')"/>
           <span>会员识别</span>
          </van-col>
       </van-row>
       <van-row type="flex" justify="space-around">
         <van-col span="6">
           <van-icon name="photograph" size="48px" color="#2894FF" @click="onRouterTo('定义问卷')"/>
           <span>定义问卷</span>
          </van-col>
          <van-col span="6">
           <van-icon name="photograph" size="48px" color="#2894FF" @click="onRouterTo('报销上传')"/>
           <span>报销上传</span>
          </van-col>
          <van-col span="6"/>
          <van-col span="6"/>
       </van-row>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home">主页</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
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
    onRouterTo(routerName) {
      switch (routerName) {
        case "智能识别":
          this.$router.push('/Photo');
          break;
        case "维修接单":
          this.$router.push('/RepairOrder');
          break;
        case "在修车查询":
          this.$router.push('/RepairCarStatistics');
          break;
        case "会员识别":
          this.$router.push('/MemberScan');
          break;
        case "定义问卷":
          this.$router.push('/QuestionnaireEdit');
          break;
        case "报销上传":
          this.$router.push('/ClaimBack');
          break;
        default:
          break;
      }
    },
    onClickLeft() {},
    onClickRight() {
      Dialog.confirm({
        title: '系统提示',
        message: '是否确定退出系统？',
      })
        .then(() => {
          sessionStorage.setItem('companyno', '');
          sessionStorage.setItem('companyname', '');
          sessionStorage.setItem('username', '');
          this.$router.push('/login');
        })
        .catch(() => {});
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
  color: rgba(69, 90, 100, 0.8);
}
span {
  font-size: 14px;
}
</style>
