<template>
  <van-row class="question-wrapper">
    <van-col span="24" class="question-list">
    <p v-if="questionList.length == 0" style="margin: 10px 0">一点东西都没有，赶快点击上方按钮添加题目吧！</p>
    <van-row type="flex" justify="start" align="top" v-for="(topic, index) in questionList" class="question-item"
         :key="topic.q_id">
      <van-col span="6" style="width: 60px; text-align: center">
      <h2>Q{{ index + 1 }}:</h2>
      <div class="question-action" v-show="isPreview" @click="delQuestion(index)">
        <van-icon  type="trash-a" size="18"></van-icon >
      </div>
      </van-col>
      <van-col span="18">
      <h3>[{{ topic.type }}] {{ topic.question }}{{topic.isRequired ? "（必填）" : "（选填）"}} <span style="color: #f00;" v-if="topic.isRequired">*</span></h3>
      <p class="question-desc" v-if="topic.description !== ''">说明：{{ topic.description }}</p>
      <div class="question-options">
        <div v-if="topic.type === '单选'">
          <van-radio-group v-model="topic.selectContent" vertical style="width: 100%;">
            <van-radio :name="option.o_id" v-for="(option, opIndex) in topic.options" :disabled="isPreview"
                   class="option-item" :key="option.o_id">
              <span>{{option.content}}</span>
              <Input v-model="topic.additional"
                     placeholder="请输入理由"
                     style="width: 300px"
                     v-show="option.isAddition && topic.selectContent === option.o_id "
                     v-if="option.isAddition"
              ></Input>
              <div class="option-action" v-show="isPreview" @click="delOption(index, opIndex)">
                <van-icon type="close" size="16"></van-icon>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
        <div v-if="topic.type === '多选'">
          <van-checkbox-group v-model="topic.selectMultipleContent" class="van-checkbox-list">
            <van-checkbox
              :label="option.o_id"
              v-for="(option, opIndex) in topic.options"
              :disabled="isPreview"
              class="option-item" :key="option.o_id" :name="option.o_id">
              <span>{{option.content}}</span>
              <div class="option-action" v-show="isPreview" @click="delOption(index, opIndex)">
                <van-icon type="close" size="16"></van-icon>
              </div>
            </van-checkbox>
          </van-checkbox-group>
        </div>
        <div class="option-item" v-if="topic.type === '文本'">
          <van-field v-model="topic.selectContent" type="textarea" placeholder="请输入..." :disabled="isPreview"/>
        </div>
      </div>
      </van-col>
    </van-row>
    <div class="question-btns">
      <slot></slot>
    </div>
    </van-col>
  </van-row>
</template>

<script>
export default {
  props: ['questionList', 'isPreview'],
  methods: {
    delQuestion(index) {
      console.log(index);
      // this.$store.dispatch('delQuestion', index)
    },
    delOption(index, opIndex) {
      console.log(index, opIndex);
      // this.$store.dispatch('delOption', {
      //   index: index,
      //   opIndex: opIndex
      // })
    },
  },
  created() {
    console.log('imported successfully', this.questionList, this.isPreview);
  },
};
</script>

<style scoped>
.question-list {
  padding: 30px 0;
  overflow: visible;
}

.van-checkbox-list label {
  display: block;
}

.question-options {
  padding: 5px 0;
}

.option-item {
  margin: 5px 0;
}

.question-desc {
  padding: 5px 0;
}

.question-action {
  display: none;
  color: #a9afb2;
}

.question-item {
  padding: 20px 0;
  min-width: 300px;
}

.question-item:hover {
  background: rgba(238, 238, 238, 0.47);
}

.question-item:hover .question-action {
  display: block;
  margin-top: 8px;
}

.question-action:hover {
  color: #018fe5;
  cursor: pointer;
}

.option-item {
}

.question-btns {
  margin-top: 20px;
}

.option-action {
  display: none;
  margin-left: 100px;
  padding: 0 10px;
  text-align: right;
  color: #a9afb2;
}

.option-action:hover {
  color: #018fe5;
}

.option-item:hover .option-action {
  display: inline-block;
  cursor: pointer;
}
</style>
