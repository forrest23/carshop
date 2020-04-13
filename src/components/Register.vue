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

    <van-panel title="" desc="公众号提交绑定后，需要您同时店内提交申请。绑定后您会收到会员充值兑换变动微信提醒，并支持微信支付验证码功能。" >
   </van-panel>

<van-row class="rowtop">
  <van-col span="4"><van-switch v-model="checked" size="20px"/></van-col>
  <van-col span="20" class="rowlabel">*本人同意将此表格的信息提供给丰田汽车（中国）投资有限公司，并同意此等信息可由丰田汽车（中国）投资有限公司向LEXUS雷克萨斯中国经销商、授权第三方（包括但不限于供应商、代理人等）共享。本人同意丰田汽车（中国）投资有限公司及其LEXUS雷克萨斯中国经销商向本人发送相关商业性信息。*丰田汽车（中国）投资有限公司保证按照<a href="https://cllexus.carcloud.xyz/lexus.pdf">《丰田汽车（中国）投资有限公司隐私政簧》</a>的规定及相关法律法规的规定，妥善使用消费者个人信息。</van-col>
</van-row>
</van-cell-group>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import api from '../api'
export default {
  name: 'Login',
  data () {
    return {
      name: '',
      plate_num: '',
      mobile: '',
      openid: '',
      cmpno: '',
      checked: false
    }
  },
  mounted: function () {
    this.openid = this.$cookies.get('openid')
    this.cmpno = this.$route.query.cmpno
  },
  methods: {
    blur () {
      this.plate_num = this.plate_num.toUpperCase()
    },
    submit () {
      if (!this.name) {
        Toast('请先输入车主姓名！')
        return
      }
      if (!this.plate_num) {
        Toast('请先输入车牌号码，无车牌号请输车架号后8位！')
        return
      }
      if (this.plate_num.trim().length < 6) {
        Toast('请先输入正确的车牌号码，无车牌号请输车架号后8位！')
        return
      }
      if (!this.mobile) {
        Toast('请输入办理会员时登记的手机号码！')
        return
      }
      if (this.mobile.trim().length != 11) {
        Toast('请输入11位手机号码！')
        return
      }
      if (!this.checked) {
        Toast('请先阅读并勾选隐私政策！')
        return
      }
      if (!this.openid) {
        Toast('获取微信用户信息失败，请关闭当前页面再试！')
        return
      }

      Toast.loading({
        mask: true,
        message: '提交数据中...'
      })
      var member = {}
      member.cmpno = this.cmpno
      member.openid = this.openid
      member.name = this.name
      member.licensenum = this.plate_num
      member.mobile = this.mobile
      api.updateOpenId(member).then(
        response => {
          if (!response.ok) {
            Toast('车主信息绑定失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            Dialog.alert({
              message: '车主信息绑定成功！'
            }).then(() => {
              WeixinJSBridge.invoke('closeWindow', {}, function (res) {
              })
            })
          } else {
            Toast(response.data.message)
          }
        },
        response => {
          Toast('车主信息绑定失败!请检查网络')
        }
      )
    }
  }
}
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
.rowtop {
  margin-top: 10px;
}
.rowlabel{
  color: #969799;
  font-size: 12px;
  margin-top: 3px;
  line-height: 18px;
  text-align: left;
}
</style>
