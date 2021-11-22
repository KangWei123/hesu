<template>
  <div class="title-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="辅助空白"></edit-header>

    <div class="com-body">
      <div class="com-row color-row-input">
        <span class="com-column">背景颜色：</span>
        <span class="com-column">
          <el-radio
            v-for="(item, index) in bgList"
            :key="index"
            @change="changeColor"
            v-model="dataSource.bgMode"
            :label="item.value"
            border
            >{{ item.name }}</el-radio
          >
          <div v-if="dataSource.bgMode == 'custom'" class="bg-input font-input">
            <el-color-picker
              class="com-color-picker"
              v-model="dataSource.backgroundColor"
              size="mini"
              show-alpha
            ></el-color-picker>
            <el-input
              :readonly="true"
              class="com-small-input"
              v-model="dataSource.backgroundColor"
              placeholder=""
            ></el-input>
          </div>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">空白高度：</span>
        <span class="com-column">
          <div class="com-slide">
            <el-slider v-model="dataSource.height" :show-tooltip="false" :min="1" :max="100" :step="1"></el-slider>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import './css/titleModuleEdit.less';
  import './css/common.less';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'TitleModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      EditHeader,
    },
    watch: {
      customColor: {
        immediate: true,
        handler(val, oldVal) {
          if (val !== oldVal) {
            this.dataSource.backgroundColor = val;
          }
        },
      },
    },
    data() {
      return {
        // 上下间距
        distance: 0,
        // 背景颜色
        bgList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
      };
    },

    methods: {
      changeColor(val) {
        this.dataSource.bgMode = val;
        if (val === 'default') {
          this.customColor = this.dataSource.backgroundColor;
          this.dataSource.backgroundColor = this.dataSource.defaultColor;
        } else {
          this.dataSource.backgroundColor = this.customColor || this.dataSource.defaultColor;
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .com-row {
    .font-input {
      width: 245px;
      display: flex;
    }

    .el-color-picker--mini {
      margin-right: 10px;
      border: 4px solid #d0d5d9;
      border-radius: 4px;
    }

    .el-color-picker--mini,
    /deep/.el-color-picker--mini .el-color-picker__trigger {
      width: 62px;
      height: 22px;
    }
  }
</style>
