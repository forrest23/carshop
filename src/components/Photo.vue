<template>
  <div>
    <van-nav-bar title="拍照识别" :right-text="username" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div>
       <van-row type="flex" class="buttons">
         <van-col span="4">
           <van-uploader :after-read="onReadVehiclePlate" accept="image/jpg,image/jpeg,image/png">
             <van-icon name="photograph" />
              车牌号
           </van-uploader>
         </van-col>
          <van-col span="4">
           <van-uploader :after-read="onReadVehicle" accept="image/jpg,image/jpeg,image/png">
             <van-icon name="photograph" />
              行驶证
           </van-uploader>
           </van-col>
         <van-col span="4">
           <van-uploader :after-read="onReadIdcard" accept="image/jpg,image/jpeg,image/png">
             <van-icon name="photograph" />
              身份证
           </van-uploader>
         </van-col>
         <van-col span="4">
           <van-uploader :after-read="onReadDriver" accept="image/jpg,image/jpeg,image/png">
             <van-icon name="photograph" />
              驾驶证
           </van-uploader>
           </van-col>
         <van-col span="4"><van-uploader :after-read="onReadGenerale" accept="image/jpg,image/jpeg,image/png">
             <van-icon name="photograph" />
              自由拍
           </van-uploader>
           </van-col>
         <van-col span="4">
           <van-uploader :after-read="onReadPhoto" accept="iimage/jpg,image/jpeg,image/png">
             <van-icon name="photograph" />
              拍照
           </van-uploader></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="车牌号" v-model="plate_num" /></van-col>
         <van-col span="8"><van-field label="油表数" v-model="oil_meter" /></van-col>
         <van-col span="8"><van-field label="公里数" v-model="mileage" /></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="16"><van-field label="车架号" v-model="vin" /></van-col>
         <van-col span="10"><van-field label="发动机号" v-model="engine_num" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="16"><van-field label="厂牌型号" v-model="model" /></van-col>
         <van-col span="10"><van-field label="初登日期" v-model="register_date" /></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="24"><van-field label="车主" v-model="owner" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="车主地址" v-model="addr" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="身份证名" v-model="name" /></van-col>
         <van-col span="8"><van-field label="性别" v-model="sex" /></van-col>
         <van-col span="8"><van-field label="民族" v-model="nationality" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="身份证号" v-model="num" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="身份证地址" v-model="address" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="驾照姓名" v-model="driver_name" /></van-col>
         <van-col span="8"><van-field label="性别" v-model="driver_sex" /></van-col>
         <van-col span="8"><van-field label="准驾车型" v-model="vehicle_type" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="驾照地址" v-model="driver_addr" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="驾照到期" v-model="driver_end_date" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="自由拍信息" type="textarea" v-model="generale" rows="1" autosize/></van-col>
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
import { Toast } from 'vant';
import Compressor from 'compressorjs';
import api from '../api';
export default {
  name: 'Photo',
  data() {
    return {
      username: '',
      active: 0,
      value: '',
      plate_image: '',
      vehicle_image: '',
      idcard_image: '',
      driver_image: '',
      generale_image: '',
      photo_image: '',
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
    };
  },
  created: function() {
    this.username = sessionStorage.getItem('username') || '';
  },
  methods: {
    onClickLeft() {},
    onClickRight() {
      Toast('按钮');
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
          formData.append(type, result, file.name);
          api.uploadFile(formData).then(
            response => {
              if (!response.ok || response.status !== 200) {
                Toast('图像识别失败！');
              }
              console.log(response);
              that.setDataField(response, type);
            },
            response => {
              Toast('图像上传失败！');
            }
          );
        },
        error(err) {
          Toast('图像压缩失败！' + err.message);
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
          this.plate_num = result.plates[0].txt;
          break;
        case 'vehicle|face':
          this.vin = result.vin;
          this.engine_num = result.engine_num;
          this.model = result.model;
          this.register_date = result.register_date;
          this.owner = result.owner;
          this.addr = result.addr;
          break;
        case 'idcard|face':
          this.name = result.name;
          this.nationality = result.nationality;
          this.sex = result.sex;
          this.num = result.num;
          this.address = result.address;
          break;
        case 'driver|face':
          this.driver_name = result.name;
          this.driver_sex = result.sex;
          this.vehicle_type = result.vehicle_type;
          this.driver_addr = result.addr;
          this.driver_end_date = result.end_date;
          break;
        case 'generale|face':
          var text = '';
          if (result.ret) {
            for (var i = 0; i < result.ret.length; i++) {
              text += result.ret[i].word  + ' \n ';
            }
          }
          this.generale = text;
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
h1,
h2 {
  font-weight: normal;
}
.buttons {
  text-align: center;
}
.van-col {
  font-size: 10px;
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
