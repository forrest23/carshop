<template>
  <div>
    <van-nav-bar title="拍照识别" :left-text="carIdModel.fname"  right-text="提交" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div>
       <van-row type="flex" class="button-row">
         <van-col span="4" class="button-col">
           <van-uploader :after-read="onReadVehiclePlate" accept="image/jpg">
             <van-icon name="photograph" />
              车牌号
           </van-uploader>
         </van-col>
          <van-col span="4" class="button-col">
           <van-uploader :after-read="onReadVehicle" accept="image/jpg,image/jpeg">
             <van-icon name="photograph" />
              行驶证
           </van-uploader>
           </van-col>
         <van-col span="4" class="button-col">
           <van-uploader :after-read="onReadIdcard" accept="image/jpg,image/jpeg">
             <van-icon name="photograph" />
              身份证
           </van-uploader>
         </van-col>
         <van-col span="4" class="button-col">
           <van-uploader :after-read="onReadDriver" accept="image/jpg,image/jpeg">
             <van-icon name="photograph" />
              驾驶证
           </van-uploader>
           </van-col>
         <van-col span="4" class="button-col"><van-uploader :after-read="onReadGenerale" accept="image/jpg,image/jpeg">
             <van-icon name="photograph" />
              自由拍
           </van-uploader>
           </van-col>
         <van-col span="4" class="button-col">
           <van-uploader :after-read="onReadPhoto" accept="iimage/jpg,image/jpeg">
             <van-icon name="photograph" />
              拍照
           </van-uploader></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="车牌号" v-model="carIdModel.plate_num" /></van-col>
         <van-col span="8"><van-field label="油表数" v-model="carIdModel.oil_meter" /></van-col>
         <van-col span="8"><van-field label="公里数" v-model="carIdModel.mileage" /></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="16"><van-field label="车架号" v-model="carIdModel.vin" /></van-col>
         <van-col span="10"><van-field label="发动机号" v-model="carIdModel.engine_num" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="16"><van-field label="厂牌型号" v-model="carIdModel.model" /></van-col>
         <van-col span="10"><van-field label="初登日期" v-model="carIdModel.register_date" /></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="24"><van-field label="车主" v-model="carIdModel.owner" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="车主地址" v-model="carIdModel.addr" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="身份证名" v-model="carIdModel.name" /></van-col>
         <van-col span="8"><van-field label="性别" v-model="carIdModel.sex" /></van-col>
         <van-col span="8"><van-field label="民族" v-model="carIdModel.nationality" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="身份证号" v-model="carIdModel.num" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="身份证地址" v-model="carIdModel.address" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="驾照姓名" v-model="carIdModel.driver_name" /></van-col>
         <van-col span="8"><van-field label="性别" v-model="carIdModel.driver_sex" /></van-col>
         <van-col span="8"><van-field label="准驾车型" v-model="carIdModel.vehicle_type" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="驾照地址" v-model="carIdModel.driver_addr" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="驾照到期" v-model="carIdModel.driver_end_date" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="自由拍信息" type="textarea" v-model="carIdModel.generale" rows="1" autosize/></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="8"><img :src="plate_image" width="100px"/></van-col>
         <van-col span="8"><img :src="vehicle_image" width="100px"/></van-col>
         <van-col span="8"><img :src="idcard_image" width="100px"/></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><img :src="driver_image" width="100px"/></van-col>
         <van-col span="8"><img :src="generale_image" width="100px"/></van-col>
         <van-col span="8"><img :src="photo_image" width="100px"/></van-col>
       </van-row>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import Compressor from 'compressorjs';
