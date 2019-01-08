<template>
  <div class="container">
    <van-nav-bar class="title" title="维修接单" left-text="返回" left-arrow  @click-left="onClickLeft"/>
      <van-cell-group>
             <van-row class="button-row">
  <van-col span="22"><van-field v-model="order.wtsh" required center readonly label="委托书号"/></van-col>
  <van-col span="2" class="button-col" ><van-icon name="search" size="20px" @click="onShowRepairOrder()"/></van-col>
</van-row>
</van-cell-group>

  <van-cell-group>
             <van-row class="button-row">
  <van-col span="20"><van-field v-model="order.plate_num" required center clearable label="牌照号" placeholder="请输入或识别牌照号" :error-message="plateNumError"/></van-col>
  <van-col span="2" class="button-col" ><van-icon name="plus" size="20px" @click="onCreateCar()"/></van-col>
  <van-col span="2" class="button-col" >
    <van-uploader :after-read="onReadVehiclePlate" accept="image/jpg" >
             <van-icon name="scan" size="20px" />
           </van-uploader>
    </van-col>
</van-row>
</van-cell-group>

      <van-field v-model="order.carmodel" center readonly label="车型名称"/>
      <van-field v-model="order.cardno" center readonly label="会员卡号"/>  
      <van-field v-model="order.custname"  center readonly label="客户名称"/>  
      <van-field v-model="order.name"  center readonly label="联系人"/>  
      <van-field v-model="order.mobile"  center readonly label="联系电话"/>  
      <van-field v-model="order.repairType" required center readonly label="修理类型" :error-message="repairTypeError" @click="onShowRepairType()" is-link arrow-direction="down"/>  
       <van-field v-model="order.mileage" required center clearable label="公里数" :error-message="mileageError" placeholder="请输入公里数"></van-field>
       <van-field v-model="order.price" center readonly label="工时单价"/>  
       <van-field v-model="order.completeTime" center readonly label="预计交车" @click="onShowDateSelect()" is-link arrow-direction="down"/>  

        <van-cell title="维修项目" @click="onShowRepairItem()" >
         <van-icon slot="right-icon" name="search"  size="20px"/>
       </van-cell>

        <van-row>
    <van-col span="6"><van-cell value="项目代码" /></van-col>
    <van-col span="6"><van-cell value="项目名称" /></van-col>
    <van-col span="6"><van-cell value="收费工时" /></van-col>
    <van-col span="6"><van-cell value="工时费" /></van-col>
  </van-row>

  <van-row v-for="(item, index) in selectRepairItem" :key="index">
    <van-col span="6"><van-cell :title="item.itemno" /></van-col>
    <van-col span="6"><van-cell :title="item.itemname" /></van-col>
    <van-col span="6"><van-cell :title="item.sfgs" /></van-col>
    <van-col span="6"><van-cell :title="item.gsf" /></van-col>
   </van-row>

