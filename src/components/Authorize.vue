<template>
  <div class="container">
    <van-nav-bar class="title" title="授权信息登记" />
    <van-cell-group>
     <van-field
      v-model="plate_num"
      required
      clearable
      label="牌照号"
      placeholder="请输入牌照号"
     />

    <van-field
      v-model="owername"
      required
      clearable
      label="车主姓名"
      placeholder="请输入车主姓名"
    />

    <van-field
      v-model="owermobile"
      required
      clearable
      label="车主手机号码"
      type= "tel"
      placeholder="请输入车主手机号码"
    />

    <van-field
      v-model="applyname"
      required
      clearable
      label="申请人姓名"
      placeholder="请输入申请人姓名"
    />

    <van-field
      v-model="applymobile"
      required
      clearable
      label="申请人号码"
      type= "tel"
      placeholder="请输入申请人手机号码"
    />

    <van-button class="button" type="primary" size="large" @click="submit">提交申请</van-button>

    <van-panel title="授权登记说明" desc="提交申请后需要4S店先审核">
   </van-panel>
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
      plate_num: '',
      owername: '',
      owermobile: '',
      applyname: '',
      applymobile: ''
    }
  },
  mounted: function () {
    // this.openid = this.$cookies.get('openid')
    // this.cmpno = this.$route.query.cmpno
  },
  methods: {
    submit () {
      if (!this.plate_num) {
        Toast('请先输入牌照号！')
        return
      }
      if (!this.owername) {
        Toast('请先输入车主姓名！')
        return
      }
      if (!this.owermobile) {
        Toast('请输入车主手机号码！')
        return
      }
      if (this.owermobile.trim().length !== 11) {
        Toast('请输入11位车主手机号码！')
        return
      }
      if (!this.applyname) {
        Toast('请先输入申请人姓名！')
        return
      }
      if (!this.applymobile) {
        Toast('请输入申请人手机号码！')
        return
      }
      if (this.applymobile.trim().length !== 11) {
        Toast('请输入11位申请人手机号码！')
        return
      }

      Toast.loading({
        mask: true,
        message: '提交数据中...'
      })
      var authorize = {}
      authorize.cmpno = this.cmpno
      authorize.plate_num = this.plate_num
      authorize.owername = this.owername
      authorize.owermobile = this.owermobile
      authorize.applyname = this.applyname
      authorize.applymobile = this.applymobile
      authorize.applystate = 0
      api.InsertAuthorizeModel(authorize).then(
        response => {
          if (!response.ok) {
            Toast('授权信息提交失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            Dialog.alert({
              message: '授权信息提交成功，请等待4S店审核！'
            }).then(() => {
              WeixinJSBridge.invoke('closeWindow', {}, function (res) {
              })
            })
          } else {
            Toast(response.data.message)
          }
        },
        response => {
          Toast('授权信息提交失败!请检查网络')
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
</style>