import api from '../api';
export default {
  name: 'Photo',
  data() {
    return {
      plate_image: '',
      vehicle_image: '',
      idcard_image: '',
      driver_image: '',
      generale_image: '',
      photo_image: '',
      carIdModel: {
        fname: '',
        fcmpno: '',
        fcmpname: '',
        plate_num: '',
        oil_meter: '',
        mileage: '',
        vin: '',
        engine_num: '',
        model: '',
        register_date: '',
        owner: '',
        addr: '',
        name: '',
        sex: '',
        nationality: '',
        num: '',
        address: '',
        driver_name: '',
        driver_sex: '',
        vehicle_type: '',
        driver_addr: '',
        driver_end_date: '',
        generale: '',
        fno: '',
      },
    };
  },
  mounted: function() {
    this.carIdModel.fname = sessionStorage.getItem('username') || '';
    this.carIdModel.fcmpno = sessionStorage.getItem('companyno') || '';
    this.carIdModel.fcmpname = localStorage.getItem('companyname') || '';
    this.carIdModel.fno = new Date().getTime();
    console.log(this.carIdModel.fno);
  },
  methods: {
    onClickLeft() {
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
    onClickRight() {
      if (this.isEmpty()) {
        Toast('请至少填写一项内容！');
        return;
      }
      Toast.loading({
        mask: true,
        message: '提交数据中...',
      });
      api.submit(this.carIdModel).then(
        response => {
          if (!response.ok) {
            Dialog.alert({
              title: '系统提示',
              message: '提交失败!请检查网络！',
            }).then(() => {});
          }
          console.log(response);
          if (response.data.success) {
            this.clearData();
            Toast('数据提交成功！');
          } else {
            Dialog.alert({
              title: '系统提示',
              message: '提交失败!请检查数据！',
            }).then(() => {});
          }
        },
        response => {
          Dialog.alert({
            title: '系统提示',
            message: '提交失败!请检查网络！',
          }).then(() => {});
        }
      );
    },
    onReadVehiclePlate(file) {
      this.plate_image = file.content;
      this.uploadFile(file, 'vehiclePlate|face');
    },
    onReadVehicle(file) {
      this.vehicle_image = file.content;
      this.uploadFile(file, 'vehicle|face');
    },
    onReadIdcard(file) {
      this.idcard_image = file.content;
      this.uploadFile(file, 'idcard|face');
    },
    onReadDriver(file) {
      this.driver_image = file.content;
      this.uploadFile(file, 'driver|face');
    },
    onReadGenerale(file) {
      this.generale_image = file.content;
      this.uploadFile(file, 'generale|face');
    },
    onReadPhoto(file) {
      this.photo_image = file.content;
      this.uploadFile(file, 'photo|face');
    },
    uploadFile(file, type) {
      var imageFile = this.dataURLtoFile(file.content, file.name);
      var that = this;
      new Compressor(imageFile, {
        quality: 0.6,
        success(result) {
          const formData = new FormData();
          formData.append(
            type + '|' + that.carIdModel.fno + '|' + that.carIdModel.fcmpno,
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
              console.log(response);
              that.setDataField(response, type);
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
          this.carIdModel.plate_num = result.plates[0].txt;
          break;
        case 'vehicle|face':
          this.carIdModel.vin = result.vin;
          this.carIdModel.engine_num = result.engine_num;
          this.carIdModel.model = result.model;
          this.carIdModel.register_date = result.register_date;
          this.carIdModel.owner = result.owner;
          this.carIdModel.addr = result.addr;
          break;
        case 'idcard|face':
          this.carIdModel.name = result.name;
          this.carIdModel.nationality = result.nationality;
          this.carIdModel.sex = result.sex;
          this.carIdModel.num = result.num;
          this.carIdModel.address = result.address;
          break;
        case 'driver|face':
          this.carIdModel.driver_name = result.name;
          this.carIdModel.driver_sex = result.sex;
          this.carIdModel.vehicle_type = result.vehicle_type;
          this.carIdModel.driver_addr = result.addr;
          this.carIdModel.driver_end_date = result.end_date;
          break;
        case 'generale|face':
          var text = '';
          if (result.ret) {
            for (var i = 0; i < result.ret.length; i++) {
              text += result.ret[i].word + ' \n ';
            }
          }
          this.carIdModel.generale = text;
          break;
        default:
          break;
      }
    },
    clearData() {
      this.carIdModel.fno = new Date().getTime();
      this.carIdModel.plate_num = '';
      (this.carIdModel.oil_meter = ''),
        (this.carIdModel.mileage = ''),
        (this.carIdModel.vin = '');
      this.carIdModel.engine_num = '';
      this.carIdModel.model = '';
      this.carIdModel.register_date = '';
      this.carIdModel.owner = '';
      this.carIdModel.addr = '';
      this.carIdModel.name = '';
      this.carIdModel.nationality = '';
      this.carIdModel.sex = '';
      this.carIdModel.num = '';
      this.carIdModel.address = '';
      this.carIdModel.driver_name = '';
      this.carIdModel.driver_sex = '';
      this.carIdModel.vehicle_type = '';
      this.carIdModel.driver_addr = '';
      this.carIdModel.driver_end_date = '';
      this.carIdModel.generale = '';
      this.plate_image = '';
      this.vehicle_image = '';
      this.idcard_image = '';
      this.driver_image = '';
      this.generale_image = '';
      this.photo_image = '';
    },
    isEmpty() {
      if (
        this.carIdModel.plate_num == '' &&
        this.carIdModel.plate_num == '' &&
        this.carIdModel.oil_meter == '' &&
        this.carIdModel.mileage == '' &&
        this.carIdModel.vin == '' &&
        this.carIdModel.engine_num == '' &&
        this.carIdModel.model == '' &&
        this.carIdModel.register_date == '' &&
        this.carIdModel.owner == '' &&
        this.carIdModel.addr == '' &&
        this.carIdModel.name == '' &&
        this.carIdModel.nationality == '' &&
        this.carIdModel.sex == '' &&
        this.carIdModel.num == '' &&
        this.carIdModel.address == '' &&
        this.carIdModel.driver_name == '' &&
        this.carIdModel.driver_sex == '' &&
        this.carIdModel.vehicle_type == '' &&
        this.carIdModel.driver_addr == '' &&
        this.carIdModel.driver_end_date == '' &&
        this.carIdModel.generale == ''
      ) {
        return true;
      }
      return false;
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
.button-row {
  text-align: center;
}
.button-col {
  line-height: 40px !important;
  border-right: 1px solid #c0c0c0;
}
.van-row {
  border-bottom: 1px solid #c0c0c0;
}
.van-col {
  font-size: 12px;
  line-height: 30px;
}
/* .van-col:nth-child(odd) {
  background-color: #39a9ed;
}
.van-col:nth-child(even) {
  background-color: #66c6f2;
} */
.van-field {
  font-size: 10px;
}
.van-cell {
  padding: 5px;
}
</style>
∂