<template>
  <div class="container">
    <van-nav-bar class="title" title="维修接单" left-text="返回" left-arrow  @click-left="onClickLeft"/>
      <van-cell-group>
             <van-row>
  <van-col span="20"><van-field v-model="order.wtsh" required center readonly label="委托书号"/></van-col>
  <van-col span="2" class="button-col" ><van-icon name="plus" size="20px" @click="onCreateRepairOrder()"/></van-col>
  <van-col span="2" class="button-col" ><van-icon name="search" size="20px" @click="onShowRepairOrder()"/></van-col>
</van-row>
</van-cell-group>

  <van-cell-group>
             <van-row>
  <van-col span="18"><van-field v-model="order.plate_num" required center clearable label="牌照号" :readonly= "order.isOldWts"
  placeholder="请输入或识别牌照号" :error-message="plateNumError" @blur="onBlurPlateNum"/></van-col>
  <van-col span="2" class="button-col" ><van-icon name="plus" size="20px" @click="onCreateCar()"/></van-col>
  <van-col span="2" class="button-col" >
    <van-uploader :after-read="onReadVehiclePlate" accept="image/jpg" >
        <van-icon name="scan" size="20px" />
    </van-uploader>
  </van-col>
  <van-col span="2" class="button-col" ><van-icon name="more-o" size="20px" @click="showRepairHistory()"/></van-col>
</van-row>
</van-cell-group>
      <van-field v-model="order.carmodel" center readonly label="车型名称" @click="onCarModelSelect()" is-link arrow-direction="down"/> 
      <van-field v-model="order.cardno" center readonly label="会员卡号" @click="showMember()" is-link arrow-direction="right" />  
      <van-field v-model="order.custname"  center readonly label="客户名称"/>  
      <van-field v-model="order.name"  center readonly label="联系人"/>  
      <van-field v-model="order.mobile"  center readonly label="联系电话"/>  
      <van-field v-model="order.repairType" required center readonly label="修理类型" :error-message="repairTypeError" @click="onShowRepairType()" is-link arrow-direction="down"/>  
      <van-field v-model="order.mileage" required center clearable label="公里数" :error-message="mileageError" placeholder="请输入公里数"></van-field>
      <van-field v-model="order.price" required center readonly label="工时单价" :error-message="priceError"/>  
      <van-field v-model="order.completeTime" center readonly label="预计交车" @click="onShowDateSelect()" is-link arrow-direction="down"/>  

      <van-field v-model="order.fbxgsmc" center readonly label="保险公司"  @click="onShowBxgs()" is-link arrow-direction="down"/>  
      <van-field v-model="order.fbxdqsj" center readonly label="商业到期" @click="onfbxdqsjShow('商业')" is-link arrow-direction="down"/> 
      <van-field v-model="order.fjqzzrq" center readonly label="交强到期" @click="onfbxdqsjShow('交强')" is-link arrow-direction="down"/> 
      <van-field v-model="order.flzrq" center readonly label="购车日期" @click="onfbxdqsjShow('购车')" is-link arrow-direction="down"/>
      <van-field v-model="order.fnjdqrq" center readonly label="年检到期" @click="onfbxdqsjShow('年检')" is-link arrow-direction="down"/> 
      <van-field v-model="order.fjzdq" center readonly label="驾照到期" @click="onfbxdqsjShow('驾照')" is-link arrow-direction="down"/>

        <van-cell title="维修项目" @click="onShowRepairItem()" >
         <van-icon slot="right-icon" name="search"  size="20px"/>
       </van-cell>

        <van-row>
    <van-col span="10"><van-cell value="项目名称" /></van-col>
    <van-col span="6"><van-cell value="收费工时" /></van-col>
    <van-col span="6"><van-cell value="工时费" /></van-col>
    <van-col span="2"><van-cell value="" /></van-col>
  </van-row>

  <van-row v-for="(item, index) in this.order.selectRepairItem" :key="index">
    <van-col span="10"><van-field v-model="item.fxlnr" center /></van-col>
    <van-col span="6"><van-field v-model="item.fxlgs" center type='number' @blur="onChangeXlgs(item)"/></van-col>
    <van-col span="6"><van-cell :title="item.fgsf" /></van-col>
    <van-col span="2">
      <van-cell class="vancell" @click="onRemoveRepairItem(index)" >
         <van-icon slot="right-icon" name="clear"  size="20px"/>
      </van-cell>
    </van-col>
   </van-row>