<van-button size="large" type="primary" @click="onSubmit()">提交</van-button>
     <!-- <van-panel title="维修项目">
        <van-icon slot="right-icon" name="search" class="custom-icon" />
     </van-panel> -->
    <van-popup v-model="show" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择预计交车时间"
      type="datetime"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateSelect"
      @cancel="onDateCancel"
     />
    </van-popup>

   <van-popup v-model="showRepairItem" position="center" :overlay="true" class="van-popup-size">
    <van-search v-model="searchRepairItemWord"
    placeholder="请输入搜索关键词"
    @search="onSearchRepairItem"
    @cancel="onSearchRepairItemCancel" />

  <van-row>
    <van-col span="8"><van-cell value="项目代码" /></van-col>
    <van-col span="12"><van-cell value="项目名称" /></van-col>
  </van-row>

   <van-list
     v-model="repairItemsloading"
     :finished="repairItemsfinished"
     finished-text="没有更多了"
     @load="getRepairItems"
   >
   <van-row v-for="(item, index) in repairItems" :key="index">
    <van-col span="8"><van-cell :title="item.itemno" /></van-col>
    <van-col span="12"><van-cell :title="item.itemname"  /></van-col>
    <van-col span="4"><van-checkbox v-model="item.checked" @change="onSelectRepairItem(item, index)" /></van-col>
   </van-row>
   </van-list>
   </van-popup>

   <van-popup v-model="showRepairOrder" position="center" :overlay="true" class="van-popup-size">
    <van-search v-model="searchRepairOrder"
    placeholder="请输入搜索关键词"
    @search="onSearchRepairOrder"
    @cancel="onSearchRepairOrderCancel" />

  <van-row>
    <van-col span="6"><van-cell value="委托书号" /></van-col>
    <van-col span="6"><van-cell value="牌照号" /></van-col>
    <van-col span="6"><van-cell value="服务顾问" /></van-col>
    <van-col span="6"><van-cell value="修理类型" /></van-col>
  </van-row>

   <van-list
     v-model="loadingwts"
     :finished="finishedwts"
     finished-text="没有更多了"
     @load="onGetWts"
   >
   <van-row v-for="(item, index) in wts" :key="index">
    <van-col span="5"><van-cell :title="item.wtsh" /></van-col>
    <van-col span="7"><van-cell :title="item.plate_num"  /></van-col>
    <van-col span="4"><van-cell :title="item.fwgw"  /></van-col>
    <van-col span="5"><van-cell :title="item.repairType"  /></van-col>
    <van-col span="3"><van-checkbox v-model="item.checked" @change="onSelectWts(item)" /></van-col>
   </van-row>
   </van-list>
   </van-popup>

     <van-actionsheet
     v-model="ShowRepairType"
     :actions="repairTypes"
     cancel-text="取消"
     @select="onSelectRepairType"
     @cancel="onCancelRepairType"
    />

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import Compressor from 'compressorjs';
import api from '../api';
export default {
  name: 'RepairOrder',
  data() {
    return {
      show: false,
      showRepairItem: false,
      showRepairOrder: false,
      ShowRepairType: false,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date(),

      plateNumError: '',
      repairTypeError: '',
      mileageError: '',

      wtslist: [
        {
          wtsh: '0001',
          plate_num: '沪FA5V05',
          fwgw: '小甲',
          repairType: '保养',
        },
        {
          wtsh: '0002',
          plate_num: '沪EA5H87',
          fwgw: '小已',
          repairType: '事故车',
        },
        {
          wtsh: '0003',
          plate_num: '沪EA5H88',
          fwgw: '小兵',
          repairType: '返修',
        },
      ],
      repairItems: [],
      repairItemsRemote: [
        { itemno: '0001', itemname: '大保养', sfgs: '10', gsf: '20.0' },
        { itemno: '0002', itemname: '小保养', sfgs: '20', gsf: '20.0' },
        { itemno: '0003', itemname: '事故车维修', sfgs: '30', gsf: '25.0' },
      ],

      repairTypes: [{ name: '事故车' }, { name: '保养' }, { name: '返修' }],
      selectRepairItem: [],
      searchRepairItemWord: '',
      searchRepairOrder: '',
      wts: [],
      repairItemsloading: false,
      repairItemsfinished: false,
      loadingwts: false,
      finishedwts: false,
      result: [],

      active: 0,
      openid: '',
      cmpno: this.$route.query.cmpno || '1001',
      member: {},
      order: {
        wtsh: '',
        plate_num: '',
        carmodel: '',
        cardno: '',
        custname: '',
        name: '',
        mobile: '',
        repairType: '',
        mileage: '',
        price: '',
        completeTime: '',
      },
    };
  },

  created: function() {
    this.$eventHub.$on('createCar', this.getCar);
  },
  beforeDestroy() {
    this.$eventHub.$off('createCar');
  },

  mounted: function() {
    this.openid = this.$cookies.get('openid') || 'oYXbkskh5y8g6IyImR82i-maAQMs';
    this.order.fname = sessionStorage.getItem('username') || '';
    this.order.fcmpno = sessionStorage.getItem('companyno') || '';
    this.order.fcmpname = localStorage.getItem('companyname') || '';
    this.order.fno = new Date().getTime();
    this.order.wtsh = new Date().getTime();
  },

  methods: {
    getCar(car) {
      this.order.name = car.name;
      this.order.mobile = car.mobile;
      this.order.plate_num = car.plate_num;
      this.order.carmodel = car.carmodel;
      this.order.custname = car.custname;
    },
    onClickLeft() {
      for (var key in this.order) {
        this.order[key] = '';
      }
      this.selectRepairItem = [];
      this.$router.back(-1);
    },
    onShowRepairType() {
      this.ShowRepairType = true;
    },
    onSelectRepairType(item) {
      this.order.repairType = item.name;
      this.ShowRepairType = false;
    },
    onCancelRepairType() {
      this.ShowRepairType = false;
    },

    onDateSelect() {
      this.show = false;
      this.order.completeTime = this.dateFtt(
        'yyyy-MM-dd hh:mm',
        this.currentDate
      );
    },
    onDateCancel() {
      this.show = false;
    },
    onShowDateSelect() {
      this.show = true;
    },

    onSearchRepairItem() {},
    onSearchRepairItemCancel() {},
    onSelectRepairItem(item, index) {
      this.showRepairItem = false;
      if (item.checked) {
        this.selectRepairItem.push(item);
      } else {
        this.selectRepairItem.splice(index, 1);
      }
    },
    onShowRepairItem() {
      this.showRepairItem = true;
    },

    onGetWts() {
      this.wts = this.wtslist;
      this.loadingwts = false;
      this.finishedwts = false;
    },
    onSelectWts(item) {
      this.showRepairOrder = false;
      this.order.wtsh = item.wtsh;
      this.order.plate_num = item.plate_num;
      this.order.repairType = item.repairType;
      item.checked = false;
    },

    onSearchRepairOrder() {},
    onSearchRepairOrderCancel() {},
    onShowRepairOrder() {
      this.showRepairOrder = true;
    },

    onCreateCar() {
      this.$router.push({
        path: '/createCar',
        name: 'CreateCar',
        params: {
          member: '',
        },
      });
    },

    getRepairItems() {
      this.repairItems = this.repairItemsRemote;
      this.repairItemsloading = false;
      this.repairItemsfinished = true;
    },

    onSubmit() {
      if (this.order.plate_num === '') {
        this.plateNumError = '请输入或识别牌照号';
        return;
      }
      this.plateNumError = '';

      if (this.order.repairType === '') {
        this.repairTypeError = '请选择修理类型';
        return;
      }
      this.repairTypeError = '';

      if (this.order.mileage === '') {
        this.mileageError = '请选输入公里数';
        return;
      }
      this.mileageError = '';
      if (this.selectRepairItem.length == 0) {
        Toast.fail('请选择维修项目');
        return;
      }

      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '正在提交数据',
      });

      let second = 3;
      const timer = setInterval(() => {
        second--;
        if (second) {
        } else {
          clearInterval(timer);
          for (var key in this.order) {
            this.order[key] = '';
          }
          this.selectRepairItem = [];
          this.order.wtsh = new Date().getTime();
          Toast.success('提交成功');
        }
      }, 1000);
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
            type + '|' + that.order.fno + '|' + that.order.fcmpno,
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
          this.order.plate_num = result.plates[0].txt;
          break;
        default:
          break;
      }
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

.padding-right {
  padding-right: 10px;
}
</style>

