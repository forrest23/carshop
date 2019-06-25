<template>
  <div class="edit">
    <van-row>
      <van-col span="24">
      <van-cell-group>
        <van-field v-model="title" center clearable label="问卷名" placeholder="请输入问卷名"/>
        <van-field v-model="textarea" center clearable label="问卷介绍" placeholder="请输入问卷介绍"/>
      </van-cell-group>
      </van-col>
    </van-row>
    <van-row class="add-button" type="flex" justify="center" align="middle">
      <van-button type="primary" @click="addRadio">单选题</van-button>
      <van-button type="primary" @click="addCheckbox">多选题</van-button>
      <van-button type="primary" @click="addTextarea">文本题</van-button>
    </van-row>

    <!-- <questionList :question-list="naire.topic" :is-preview="true">
      <van-row>
        <van-col span="4" style="margin-right: 10px;">
        <Date-picker type="datetime" placeholder="截止日期"
                     v-model="deadline"
                     :editable="false" placement="right-end"
                     :options="dateOption">
        </Date-picker>
        </van-col>
        <van-col span="12">
        <van-button style="margin-right: 10px;" @click="handleSave">保存问卷</van-button>
        <van-button type="success" @click="handlePublish">发布问卷</van-button>
        </van-col>
      </van-row>
    </questionList> -->

    <!-- addRadio -->
    <van-popup v-model="addRadio_modal" class="van-popup-size">
      <!-- form表单-->
      <van-cell-group ref="addRadio" v-model="addRadio_form" >
        <van-field v-model="addRadio_form.question" center clearable label="题目" placeholder="问请输入题目"/>
        <van-field v-model="addRadio_form.description" center clearable label="题目说明" placeholder="请输入题目说明，可以为空"/>

          <van-cell-group class="option-item" v-for="(option, index) in addRadio_form.options" v-bind:key="index">
            <van-row>
              <van-col span="18">
                <van-field v-model="option.content"  placeholder="请输入选项内容"/>
              </van-col>
              <van-col span="6">
                <van-row>
                   <van-col>
                      <van-button type="success" icon="add-o" size="small"
                        @click="addOption(addRadio_form.options)"></van-button>
                   </van-col>

                <van-col>
                <van-button type="warning" icon="close" size="small"
                        @click="delOption(addRadio_form.options,index)"></van-button>
                        </van-col>
                </van-row>
              </van-col>

            </van-row>
            <div class="option-addtion">
              是否有附加说明内容：
              <van-switch v-model="option.isAddition">
              </van-switch>
            </div>
        </van-cell-group>
        <van-cell-group>
            是否必填：
            <van-switch v-model="addRadio_form.isRequired">
            </van-switch>
        </van-cell-group>
      </van-cell-group>
      <div slot="footer">
        <van-button type="primary" :loading="addRadio_loading" @click="submitRadio('addRadio')">提交</van-button>
        <van-button @click="closeRadioModal">关闭</van-button>
      </div>
    </van-popup>
    <!-- addCheckbox -->
    <van-popup v-model="addCheckbox_modal">
      <!-- form表单-->
      <Form ref="addCheckbox" :model="addCheckbox_form" :label-width="80" class="form">
        <Form-item label="题目" prop="title">
          <Input v-model="addCheckbox_form.question" placeholder="请输入题目内容"></Input>
        </Form-item>
        <Form-item label="题目说明" prop="description">
          <Input v-model="addCheckbox_form.description" placeholder="请输入题目说明，可以为空"></Input>
        </Form-item>
        <Form-item label="选项" prop="title">
          <div class="option-item" v-for="(option, index) in addCheckbox_form.options" v-bind:key="index">
            <van-row>
              <van-col span="18">
              <Input v-model="option.content" :key="index" placeholder="请输入选项内容"
                     style="display:inline-block"></Input></van-col>
              <van-col span="6">
              <div class="option-btn">
                <van-button type="success" icon="plus-round" size="small"
                        @click="addOption(addCheckbox_form.options)"></van-button>
                <van-button type="warning" icon="close" size="small"
                        @click="delOption(addCheckbox_form.options,index)"></van-button>
              </div>

              </van-col>
            </van-row>
            <div class="option-addtion">
              是否有附加说明内容：
              <van-switch v-model="option.isAddition" disabled>
                <span slot="open">有</span>
                <span slot="close">无</span>
              </van-switch>
            </div>
          </div>
        </Form-item>
        <Form-item label="必填项">
          <div class="option-addtion">
            <van-switch v-model="addCheckbox_form.isRequired">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </van-switch>
          </div>
        </Form-item>
      </Form>
      <div slot="footer">
        <van-button type="primary" :loading="addCheckbox_loading" @click="submitCheckbox('addCheckbox')">提交</van-button>
        <van-button @click="closeCheckboxModal">关闭</van-button>
      </div>
    </van-popup>
    <!-- addTextarea -->
    <van-popup v-model="addTextarea_modal">
      <!-- form表单-->
      <Form ref="addTextarea" :model="addTextarea_form" :label-width="80" class="form">
        <Form-item label="题目" prop="title">
          <Input v-model="addTextarea_form.question" placeholder="请输入题目内容"></Input>
        </Form-item>
        <Form-item label="题目说明" prop="description">
          <Input v-model="addTextarea_form.description" placeholder="请输入题目说明，可以为空"></Input>
        </Form-item>
        <Form-item label="必填项">
          <div class="option-addtion">
            <van-switch v-model="addTextarea_form.isRequired">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </van-switch>
          </div>
        </Form-item>
      </Form>
      <div slot="footer">
        <van-button type="primary" :loading="addTextarea_loading" @click="submitTextarea('addTextarea')">提交</van-button>
        <van-button @click="closeTextareaModal">关闭</van-button>
      </div>
    </van-popup>

  </div>
