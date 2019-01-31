<template>
  <div class="container">
    <van-nav-bar class="title" title="新建车辆" left-text="返回" left-arrow  @click-left="onClickLeft"/>
    <van-panel title="车辆信息" icon="logistics">
            <van-row class="button-row">
  <van-col span="22"><van-field v-model="car.plate_num" required center clearable label="牌照号" placeholder="请输入或识别牌照号" :error-message="plateNumError" @blur="onBlurPlateNum"/></van-col>
  <van-col span="2" class="button-col" ><van-uploader  :after-read="onReadVehicle" accept="image/jpg" >
             <van-icon name="scan" size="20px"/>
           </van-uploader></van-col>
</van-row>
       <van-field v-model="car.vin" center clearable label="底盘号" placeholder="请输入底盘号">
       </van-field>
        <van-field v-model="car.engine_num" center clearable label="发动机号" placeholder="请输入发动机号">
       </van-field>

       <van-field v-model="car.carmodel" center readonly label="车型名称" @click="onCarModelSelect()" is-link arrow-direction="down"/> 

     <van-field v-model="car.register_date" center readonly label="领证日期" @click="onShowDateSelect()" is-link arrow-direction="down"/> 

    </van-panel>

    <van-panel title="客户信息" icon="contact">
         <van-row class="button-row">
  <van-col span="22"><van-field v-model="car.custname" required center label="客户名称" :error-message="custnameError"/></van-col>
  <van-col span="2" class="button-col" ><van-icon name="search" size="20px" @click="onShowCust()"/></van-col>
</van-row>

        <van-row class="button-row">
  <van-col span="22"><van-field v-model="car.name" required center clearable label="联系人" placeholder="请输入联系人" :error-message="nameError"/></van-col>
  <van-col span="2" class="button-col" ><van-uploader  :after-read="onReadDriver" accept="image/jpg" >
             <van-icon name="scan" size="20px" />
           </van-uploader></van-col>
</van-row>
       <van-field v-model="car.mobile" required center clearable label="联系电话" placeholder="请输入联系电话" :error-message="mobileError"/>  

        <van-row class="button-row">
  <van-col span="22"><van-field v-model="car.num"  center clearable label="身份证号" placeholder="请输入身份证号"/></van-col>
  <van-col span="2" class="button-col" ><van-uploader  :after-read="onReadIdcard" accept="image/jpg" >
             <van-icon name="scan" size="20px" />
           </van-uploader></van-col>
