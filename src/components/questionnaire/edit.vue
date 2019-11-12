<template>
  <div class="edit">
    <van-row>
      <van-col span="24">
      <van-cell-group>
        <van-field v-model="naire.title" center clearable label="问卷名" placeholder="请输入问卷名"/>
        <van-field v-model="naire.intro" center clearable label="问卷介绍" placeholder="请输入问卷介绍"/>
      </van-cell-group>
      </van-col>
    </van-row>
    <van-row class="add-button" type="flex" justify="center" align="middle">
      <van-button type="primary" @click="addRadio">单选题</van-button>
      <van-button type="primary" @click="addCheckbox">多选题</van-button>
      <van-button type="primary" @click="addTextarea">文本题</van-button>
    </van-row>

    <!-- 单选题 -->
    <van-popup v-model="addRadio_modal" class="van-popup-size">
      <van-cell-group ref="addRadio" v-model="addRadio_form" >
        <van-field v-model="addRadio_form.question" center clearable label="题目" placeholder="问请输入题目"/>
        <van-field v-model="addRadio_form.description" center clearable label="题目说明" placeholder="请输入题目说明，可以为空"/>
         <van-row v-for="(option, index) in addRadio_form.options" v-bind:key="index">
           <van-field v-model="option.content" center clearable label="选项"  placeholder="请输入选项内容">
           <van-button slot="button" type="primary" icon="add-o" size="small"
                        @click="addOption(addRadio_form.options)">增加</van-button>
            <van-button slot="button" class="btn-left" type="danger" icon="add-o" size="small"
                        @click="delOption(addRadio_form.options,index)">删除</van-button>
            </van-field>
            <van-switch-cell v-model="option.isAddition" title="是否有附加说明内容：" />
         </van-row>
         <van-switch-cell v-model="addRadio_form.isRequired" title="是否必填" />
     </van-cell-group>
     <van-row class="add-button" type="flex" justify="center" align="middle">
        <van-button type="primary" :loading="addRadio_loading" @click="submitRadio('addRadio')">提交</van-button>
        <van-button @click="closeRadioModal">关闭</van-button>
     </van-row>
    </van-popup>

    <!-- 多选题 -->
    <van-popup v-model="addCheckbox_modal" class="van-popup-size">
      <van-cell-group ref="addCheckbox" v-model="addCheckbox_form">
        <van-field v-model="addCheckbox_form.question" center clearable label="题目" placeholder="请输入题目内容"/>
        <van-field v-model="addCheckbox_form.description" center clearable label="题目说明" placeholder="请输入题目说明，可以为空"/>
         <van-row v-for="(option, index) in addCheckbox_form.options" v-bind:key="index">
           <van-field v-model="option.content" center clearable label="选项"  placeholder="请输入选项内容">
           <van-button slot="button" type="primary" icon="add-o" size="small"
                        @click="addOption(addCheckbox_form.options)">增加</van-button>
            <van-button slot="button" class="btn-left" type="danger" icon="add-o" size="small"
                        @click="delOption(addCheckbox_form.options,index)">删除</van-button>
            </van-field>
            <van-switch-cell v-model="option.isAddition" title="是否有附加说明内容：" />
         </van-row>
         <van-switch-cell v-model="addCheckbox_form.isRequired" title="是否必填" />
      </van-cell-group>
      <van-row class="add-button" type="flex" justify="center" align="middle">
        <van-button type="primary" :loading="addCheckbox_loading" @click="submitCheckbox('addCheckbox')">提交</van-button>
        <van-button @click="closeCheckboxModal">关闭</van-button>
     </van-row>
    </van-popup>

    <!-- 文本题 -->
    <van-popup v-model="addTextarea_modal" class="van-popup-size">
      <van-cell-group ref="addTextarea" v-model="addTextarea_form">
        <van-field v-model="addTextarea_form.question"  center clearable label="题目" placeholder="请输入题目内容"/>
        <van-field v-model="addTextarea_form.description"  center clearable label="题目说明" placeholder="请输入题目说明，可以为空"/>
        <van-switch-cell v-model="addTextarea_form.isRequired" title="是否必填" />
      </van-cell-group>
      <van-row class="add-button" type="flex" justify="center" align="middle">
        <van-button type="primary" :loading="addTextarea_loading" @click="submitTextarea('addTextarea')">提交</van-button>
        <van-button @click="closeTextareaModal">关闭</van-button>
     </van-row>
    </van-popup>

     <questionList :question-list="naire.topic" :is-preview="true">
       <van-row>
          <van-field readonly label="截止日期" v-model="naire.deadline" @click="onShowDeadline()" placeholder="请选择截止时间"/>  
      </van-row>
      <van-row type="flex" justify="center">
        <van-button style="margin-right: 10px;" @click="handleSave">保存问卷</van-button>
        <van-button type="success" @click="handlePublish">发布问卷</van-button>
      </van-row>
    </questionList>

      <van-popup v-model="showDate" position="bottom" :overlay="true">
     <van-datetime-picker
      v-model="currentDate"
      title="选择截止日期"
      type="datetime"
      @confirm="onDateSelect"
      @cancel="onDateCancel"
     />
    </van-popup>
  </div>
