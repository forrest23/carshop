<template>
  <div>
    <van-nav-bar title="拍照识别" :right-text="username" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div>
       <van-row type="flex" class="buttons">
         <van-col span="4">
           <van-uploader :after-read="onRead" accept="image/jpg, image/jpeg">
             <van-icon name="photograph" />
              车牌号
           </van-uploader>
         </van-col>
         <van-col span="4">身份证</van-col>
         <van-col span="4">行驶证</van-col>
         <van-col span="4">驾驶证</van-col>
         <van-col span="4">自由拍</van-col>
         <van-col span="4">拍个照</van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="车牌号" v-model="value" /></van-col>
         <van-col span="8"><van-field label="油表数" v-model="value" /></van-col>
         <van-col span="8"><van-field label="公里数" v-model="value" /></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="16"><van-field label="车架号" v-model="value" /></van-col>
         <van-col span="10"><van-field label="发动机号" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="16"><van-field label="厂牌型号" v-model="value" /></van-col>
         <van-col span="10"><van-field label="初登日期" v-model="value" /></van-col>
       </van-row>
        <van-row type="flex">
         <van-col span="24"><van-field label="车主" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="车主地址" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="身份证名" v-model="value" /></van-col>
         <van-col span="8"><van-field label="性别" v-model="value" /></van-col>
         <van-col span="8"><van-field label="民族" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="身份证号" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="身份证地址" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><van-field label="驾照姓名" v-model="value" /></van-col>
         <van-col span="8"><van-field label="性别" v-model="value" /></van-col>
         <van-col span="8"><van-field label="准驾车型" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="驾照地址" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="驾照到期" v-model="value" /></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="24"><van-field label="自由拍信息" type="textarea" v-model="value" rows="1" autosize/></van-col>
       </van-row>
       <van-row type="flex">
         <van-col span="8"><img :src="image" width="100px"/></van-col>
         <van-col span="8"><van-field label="油表数" v-model="value" /></van-col>
         <van-col span="8"><van-field label="公里数" v-model="value" /></van-col>
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
      msg: 'Welcome to Your Vue.js App',
      username: '',
      active: 0,
      value: '',
      image: '',
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
    onRead(file) {
      console.log(file);
      this.image = file.content;
      var imageFile = this.dataURLtoFile(file.content, file.name);
      new Compressor(imageFile, {
        quality: 0.6,
        success(result) {
          const formData = new FormData();
          formData.append('vehiclePlate|face', result, file.name);
          api.uploadFile(formData).then(
            response => {
              if (!response.ok) {
                Toast('登录失败');
              }
              Toast('登录成功');
            },
            response => {
              Toast('登录失败');
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
