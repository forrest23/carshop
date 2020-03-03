<template>
  <div class="container">
    <van-nav-bar class="title" title="会员余额" left-text="返回" left-arrow  @click-left="onClickLeft" />
    <van-actionsheet
     v-model="show"
     :actions="actions"
     cancel-text="取消"
     @select="onSelect"
     @cancel="onCancel"
    />
    <van-panel title="会员信息" >
      <van-cell-group>
       <van-cell title="会员姓名" icon="contact" :value="member.name" size="large" center />
       <van-cell title="会员卡号" class="reset" icon="card" :value="member.cardno"/>
       <van-cell title="会员级别" icon="exchange" :value="member.classname"/>
       <van-cell title="牌照号" icon="logistics" :value="member.licensenum" />
       <van-cell title="手机号" icon="phone" :value="member.mobile"/>
      </van-cell-group>
    </van-panel>
     <van-panel title="卡内余额">
      <van-cell-group>
        <van-cell v-for="balance in balances" :key="balance.itemno" :title="balance.itemname" :value="balance.balance" @click="showDetail(balance.itemno,balance.itemname)" is-link />
      </van-cell-group>
    </van-panel>
  </div>
</template>

<script>
import { Toast } from 'vant'
import api from '../api'
export default {
  name: 'Member',
  data () {
    return {
      show: false,
      active: 0,
      cardno: this.$route.params.cardno,
      cmpno: this.$route.params.cmpno,
      member: {},
      memberlist: [],
      balances: [],
      addHistorys: [],
      reduceHistorys: [],
      actions: []
    }
  },
  mounted: function () {
    this.getMember()
  },
  methods: {
    onClickLeft () {
      this.$router.back(-1)
    },
    onSelect (item) {
      this.show = false
      this.member = this.memberlist.filter(
        p => p.cardno === item.name
      )[0]
      this.cardno = this.member.cardno
      this.getBalance()
    },
    onCancel (item) {
    },
    showSelect () {
      this.show = true
    },
    getMember () {
      const params = {
        id: 'GetMemberByCardno',
        cmpno: this.cmpno,
        cardno: this.cardno
      }
      api.getMember(params).then(
        response => {
          if (!response.ok) {
            Toast('会员信息查询失败!请检查网络！')
          }
          if (response.data.success) {
            Toast.clear()
            this.member = response.data.data
            this.getBalance()
          } else {
            Toast('会员信息查询失败!请检查网络！')
          }
        },
        response => {
          Toast('会员信息查询失败!请稍后再试！')
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
</style>