</template>

<script>
import questionList from '@/components/questionnaire/questionList';
import api from '../../api';
import { Toast, Dialog } from 'vant';

export default {
  data() {
    return {
      currentDate: new Date(),
      naire: {
        title: '',
        deadline: '',
        intro: '',
        status: 0,
        topic: [],
      },
      naireId:'',
      showDate: false,
      deadline: '',
      addRadio_modal: false,
      addRadio_loading: false,
      addRadio_form: {},
      addCheckbox_modal: false,
      addCheckbox_loading: false,
      addCheckbox_form: {},
      addTextarea_modal: false,
      addTextarea_loading: false,
      addTextarea_form: {},
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      textarea: '',
    };
  },
  computed: {},
  created() {
    // 如果id存在，则从服务器获取数据，并展示
    // this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    //'$route': 'fetchData'
  },
  methods: {
    warning(nodesc, title, desc) {
      this.$Notice.warning({
        title: title,
        desc: nodesc ? '' : desc,
      });
    },
    error(nodesc, title, desc) {
      this.$Notice.error({
        title: title,
        desc: nodesc ? '' : desc,
      });
    },
    // 校验填写项是否正确填写
    validQuestion(target) {
      let isPassed = true;
      if (target.question === '') {
        this.warning(false, '题目', '请输入问题内容');
        isPassed = false;
      }
      if (target.options.length < 1) {
        this.warning(false, '选项', '选项至少增加一个');
        isPassed = false;
      }
      let valid = target.options.some((item, index) => {
        return item.content === '';
      });
      if (valid) {
        this.warning(false, '选项内容', '请输入选项内容');
        isPassed = false;
      }
      return isPassed;
    },
    validNaire() {
      let isPassed = true;
      if (this.naire.title === '') {
        Toast('请输入问卷标题');
        isPassed = false;
      }
      if (this.naire.deadline === '' || !this.naire.deadline) {
        Toast('请选择问卷截止时间');
        isPassed = false;
      }
      if (this.naire.topic.length < 1) {
        Toast('请至少添加一道问卷题目');
        isPassed = false;
      }
      return isPassed;
    },
    handleSave() {
      if (this.validNaire()) {
        //alert(JSON.stringify(this.naire));
        this.naire.workno = '';
        this.naire.username = '';
        api.SaveNaire(this.naire).then(
          response => {
            if (!response.ok) {
              Toast.clear();
              Dialog.alert({
                title: '系统提示',
                message: '问卷保存失败!请检查网络！',
              }).then(() => {});
            }
            if (response.data.success) {
              this.naireId= response.data.data;
              Toast.success('问卷保存成功');
            } else {
              Toast.clear();
              Dialog.alert({
                title: '系统提示',
                message: '保存问卷失败!请检查数据！',
              }).then(() => {});
            }
          },
          response => {
            Toast.clear();
            Dialog.alert({
              title: '系统提示',
              message: '保存问卷失败!请检查网络！',
            }).then(() => {});
          }
        );
        // this.$router.push({
        //   path: '/QuestionnaireView',
        //   name: 'QuestionnaireView',
        //   query: {
        //     naire: this.naire,
        //   },
        // });
      }
    },
    handlePublish() {
      this.$router.push({
        path: '/QuestionnaireView',
        name: 'QuestionnaireView',
        query: {
          n_id: this.naireId,
        },
      });
      // if (this.validNaire()) {
      //   this.saveNaire('发布失败，请重试');
      // }
    },
    // 新建题目
    addRadio() {
      this.addRadio_modal = true;
      const radioQues = {
        question: '',
        options: [],
        description: '',
        type: '单选',
        isRequired: true,
        selectContent: '',
        additional: '',
      };
      this.addRadio_form = Object.assign({}, radioQues);
      const tempData = {
        content: '选项',
        isAddition: false,
      };
      this.addRadio_form.options.splice(
        0,
        this.addRadio_form.options.length,
        Object.assign({}, tempData)
      );
    },
    addCheckbox() {
      this.addCheckbox_modal = true;
      const checkboxQues = {
        question: '',
        options: [],
        description: '',
        type: '多选',
        isRequired: true,
        selectMultipleContent: [],
      };
      this.addCheckbox_form = Object.assign({}, checkboxQues);
      const tempData = {
        content: '选项',
        isAddition: false,
      };
      this.addCheckbox_form.options.splice(
        0,
        this.addCheckbox_form.options.length,
        Object.assign({}, tempData)
      );
    },
    addTextarea() {
      this.addTextarea_modal = true;
      const TextareaQues = {
        question: '',
        description: '',
        type: '文本',
        isRequired: true,
        selectContent: '',
      };
      this.addTextarea_form = Object.assign({}, TextareaQues);
    },
    // 新增选项
    addOption(source) {
      const tempData = {
        content: '选项',
        isAddition: false,
      };
      source.push(Object.assign({}, tempData));
    },
    // 删除选项
    delOption(source, index) {
      if (source.length > 1) {
        source.splice(index, 1);
      } else {
        this.$Message.warning('最后一个啦，不要删除哦');
      }
    },
    // 提交题目
    submitRadio(name) {
      if (this.validQuestion(this.addRadio_form)) {
        const data = Object.assign({}, this.addRadio_form);
        this.naire.topic.push(data);
        this.addRadio_modal = false;
      }
    },
    submitCheckbox(name) {
      if (this.validQuestion(this.addCheckbox_form)) {
        const data = Object.assign({}, this.addCheckbox_form);
        this.naire.topic.push(data);
        this.addCheckbox_modal = false;
      }
    },
    submitTextarea(name) {
      if (this.addTextarea_form.question === '') {
        this.warning(false, '题目', '请输入问题内容');
        return;
      }
      const data = Object.assign({}, this.addTextarea_form);
      this.naire.topic.push(data);
      this.addTextarea_modal = false;
    },
    // 关闭弹框
    closeRadioModal() {
      this.addRadio_modal = false;
    },
    closeCheckboxModal() {
      this.addCheckbox_modal = false;
    },
    closeTextareaModal() {
      this.addTextarea_modal = false;
    },
    onDateSelect() {
      this.showDate = false;
      this.naire.deadline = this.dateFtt('yyyy-MM-dd hh:mm', this.currentDate);
    },
    onDateCancel() {
      this.showDate = false;
    },
    onShowDeadline() {
      this.showDate = true;
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
  components: {
    questionList,
  },
};
</script>

<style>
.option-btn {
  padding-left: 10px;
}

.option-item {
  padding: 5px 0;
}

.option-addtion {
  height: 30px;
  line-height: 30px;
}

.add-button button {
  margin: 10px;
}

.btn-left {
  margin-left: 6px;
}

.van-popup-size {
  width: 95%;
  height: 70%;
}
</style>