<van-button size="large" type="primary" @click="onSubmit()">提交</van-button>
    <van-popup v-model="show" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择预计交车时间"
      type="datetime"
      @confirm="onDateSelect"
      @cancel="onDateCancel"
     />
    </van-popup>

    <van-popup v-model="showfbxdqsj" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择商业到期"
      type="date"
      @confirm="onfbxdqsjSelect('商业')"
      @cancel="onfbxdqsjCancel('商业')"
     />
    </van-popup>

     <van-popup v-model="showfjqzzrq" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择交强到期"
      type="date"
      @confirm="onfbxdqsjSelect('交强')"
      @cancel="onfbxdqsjCancel('交强')"
     />
    </van-popup>

    <van-popup v-model="showflzrq" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择购车到期"
      type="date"
      @confirm="onfbxdqsjSelect('购车')"
      @cancel="onfbxdqsjCancel('购车')"
     />
    </van-popup>

    <van-popup v-model="showfnjdqrq" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择年检到期"
      type="date"
      @confirm="onfbxdqsjSelect('年检')"
      @cancel="onfbxdqsjCancel('年检')"
     />
    </van-popup>


    <van-popup v-model="showfjzdq" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择驾照到期"
      type="date"
      @confirm="onfbxdqsjSelect('驾照')"
      @cancel="onfbxdqsjCancel('驾照')"
     />
    </van-popup>

   <van-popup v-model="showRepairItem" position="center" :overlay="true" class="van-popup-size">
    <van-search v-model="searchRepairItemWord"
    placeholder="请输入搜索关键词"
    show-action
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
    <van-col span="8"><van-cell :title="item.fgwh" /></van-col>
    <van-col span="12"><van-cell :title="item.fxlnr"  /></van-col>
    <van-col span="4"><van-checkbox v-model="item.checked" @change="onSelectRepairItem(item, index)" /></van-col>
   </van-row>
   </van-list>
   </van-popup>

   <van-popup v-model="showRepairOrder" position="center" :overlay="true" class="van-popup-size">
    <van-search v-model="searchRepairOrder"
    placeholder="请输入搜索关键词"
    show-action
    @search="onSearchRepairOrder"
    @cancel="onSearchRepairOrderCancel" />

  <van-row>
    <van-col span="7"><van-cell value="委托书号" /></van-col>
    <van-col span="5"><van-cell value="牌照号" /></van-col>
    <van-col span="5"><van-cell value="顾问" /></van-col>
    <van-col span="5"><van-cell value="类型" /></van-col>
    <van-col span="2"><van-cell value="" /></van-col>
  </van-row>

   <van-list
     v-model="loadingwts"
     :finished="finishedwts"
     finished-text="没有更多了"
     @load="onGetWts"
   >
   <van-row v-for="(item, index) in wts" :key="index">
    <van-col span="7"><van-cell :title="item.fwtsh" /></van-col>
    <van-col span="5"><van-cell :title="item.fpzh"  /></van-col>
    <van-col span="5"><van-cell :title="item.fywjd"  /></van-col>
    <van-col span="5"><van-cell :title="item.fxllx"  /></van-col>
    <van-col span="2"><van-checkbox v-model="item.isselect" @change="onSelectWts(item)" /></van-col>
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

    <van-actionsheet
     v-model="showBxgs"
     :actions="bxgs"
     cancel-text="取消"
     @select="onSelectBxgs"
     @cancel="onCancelBxgs"
    />

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
  name: 'RepairOrder',
  data() {
    return {
      show: false,
      showfbxdqsj: false,
      showfjqzzrq: false,
      showflzrq: false,
      showfnjdqrq: false,
      showfjzdq: false,

      showRepairItem: false,
      showRepairOrder: false,
      ShowRepairType: false,
      showCarModel: false,
      showBxgs: false,
      minHour: 10,
      maxHour: 20,
      currentDate: new Date(),

      plateNumError: '',
      repairTypeError: '',
      mileageError: '',
      priceError:'',

      repairItems: [],
      repairTypes: [],
      bxgs: [],

      searchRepairItemWord: '',
      searchRepairOrder: '',
      wts: [],
      repairItemsloading: false,
      repairItemsfinished: false,
      loadingwts: false,
      finishedwts: false,
      result: [],
      fzjgno:'',

      active: 0,
      member: {},
      order: {
        wtsh: '',
        isOldWts: false,
        plate_num: '',
        fpp: '',
        fcxdl: '',
        carmodel: '',
        cardno: '',
        custname: '',
        name: '',
        mobile: '',
        repairType: '',
        mileage: '',
        price: 0,
        completeTime: '',
        fywjd: '',
        fkhh: '',
        fdph: '',
        ffdjh: '',
        fbxgsmc: '',
        fbxdqsj: '',
        fjqzzrq: '',
        flzrq: '',
        fnjdqrq: '',
        fjzdq: '',
        selectRepairItem: [],
      },

      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
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
    this.order.fno = new Date().getTime();
    this.createWtsh();
    this.getPP();
    this.getXllx();
    this.getBxgs();
    this.getFzjgno();
  },

  methods: {
    getCar(car) {
      this.order.name = car.name;
      this.order.mobile = car.mobile;
      this.order.plate_num = car.plate_num;
      this.order.carmodel = car.carmodel;
      this.order.fpp = car.fpp;
      this.order.fcxdl = car.fcxdl;
      this.order.custname = car.custname;
      this.order.price = car.price;
      this.order.fkhh = car.custno;
      this.order.fdph = car.vin;
      this.order.ffdjh = car.engine_num;
      this.order.fbxgsmc = car.fbxgsmc;
      this.order.fbxdqsj = car.fbxdqsj;
      this.order.fjqzzrq = car.fjqzzrq;
      this.order.flzrq = car.register_date;
      this.order.fnjdqrq = car.fnjdqrq;
      this.order.fjzdq = car.fjzdq;
    },
    createWtsh() {
      const params = {
        id: 'createWtsh',
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取委托书号失败!请检查网络！');
          }
          if (response.data.success) {
            this.order.isOldWts = false;
            this.order.wtsh = response.data.data;
            this.order.price = 0;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取委托书号失败!请检查网络');
        }
      );
    },
    getXllx() {
      const params = {
        id: 'getXllx',
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取修理类型失败!请检查网络！');
          }
          if (response.data.success) {
            this.repairTypes = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取修理类型失败!请检查网络');
        }
      );
    },
    getBxgs() {
      const params = {
        id: 'GetBxgs',
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取保险公司失败!请检查网络！');
          }
          if (response.data.success) {
            this.bxgs = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取保险公司失败!请检查网络');
        }
      );
    },
    getWts() {
      const params = {
        id: 'GetWts',
        wtsh: '',
        ywjd: sessionStorage.getItem('username') || '',
        fzjgno: this.fzjgno
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取委托书列表失败!请检查网络！');
          }
          if (response.data.success) {
            this.wts = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取委托书列表失败!请检查网络');
        }
      );
    },
    getXlxm() {
      const params = {
        id: 'GetXlxm',
        xlxm: '',
        cxbz: '001',
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取修理项目失败!请检查网络！');
          }
          if (response.data.success) {
            this.repairItems = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取修理项目失败!请检查网络');
        }
      );
    },

    getFzjgno() {
      const params = {
        id: 'getFzjgno',
        fywjd: sessionStorage.getItem('username') || '',
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取员工分支机构编号失败!请检查网络！');
          }
          if (response.data.success) {
            this.fzjgno = response.data.data;
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取员工分支机构编号失败!请检查网络');
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

    getXlgsdj(pp, cxdl, cllx) {
      const params = {
        id: 'GetCllx',
        pp,
        cxdl,
        cllx,
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取修理工时单价失败!请检查网络！');
          }
          if (response.data.success) {
            if (response.data.data && response.data.data.length == 1) {
              this.order.price = response.data.data[0].fxlgsdj;
              this.order.selectRepairItem.forEach(ele => {
                ele.fgsf = this.order.price * ele.fxlgs;
              });
            } else {
              Toast('未找到该车型的工时单价信息!');
            }
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取修理工时单价失败!请检查网络');
        }
      );
    },

    getWtsDetail(wtsh) {
      const params = {
        id: 'GetWtsDetail',
        wtsh,
      };
      api.getWts(params).then(
        response => {
          if (!response.ok) {
            Toast('获取委托书明细失败!请检查网络！');
          }
          if (response.data.success) {
            response.data.data.forEach(item => {
              item.fgsf = this.order.price * item.fxlgs;
              this.order.selectRepairItem.push(item);
            });
          } else {
            Toast(response.data.message);
          }
        },
        response => {
          Toast('获取委托书明细失败!请检查网络');
        }
      );
    },

    onCarModelSelect() {
      this.showCarModel = true;
    },
    onCarModelCancel() {
      this.showCarModel = false;
    },
    onCarModelConfirm(data) {
      this.order.fpp = data[0].name;
      this.order.fcxdl = data[1].name;
      this.order.carmodel = data[2].name;
      this.getXlgsdj(data[0].name, data[1].name, data[2].name);

      this.showCarModel = false;
    },

    onBlurPlateNum() {
      if (this.order.plate_num && this.order.plate_num.length > 0) {
        const params = {
          id: 'GetCL',
          pzh: this.order.plate_num,
        };
        api.getWts(params).then(
          response => {
            if (!response.ok) {
              Toast('获取车辆信息失败!请检查网络！');
            }
            if (response.data.success) {
              if (response.data.data.length > 0) {
                this.order.plate_num = response.data.data[0].fpzh;
                this.order.fcxdl = response.data.data[0].fcxdl;
                this.order.fpp = response.data.data[0].fpp;
                this.order.carmodel = response.data.data[0].fcllx;
                this.order.custname = response.data.data[0].fkhmc;
                this.order.name = response.data.data[0].flxr;
                this.order.mobile = response.data.data[0].fmobile;
                this.order.cardno = response.data.data[0].fcardno;

                this.order.fkhh = response.data.data[0].fkhh;
                this.order.fdph = response.data.data[0].fdph;
                this.order.ffdjh = response.data.data[0].ffdjh;

                this.order.fbxgsmc = response.data.data[0].fbxgsmc;
                this.order.flzrq = response.data.data[0].flzrq;
                this.order.fbxdqsj = response.data.data[0].fbxdqsj;
                this.order.fjqzzrq = response.data.data[0].fjqzzrq;
                this.order.fnjdqrq = response.data.data[0].fnjdqrq;
                this.order.fjzdq = response.data.data[0].fjzdq;

                this.getXlgsdj(
                  response.data.data[0].fpp,
                  response.data.data[0].fcxdl,
                  response.data.data[0].fcllx
                );
              } else {
                Dialog.confirm({
                  message: '未找到该牌照号的车辆，是否新建？',
                })
                  .then(() => {
                    this.$router.push({
                      path: '/createCar',
                      name: 'CreateCar',
                      params: {
                        plate_num: this.order.plate_num,
                      },
                    });
                  })
                  .catch(() => {});
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
    onClickLeft() {
      for (var key in this.order) {
        this.order[key] = '';
      }
      this.createWtsh();
      this.order.selectRepairItem = [];
      this.order.fno = new Date().getTime();
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

    onShowBxgs() {
      this.showBxgs = true;
    },
    onSelectBxgs(item) {
      this.order.fbxgsmc = item.name;
      this.showBxgs = false;
    },
    onCancelBxgs() {
      this.showBxgs = false;
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

    onfbxdqsjSelect(type) {
      var selectDate = this.dateFtt('yyyy-MM-dd', this.currentDate);
      switch (type) {
        case '商业':
          this.order.fbxdqsj = selectDate;
          this.showfbxdqsj = false;
          break;
        case '交强':
          this.order.fjqzzrq = selectDate;
           this.showfjqzzrq = false;
          break;
        case '购车':
          this.order.flzrq = selectDate;
           this.showflzrq = false;
          break;
        case '年检':
          this.order.fnjdqrq = selectDate;
           this.showfnjdqrq = false;
          break;
        case '驾照':
          this.order.fjzdq = selectDate;
           this.showfjzdq = false;
          break;
        default:
          break;
      }
    },
    onfbxdqsjCancel(type) {
      switch (type) {
        case '商业':
          this.showfbxdqsj = false;
          break;
        case '交强':
          this.showfjqzzrq = false;
          break;
        case '购车':
          this.showflzrq = false;
          break;
        case '年检':
          this.showfnjdqrq = false;
          break;
        case '驾照':
          this.showfjzdq = false;
          break;
        default:
          break;
      }
    },
    onfbxdqsjShow(type) {
     switch (type) {
        case '商业':
          this.showfbxdqsj = true;
          break;
        case '交强':
          this.showfjqzzrq = true;
          break;
        case '购车':
          this.showflzrq = true;
          break;
        case '年检':
          this.showfnjdqrq = true;
          break;
        case '驾照':
          this.showfjzdq = true;
          break;
        default:
          break;
      }
    },

    onSearchRepairItem() {
      this.repairItems = this.repairItems.filter(
        p =>
          p.fgwh.indexOf(this.searchRepairItemWord) > -1 ||
          p.fxlnr.indexOf(this.searchRepairItemWord) > -1
      );
    },
    onSearchRepairItemCancel() {
      this.getXlxm();
    },
    onSelectRepairItem(item, index) {
      this.showRepairItem = false;
      if (item.checked) {
        item.fgsf = this.order.price * item.fxlgs;
        this.order.selectRepairItem.push(item);
        item.checked = false;
      }
    },
    onShowRepairItem() {
      this.showRepairItem = true;
    },
    onRemoveRepairItem(index) {
      this.order.selectRepairItem.splice(index, 1);
    },
    onGetWts() {
      this.loadingwts = false;
      this.finishedwts = false;
    },
    onSelectWts(item) {
      if (item.isselect) {
        this.showRepairOrder = false;
        this.order.wtsh = item.fwtsh;
        this.order.plate_num = item.fpzh;
        this.order.repairType = item.fxllx;
        this.order.mileage = item.fgls;
        this.order.price = item.fxlgsdj;
        this.order.carmodel = item.fcllx;
        this.order.isOldWts = true;
        this.order.completeTime = item.fjcrq;
        this.order.selectRepairItem = [];
        item.isselect = false;
        this.onBlurPlateNum();
        this.getWtsDetail(item.fwtsh);
      }
    },

    onSearchRepairOrder() {
      this.wts = this.wts.filter(
        p =>
          p.fpzh.indexOf(this.searchRepairOrder) > -1 ||
          p.fwtsh.indexOf(this.searchRepairOrder) > -1
      );
    },
    onSearchRepairOrderCancel() {
      this.getWts();
    },
    onShowRepairOrder() {
      this.showRepairOrder = true;
      this.getWts();
    },
    onChangeXlgs(item) {
      item.fgsf = item.fxlgs * this.order.price;
    },
    onCreateCar() {
      if (this.order.isOldWts) {
        Toast('已有委托书不能修改牌照号！');
        return;
      }
      this.$router.push({
        path: '/createCar',
        name: 'CreateCar',
        params: {
          member: '',
        },
      });
    },

    showRepairHistory() {
      if (!this.order.plate_num) {
        Toast('牌照号为空，无法查询维修历史！');
        return;
      }
      this.$router.push({
        path: '/repairHistory',
        name: 'RepairHistory',
        query: {
          plate_num: this.order.plate_num,
        },
      });
    },

    getRepairItems() {
      this.getXlxm();
      this.repairItemsloading = false;
      this.repairItemsfinished = true;
    },

    showMember() {
      if (this.order.cardno) {
        this.$router.push({
          path: '/memberBalance',
          name: 'MemberBalance',
          params: {
            cmpno: sessionStorage.getItem('companyno') || '',
            cardno: this.order.cardno,
          },
        });
      }
    },

    onCreateRepairOrder() {
      this.order.isOldWts = false;
      for (var key in this.order) {
        this.order[key] = '';
      }
      this.order.selectRepairItem = [];
      this.order.fno = new Date().getTime();
      this.createWtsh();
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

      if (this.order.price === ''){
        this.priceError = '工时单价不能为空';
        return;
      }
      this.priceError = '';

      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '正在提交数据',
      });

      this.order.fywjd = sessionStorage.getItem('username') || '';
      this.order.fcmpno = sessionStorage.getItem('companyno') || '';
      this.order.fcmpname = localStorage.getItem('companyname') || '';

      api.SaveWts(this.order).then(
        response => {
          if (!response.ok) {
            Toast.clear();
            Dialog.alert({
              title: '系统提示',
              message: '委托书保存失败!请检查网络！',
            }).then(() => {});
          }
          if (response.data.success) {
            this.onCreateRepairOrder();
            Toast.success('委托书提交成功');
          } else {
            Toast.clear();
            Dialog.alert({
              title: '系统提示',
              message: '委托书失败!请检查数据！',
            }).then(() => {});
          }
        },
        response => {
          Toast.clear();
          Dialog.alert({
            title: '系统提示',
            message: '车辆保存失败!请检查网络！',
          }).then(() => {});
        }
      );
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
      if (this.order.isOldWts) {
        Toast('已有委托书不能修改牌照号！');
        return;
      }
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
            type +
              '|' +
              that.order.fno +
              '|' +
              sessionStorage.getItem('companyno') || '',
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
  width: 96%;
  height: 70%;
}

.button-col {
  line-height: 44px;
}

.vancell {
  padding-left: 0px;
}

.padding-right {
  padding-right: 10px;
}
</style>