</van-row>
       <van-field v-model="car.address" center clearable label="联系地址" placeholder="请输入联系地址"/>  
    </van-panel>

    <van-button size="large" type="primary" @click="onSubmit()">提交</van-button>

    <van-popup v-model="showDate" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择领证日期"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateSelect"
      @cancel="onDateCancel"
     />
    </van-popup>

   <van-popup v-model="showCust" position="center" :overlay="true" class="van-popup-size">
    <van-search v-model="searchCustWord"
    placeholder="请输入搜索关键词"
    @search="onSearchCust"
    @cancel="onSearchCustCancel" />

  <van-row>
    <van-col span="6"><van-cell value="客户号" /></van-col>
    <van-col span="18"><van-cell value="客户名称" /></van-col>
  </van-row>

   <van-list
     v-model="loading"
     :finished="finished"
     finished-text="没有更多了"
     @load="getBalance"
   >
   <van-row v-for="(item, index) in balances" :key="index">
    <van-col span="6"><van-cell :title="item.custno" /></van-col>
    <van-col span="16"><van-cell :title="item.custname"  /></van-col>
    <van-col span="2"><van-checkbox v-model="item.checked" @change="onSelectCust(item)" /></van-col>
   </van-row>
   </van-list>
   </van-popup>

   <van-popup v-model="showCarModel" position="center" :overlay="true" class="van-popup-size">
    <van-area :area-list="areaList" @confirm="onCarModelConfirm" @cancel="onCarModelCancel"/>
   </van-popup>

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import Compressor from 'compressorjs';
import api from '../api';
export default {
  name: 'CreateCar',
  data() {
    return {
      showDate: false,
      showCust: false,
      showRepairOrder: false,
      showCarModel: false,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date(),

      plateNumError: '',
      custnameError: '',
      nameError: '',
      mobileError: '',

      selectRepairItem: [],
      searchRepairItemWord: '',
      searchRepairOrder: '',
      searchCustWord: '',
      balances: [],
      loading: false,
      finished: false,
      result: [],

      active: 0,
      openid: '',
      member: {},
      order: {},
      car: {
        fno: '',
        fcmpno: '111',
        plate_num: '',
        vin: '',
        engine_num: '',
        register_date: '',
        name: '',
        num: '',
        address: '',
        mobile: '',
        carmodel: '',
        custname: '',
      },
      customers: [
        { custno: '0001', custname: '客户1', name: '客户1' },
        { custno: '0001', custname: '客户2', name: '客户2' },
      ],

      citys: {
        浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        福建: ['福州', '厦门', '莆田', '三明', '泉州'],
      },

      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
    };
  },
  mounted: function() {
    this.car.fname = sessionStorage.getItem('username') || '';
    this.car.fcmpno = sessionStorage.getItem('companyno') || '';
    this.car.fcmpname = localStorage.getItem('companyname') || '';
    this.car.plate_num = this.$route.params.plate_num;
    this.car.fno = new Date().getTime();
    this.getPP();
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
              Toast('该车辆信息已经存在！');
            }
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取车辆信息失败!请检查网络');
        }
      );
    },

    getPP() {
      const params = {
        id: 'GetAllCllx',
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取车辆品牌信息失败!请检查网络！');
          }
          if (response.data.success) {
            response.data.data.province_list.forEach(ele => {
              this.areaList.province_list[ele.fxh] = ele.fvalue;
            });
            response.data.data.city_list.forEach(ele => {
              this.areaList.city_list[ele.fxh] = ele.fvalue;
            });
            response.data.data.county_list.forEach(ele => {
              this.areaList.county_list[ele.fxh] = ele.fvalue;
            });
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取车辆品牌信息失败!请检查网络!');
        }
      );
    },

    onClickLeft() {
      this.$router.back(-1);
    },

    onReadDriver(file) {
      this.uploadFile(file, 'driver|face');
    },

    onReadVehicle(file) {
      this.uploadFile(file, 'vehicle|face');
    },

    onReadIdcard(file) {
      this.uploadFile(file, 'idcard|face');
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

    onShowCust() {
      this.showCust = true;
    },
    onSelectCust(item) {
      this.showCust = false;
      this.car.custname = item.custname;
      this.car.name = item.name;
      item.checked = false;
    },
    onCancelCust() {
      this.showCust = false;
    },
    onSearchCust() {},
    onSearchCustCancel() {},

    onDateSelect() {
      this.showDate = false;
      this.car.register_date = this.dateFtt('yyyy-MM-dd', this.currentDate);
    },
    onDateCancel() {
      this.showDate = false;
    },
    onShowDateSelect() {
      this.showDate = true;
    },

    onCarModelCancel() {
      this.showCarModel = false;
    },
    onCarModelConfirm(data) {
      this.car.carmodel = data[2].name;
      this.showCarModel = false;
    },

    onSearchRepairItem() {},
    onSearchRepairItemCancel() {},
    onSelectRepairItem() {
      this.selectRepairItem = this.balances.filter(p => p.checked == true);
    },
    onShowRepairItem() {
      this.showRepairItem = true;
    },

    onSearchRepairOrder() {},
    onSearchRepairOrderCancel() {},
    onShowRepairOrder() {
      this.showRepairOrder = true;
    },

    onCarModelSelect() {
      this.showCarModel = true;
    },

    onSubmit() {
      if (this.car.plate_num === '') {
        this.plateNumError = '请输入或识别牌照号';
        return;
      }
      this.plateNumError = '';
      if (this.car.custname === '') {
        this.custnameError = '请输入客户名称';
        return;
      }
      this.custnameError = '';
      if (this.car.name === '') {
        this.nameError = '请输入联系人';
        return;
      }
      this.nameError = '';
      if (this.car.mobile === '') {
        this.mobileError = '请输入联系电话';
        return;
      }
      this.mobileError = '';

      const toast = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: '正在创建车辆',
      });

      api.SaveCl(this.car).then(
        response => {
          if (!response.ok) {
            Dialog.alert({
              title: '系统提示',
              message: '车辆保存失败!请检查网络！',
            }).then(() => {});
          }
          if (response.data.success) {
            Toast.success('车辆保存成功！');
            this.$eventHub.$emit('createCar', this.car);
            this.$router.back(-1);
          } else {
            Dialog.alert({
              title: '系统提示',
              message: '车辆保存失败!请检查数据！',
            }).then(() => {});
          }
        },
        response => {
          Dialog.alert({
            title: '系统提示',
            message: '车辆保存失败!请检查网络！',
          }).then(() => {});
        }
      );

      // let second = 3;
      // const timer = setInterval(() => {
      //   second--;
      //   if (second) {
      //   } else {
      //     clearInterval(timer);
      //     Toast.success('创建成功');
      //     this.$eventHub.$emit('createCar', this.car);
      //     this.$router.back(-1);
      //   }
      // }, 1000);
    },

    getBalance() {
      this.balances = this.customers;
      this.loading = false;
      this.finished = true;
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