</template>

<script>
import questionList from '@/components/questionnaire/questionList';

export default {
  data() {
    return {
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
  computed: {
    naire() {
      return 'naire';
    },
    title: {
      get() {
        return '';
      },
    },
    // intro: {
    //   get () {
    //     this.textarea = this.$store.getters.naire.intro
    //     return this.$store.getters.intro
    //   },
    //   set (value) {
    //     this.$store.commit('UPDATE_INTRO', value)
    //   }
    // },
    deadline: {
      get() {
        return '2018-09-10';
      },
      set(value) {
        console.log(value);
        this.$store.commit('UPDATE_DEADLINE', new Date(value).getTime());
      },
    },
  },
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
      if (this.title === '') {
        this.warning(false, '问卷标题', '请输入问卷标题');
        this.$refs.title.focus();
        isPassed = false;
      }
      if (this.deadline === '' || !this.deadline) {
        this.warning(false, '截止时间', '请选择问卷截止时间');
        isPassed = false;
      }
      if (this.naire.topic.length < 1) {
        this.warning(false, '问卷题目', '请至少添加一道问卷题目');
        isPassed = false;
      }
      return isPassed;
    },
    // 用于问卷介绍的 v-model 双向数据绑定
    updateIntro(e) {
      this.$store.commit('UPDATE_INTRO', e.target.value);
    },
    handleSave() {
      if (this.validNaire()) {
        this.$store.dispatch('changeNaireStatus', 0);
        this.saveNaire('保存失败，请重试');
      }
    },
    handlePublish() {
      if (this.validNaire()) {
        this.$store.dispatch('changeNaireStatus', 1);
        this.saveNaire('发布失败，请重试');
      }
    },
    // 新建题目
    addRadio() {
      this.addRadio_modal = true;
      const radioQues = {
        question: '单选题目',
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
        question: '多选题目',
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
        question: '文本题目',
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
        this.$store.dispatch('addQuestion', data);
        this.addRadio_modal = false;
      }
    },
    submitCheckbox(name) {
      if (this.validQuestion(this.addCheckbox_form)) {
        const data = Object.assign({}, this.addCheckbox_form);
        this.$store.dispatch('addQuestion', data);
        this.addCheckbox_modal = false;
      }
    },
    submitTextarea(name) {
      if (this.addTextarea_form.question === '') {
        this.warning(false, '题目', '请输入问题内容');
        return;
      }
      const data = Object.assign({}, this.addTextarea_form);
      this.$store.dispatch('addQuestion', data);
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
    // 当传入id值时，获取问卷详情，用于编辑
    fetchData() {
      if (this.$route.params.id) {
        //        this.$store.dispatch('getNaire')
        this.$store.dispatch('getQuestionList');
        this.$store.dispatch('changeStatus', 'update');
        // 通过 JSON 序列化将数组不再为引用，避免出现在 store 外修改 state 的内容
      } else {
        // 新增问卷
        const _naire = {
          title: '',
          deadline: '',
          intro: '',
          status: 0,
          topic: [],
        };
        let newNaire = Object.assign({}, _naire);
        this.$store.dispatch('createNaire', newNaire);
        this.$store.dispatch('changeStatus', 'create');
      }
    },
    // 保存问卷和发布问卷
    saveNaire(message) {
      let _axios = this.$store.dispatch('saveNewNaire');
      _axios
        .then(response => {
          console.log(response.data);
          if (response.data.err === 0) {
            this.$Message.success(response.data.data);
            this.$router.push('/platform/list');
          } else {
            this.$Message.error(response.data.data);
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error(message);
        });
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
  margin: 0 10px;
}

.van-popup-size {
  width: 95%;
  height: 70%;
}
</style>
