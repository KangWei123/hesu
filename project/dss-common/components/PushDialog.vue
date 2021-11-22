<template>
  <el-dialog title="投放" :visible.sync="show" >
    <p class="push-title">标签选择：</p>
    <div class="push-select">
      <div class="push-select-category">
        <p
          class="push-select-item"
          :class="{ active: curCategory === item }"
          v-for="item in categorys"
          :key="item.name"
          @mouseenter="curCategory = item">
          <a>{{ item.name }}</a>
        </p>
      </div>
      <div class="push-select-value">
        <p
          class="push-select-item"
          :class="{ active: selectedTags.indexOf(item) > -1 }"
          v-for="(item, index) in curCategoryTag"
          :key="index"
          @click="toggleTag(item)">
          <a>{{ item }}</a>
        </p>
      </div>
    </div>
    <p class="push-title">已选择标签，总投放人数: <em class="push-count">{{ selectedTags.length ? (302463 / selectedTags.length).toFixed(0) : 0 }}</em></p>
    <div class="push-tag">
      <el-tag closable v-for="(item, index) in selectedTags" :key="index" @close="toggleTag(item)">{{ item }}</el-tag>
    </div>
    <p class="push-title">投放内容：</p>
    <el-input type="textarea" :rows="4" placeholder="请输入投放内容" v-model="text"></el-input>
    <div class="push-action">
      <el-button :type="status === 0 ? 'primary' : 'success'" @click="push">{{ status === 0 ? '投放' : '投放成功，查看我的投放' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
const PUSH_STATUS = 0
const PUSHED_STATUS = 1

export default {
  props: {
    value: Boolean,
    consume: Array,
    content: Array,
    age: Array,
    job: Array,
    defaultCategoryName: String
  },
  data() {
    const result = {
      status: PUSH_STATUS,
      selectedTags: [],
      curCategory: null,
      text: '',
      categorys: [
        { name: '性别', key: 'sexData' },
        { name: '年龄', key: 'age' },
        { name: '职业', key: 'jobData' },
        { name: '内容行为', key: 'contentData' },
        { name: '消费行为', key: 'consumeData' }
      ]
    }
    return result
  },
  watch: {
    value() {
      this.status = PUSH_STATUS
      this.selectedTags = []
      this.curCategory = null
      this.curCategory = this.categorys.find(item => item.name === this.defaultCategoryName)
      this.text = ''
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    curCategoryTag() {
      return this.curCategory && this[this.curCategory.key]
    },
    sexData() {
      return ['男', '女']
    },
    jobData() {
      return this.job && this.job.map(item => item.tag_value)
    },
    contentData() {
      return this.content && this.content.map(item => item.name)
    },
    consumeData() {
      return this.consume && this.consume.map(item => item.name)
    }
  },
  methods: {
    toggleTag(item) {
      const index = this.selectedTags.indexOf(item)
      if (~index) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(item)
      }
    },
    push() {
      if (this.status === PUSH_STATUS) {
        this.status = PUSHED_STATUS
        return
      }
      window.open('https://dssdsp.meizu.com/push/list')
    }
  }
}
</script>

<style lang="less" scoped>
.push-title {
  margin-top: 20px;
  font-weight: 600;
}

.push-select {
  display: flex;
  height: 160px;
  border: solid 1px #dcdfe6;
}

.push-select-category {
  box-sizing: border-box;
  padding: 10px 30px;
  width: 140px;
  border-right: solid 1px #dcdfe6;

  .push-select-item {
    text-align: right;
  }
}

.push-select-value {
  flex: 1;
  box-sizing: border-box;
  padding: 10px 30px;
  max-height: 100%;
  overflow-y: auto;
}

.push-select-item {
  margin: 0;
  line-height: 2;

  > a {
    cursor: pointer;
  }

  &.active {
    color: #90c3f2;
  }
}

.push-count {
  margin-left: 5px;
  color: rgb(248, 139, 85);
}

.push-tag {
  margin-top: -10px;

  .el-tag {
    margin-top: 10px;
    margin-right: 10px;
  }
}

.push-action {
  margin-top: 20px;
  text-align: right;
}
</style>

