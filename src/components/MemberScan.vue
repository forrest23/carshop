<template>
  <div class="container">
    <van-nav-bar class="title" title="会员识别" left-text="返回" left-arrow  @click-left="onClickLeft"/>
    <van-panel title="车辆信息" icon="logistics">

      <van-cell-group>
            <van-row>
  <van-col span="22"><van-field v-model="car.plate_num" required center clearable label="牌照号" placeholder="请输入或识别牌照号" :error-message="plateNumError" @blur="onBlurPlateNum"/></van-col>
  <van-col span="2" class="button-col" ><van-uploader  :after-read="onReadVehiclePlate" accept="image/jpg" >
             <van-icon name="scan" size="20px"/>
           </van-uploader></van-col>
</van-row>
</van-cell-group>

       <van-cell :value="car.vin" title="底盘号" />
       <van-cell :value="car.fpp" title="品牌" />
       <van-cell :value="car.fcxdl" title="车系" />
       <van-cell :value="car.fcllx" title="车型名称" />
       <van-cell :value="member.classname" title="会员级别" />
       <van-cell :value="car.fcardno" title="会员卡号" @click="showMember()" is-link/>
       <van-cell :value="car.fbxgsmc" title="保险公司" />
       <van-cell :value="car.fbxdqsj" title="商业到期" />
       <van-cell :value="car.fjqzzrq" title="交强到期" />
       <van-cell :value="car.register_date" title="领证日期" />
       <van-cell :value="car.fnjdqrq" title="年检到期" />
      <van-cell :value="car.fjzdq" title="驾照到期" />
    </van-panel>

    <van-panel title="客户信息" icon="contact">
      <van-cell :value="car.custname" title="客户名称" />
       <van-cell :value="car.name" title="联系人" />
        <van-cell :value="car.mobile" title="联系电话" />
         <van-cell :value="car.address" title="联系地址" />
    </van-panel>

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import Compressor from 'compressorjs';
import api from '../api';
export default {
  name: 'MemberScan',
  data() {
    return {
      plateNumError: '',
      custnameError: '',
      nameError: '',
      mobileError: '',

      loading: false,
      finished: false,
      result: [],

      member: {},
      car: {
        fno: '',
        fcmpno: '',
        plate_num: '',
        vin: '',
        engine_num: '',
        register_date: '',
        name: '',
        num: '',
        address: '',
        mobile: '',
        fpp: '',
        fcxdl: '',
        carmodel: '',
        custno: '',
        custname: '',
        price: '',
        fbxgsmc: '',
        fbxdqsj: '',
        fjqzzrq: '',
        flzrq: '',
        fnjdqrq: '',
        fjzdq: '',
      },
    };
  },
  mounted: function() {
    this.car.fname = sessionStorage.getItem('username') || '';
    this.car.fcmpno = sessionStorage.getItem('companyno') || '';
    this.car.fcmpname = localStorage.getItem('companyname') || '';
    this.car.fno = new Date().getTime();
  },
  computed: {
    columns() {
      const column = this.citys;
      return [
        {
          values: Object.keys(column),
          className: 'column1',
        },
        {
          values: column[Object.keys(column)[0]],
          className: 'column2',
          defaultIndex: 2,
        },
      ];
    },
  },
  methods: {
    onBlurPlateNum() {
      if (this.car.plate_num) {
        const params = {
          id: 'GetCL',
          pzh: this.car.plate_num,
        };
        api.getWts(params).then(
          response => {
            if (!response.ok) {
              Toast('获取车辆信息失败!请检查网络！');
            }
            if (response.data.success) {
              if (response.data.data.length > 0) {
                this.car.vin = response.data.data[0].fdph;
                this.car.engine_num = response.data.data[0].ffdjh;
                this.car.fpp = response.data.data[0].fpp;
                this.car.fcxdl = response.data.data[0].fcxdl;
                this.car.fcllx = response.data.data[0].fcllx;
                this.car.register_date = response.data.data[0].flzrq;
                this.car.num = response.data.data[0].fsfzh;
                this.car.custno = response.data.data[0].fkhh;
                this.car.custname = response.data.data[0].fkhmc;
                this.car.name = response.data.data[0].flxr;
                this.car.mobile = response.data.data[0].fmobile;
                this.car.address = response.data.data[0].flxdz;
                this.car.fbxgsmc = response.data.data[0].fbxgsmc;
                this.car.fbxdqsj = response.data.data[0].fbxdqsj;
                this.car.fjqzzrq = response.data.data[0].fjqzzrq;
                this.car.fnjdqrq = response.data.data[0].fnjdqrq;
                this.car.fjzdq = response.data.data[0].fjzdq;
                this.car.fcardno = response.data.data[0].fcardno;
                if (this.car.fcardno !=""){
                   this.getMember();
                }
              } else{
                Toast("未找到该牌照号的会员信息！");
              }
            } else {
              Toast(response.data.message);
            }
          },
          response => {
            Toast('获取车辆信息失败!请检查网络');
          }
        );
      }
    },

    getMember() {
      const params = {
        id: 'GetMemberByCardno',
        cmpno: sessionStorage.getItem('companyno') || '',
        cardno: this.car.fcardno,
      };
      api.getMember(params).then(
        response => {
          if (!response.ok) {
            Toast('会员信息查询失败!请检查网络！');
          }
          if (response.data.success) {
            Toast.clear();
            this.member = response.data.data;
          } else {
           Toast('会员信息查询失败!请检查网络！');
          }
        },
        response => {
          Toast('会员信息查询失败!请稍后再试！');
        }
      );
    },

      showMember() {
      if (this.car.fcardno) {
        this.$router.push({
          path: '/memberBalance',
          name: 'MemberBalance',
          params: {
            cmpno: sessionStorage.getItem('companyno') || '',
            cardno: this.car.fcardno,
          },
        });
      }
    },

    onClickLeft() {
      for (var key in this.car) {
        this.car[key] = '';
      }
      this.member.classname ='';
      this.$router.back(-1);
    },

    onReadVehiclePlate(file) {
      this.uploadFile(file, 'vehiclePlate|face');
    },

    uploadFile(file, type) {
      Toast.loading({
        mask: true,
        message: '图片上传中...',
      });

      var imageFile = this.dataURLtoFile(file.content, file.name);
      var that = this;
      new Compressor(imageFile, {
        quality: 0.6,
        success(result) {
          const formData = new FormData();
          formData.append(
            type + '|' + that.car.fno + '|' + that.car.fcmpno,
            result,
            imageFile.filename
          );
          api.uploadFile(formData).then(
            response => {
              if (!response.ok || response.status !== 200) {
                Dialog.alert({
                  title: '系统提示',
                  message: '图片识别失败，请检查图片是否正确并且清晰！',
                }).then(() => {});
              }
              that.setDataField(response, type);
              Toast.clear();
            },
            response => {
              Dialog.alert({
                title: '系统提示',
                message: '图片识别失败，请检查上传的图片是否正确！',
              }).then(() => {});
            }
          );
        },
        error(err) {
          Dialog.alert({
            title: '系统提示',
            message: '图片压缩失败！',
          }).then(() => {});
        },
      });
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    setDataField(response, type) {
      console.log(response.bodyText);
      var result = JSON.parse(response.bodyText);
      switch (type) {
        case 'vehiclePlate|face':
          this.car.plate_num = result.plates[0].txt;
          this.onBlurPlateNum()
          break;
        case 'vehicle|face':
          this.car.plate_num = result.plate_num;
          this.car.vin = result.vin;
          this.car.engine_num = result.engine_num;
          this.car.register_date = result.register_date;
          break;
        case 'idcard|face':
          this.car.custname = result.name;
          this.car.name = result.name;
          this.car.num = result.num;
          this.car.address = result.address;
          break;
        case 'driver|face':
          this.car.custname = result.name;
          this.car.name = result.name;
          this.car.address = result.address;
          break;
        default:
          break;
      }
    },

    dateFtt(fmt, date) {
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          );
      return fmt;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 2px;
}

.van-popup-size {
  width: 95%;
  height: 70%;
}

.button-col {
  line-height: 44px;
}
</style>

