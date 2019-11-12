<template>
  <div>
    <van-nav-bar title="报销上传" :left-text="claimBackModel.fname"  right-text="提交" @click-left="onClickLeft" @click-right="onClickRight"/>
    <div>
       <van-row type="flex" class="button-row">
         <van-col span="8" class="button-col">
           <van-uploader :after-read="onReadPhotos" accept="image/*" capture="camera">
             <van-icon name="photograph" />
              拍照上传
           </van-uploader>
         </van-col>
         <van-col span="8" class="button-col">
           <van-uploader :after-read="onReadPhotos" multiple accept="image/*">
             <van-icon name="photograph" />
              选择照片
           </van-uploader>
         </van-col>
       </van-row>
      
       <div class="box">
        <img v-for="image in images" :key="image.id" :src="image.content" class="inner"/>
       </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import Compressor from 'compressorjs';
import api from '../api';
export default {
  name: 'ClaimBack',
  data() {
    return {
      imageId:0,
      images: [],
       claimBackModel: {
        fname: '',
        fcmpno: '',
        fcmpname: '',
        fno:''
      }
    };
  },
  mounted: function() {
    this.claimBackModel.fname = sessionStorage.getItem('username') || '';
    this.claimBackModel.fcmpno = sessionStorage.getItem('companyno') || '';
    this.claimBackModel.fcmpname = localStorage.getItem('companyname') || '';
    this.claimBackModel.fno = new Date().getTime();
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
         this.clearData();
         Toast.success('数据提交成功');
    },
    // onReadPhoto(file) {
    //     this.uploadFile(file, 'claimback|face');
    // },
    onReadPhotos(files) {
        if (Array.isArray(files)){
          for (let index in files) {
            this.uploadFile(files[index], 'claimback|face');
          }
        }else{
          this.uploadFile(files, 'claimback|face');
        }
    },
    uploadFile(file, type) {
      Toast.loading({
        mask: true,
        message: '图片上传中...',
      });
       this.images.push({
        id: this.imageId++,
        content: file.content
      })
      var imageFile = this.dataURLtoFile(file.content, file.name);
      var that = this;
      new Compressor(imageFile, {
        quality: 0.6,
        success(result) {
          const formData = new FormData();
          formData.append(
            type + '|' + that.claimBackModel.fcmpno + '|' + that.claimBackModel.fcmpno,
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
    clearData() {
      this.claimBackModel.fno = new Date().getTime();
      this.images =[];
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
.box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
}
.inner{
        width: 100px;
        height: 100px;
        margin: 10px;
}
</style>
∂