<template>
  <div class="container">
    <van-nav-bar class="title" title="我的会员" />
    <van-actionsheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />
    <van-panel title="会员信息">
      <van-cell-group>
        <van-cell title="会员姓名" icon="contact" :value="member.name" size="large" center />
        <van-cell
          title="会员卡号"
          class="reset"
          icon="card"
          :value="member.cardno"
          @click="showSelect()"
          is-link
          arrow-direction="down"
        />
        <van-cell title="会员级别" icon="exchange" :value="member.classname" />
        <van-cell title="牌照号" icon="logistics" :value="member.licensenum" />
        <van-cell title="手机号" icon="phone" :value="member.mobile" />
      </van-cell-group>
    </van-panel>
    <van-panel title="授权信息">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="getAuthorizeLoading"
      >
        <van-row v-for="(item, index) in authorizes" :key="index">
          <van-col span="5">
            <van-cell :title="item.applyname" />
          </van-col>
          <van-col span="7">
            <van-cell :title="item.applymobile" />
          </van-col>
          <van-col span="6">
            <van-cell :title="item.applydate.substr(0,9)" />
          </van-col>
          <van-col span="6">
            <van-button type="primary" size="mini" @click="authorize(item.id,item.applyname,item.applystate)">{{item.applystate == 1 ? '待授权' : '已授权'}}</van-button>
          </van-col>
        </van-row>
      </van-list>
    </van-panel>
    <van-panel title="卡内余额">
      <van-cell-group>
        <van-cell
          v-for="balance in balances"
          :key="balance.itemno"
          :title="balance.itemname"
          :value="balance.balance"
          @click="showDetail(balance.itemno,balance.itemname)"
          is-link
        />
      </van-cell-group>
      <van-panel title="友情提示" desc="由于可能存在网络延迟，您查询到的余额仅供参考，实际余额以4S店站内数据为准。" />
    </van-panel>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import api from '../api'
export default {
  name: 'Member',
  data () {
    return {
      show: false,
      active: 0,
      openid: '',
      cmpno: this.$route.query.cmpno || '1001',
      member: {},
      memberlist: [],
      balances: [],
      addHistorys: [],
      reduceHistorys: [],
      actions: [],
      authorizes: [],
      loading: false,
      finished: false
    }
  },
  mounted: function () {
    this.openid = this.$cookies.get('openid') || 'oYXbkskh5y8g6IyImR82i-maAQMs'
    this.getMember()
  },
  methods: {
    onSelect (item) {
      this.show = false
      this.member = this.memberlist.filter(p => p.cardno === item.name)[0]
      this.cardno = this.member.cardno
      this.getBalance()
      this.getAuthorize()
    },
    onCancel (item) {},
    showSelect () {
      this.show = true
    },
    getMember () {
      const params = {
        id: 'GetMember',
        cmpno: this.cmpno,
        openid: this.openid
      }
      api.getMember(params).then(
        response => {
          if (!response.ok) {
            Toast('会员信息查询失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            this.memberlist = response.data.data
            this.memberlist.forEach(e => {
              var item = {}
              item.name = e.cardno
              item.subname = e.licensenum
              this.actions.push(item)
            })
            this.member = this.memberlist[0]
            this.cardno = response.data.data[0].cardno
            this.getBalance()
            this.getAuthorize()
          } else {
            Dialog.alert({
              message: '您还未绑定会员信息，请先到会员绑定菜单绑定会员信息！'
            }).then(() => {
              WeixinJSBridge.invoke('closeWindow', {}, function (res) {})
            })
          }
        },
        response => {
          Toast('会员信息查询失败!请稍后再试！')
        }
      )
    },

    authorize (id, applyname, applystate) {
      if (applystate === 2) return
      Dialog.confirm({
        title: '授权确认',
        message: '是否确定将会员卡授权给' + applyname + '使用？',
        confirmButtonText: '确定',
        cancelButtonText: '拒绝',
      })
        .then(() => {
          this.doAuthorize(id, 2)
        })
        .catch(() => {
          this.doAuthorize(id, -2)
        })
    },

    doAuthorize (authorizeId, applystate) {
      Toast.loading({
        mask: true,
        message: '更新授权中...'
      })
      const params = {
        id: 'UpdateAuthorizeModel',
        authorizeId: authorizeId,
        applystate: applystate
      }
      api.UpdateAuthorizeModel(params).then(
        response => {
          if (!response.ok) {
            Toast('更新授权失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            this.getAuthorize()
          } else {
            Toast(response.data.message)
          }
        },
        response => {
          Toast('更新授权失败!请检查网络')
        }
      )
    },

    getBalance () {
      Toast.loading({
        mask: true,
        message: '查询会员余额中...'
      })
      const params = {
        id: 'GetMemberBalance',
        cmpno: this.cmpno,
        cardno: this.cardno
      }
      api.getMemberBalance(params).then(
        response => {
          if (!response.ok) {
            Toast('查询会员余额失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            this.balances = response.data.data
          } else {
            Toast(response.data.message)
          }
        },
        response => {
          Toast('查询会员余额失败!请检查网络')
        }
      )
    },

    getAuthorizeLoading () {
      this.loading = false
      this.finished = true
    },

    getAuthorize () {
      Toast.loading({
        mask: true,
        message: '查询授权信息中...'
      })
      const params = {
        id: 'GetAuthorizeModel',
        cmpno: this.cmpno,
        cardno: this.cardno
      }
      api.GetAuthorizeModel(params).then(
        response => {
          if (!response.ok) {
            Toast('查询授权信息失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            this.authorizes = response.data.data
          } else {
            Toast(response.data.message)
          }
        },
        response => {
          Toast('查询授权信息失败!请检查网络')
        }
      )
    },

    getHistory () {
      const params = {
        id: 'GetMemberBalanceInOutHis',
        cmpno: this.cmpno,
        cardno: this.cardno
      }
      api.getMemberBalance(params).then(
        response => {
          if (!response.ok) {
            Toast('车主信息绑定失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            this.addHistorys = response.data.data.filter(
              item => item.ftype === '储值'
            )
            this.reduceHistorys = response.data.data.filter(
              item => item.ftype === '消费'
            )
          } else {
            Toast(response.data.message)
          }
        },
        response => {
          Toast('车主信息绑定失败!请检查网络')
        }
      )
    },
    showDetail (itemno, itemname) {
      this.$router.push({
        path: '/memberItem',
        name: 'MemberItem',
        params: {
          member: this.member,
          cmpno: this.cmpno,
          cardno: this.cardno,
          itemno,
          itemname
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 10px;
}
.van-button{
  margin-top: 5px;
}
</style>
