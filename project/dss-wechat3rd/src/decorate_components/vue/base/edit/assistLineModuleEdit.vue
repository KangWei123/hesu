<template>
  <div class="title-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="辅助线"></edit-header>

    <div class="com-body">
      <div class="com-row color-row-input">
        <span class="com-column">线条颜色：</span>
        <span class="com-column">
          <el-radio
            v-for="(item, index) in bgList"
            :key="index"
            @change="changeColor"
            v-model="dataSource.lineMode"
            :label="item.value"
            border
            >{{ item.name }}</el-radio
          >
          <div v-if="dataSource.lineMode == 'custom'" class="bg-input">
            <el-color-picker class="com-color-picker" v-model="dataSource.lineColor" size="mini"></el-color-picker>
            <el-input :readonly="true" class="com-small-input" v-model="dataSource.lineColor" placeholder=""></el-input>
          </div>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">左右边距：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showMargin">
            <el-radio v-for="(item, index) in marginList" :key="index" :label="item.value" border>{{
              item.name
            }}</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">样式：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.style">
            <el-radio v-for="(item, index) in styleList" :key="index" :label="item.value" border>{{
              item.name
            }}</el-radio>
          </el-radio-group>
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

    data() {
      return {
        styleList: [
          { value: 'solid', name: '实线' },
          { value: 'dashed', name: '虚线' },
          { value: 'dotted', name: '点线' },
        ],
        marginList: [
          { value: 'false', name: '无边距' },
          { value: 'true', name: '左右留边' },
        ],
        // 背景颜色
        bgList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
        defaultColor: '#878181',
      };
    },

    methods: {
      changeColor(val) {
        this.dataSource.lineMode = val;
        if (val === 'default') {
          this.customColor = this.dataSource.lineColor;
          this.dataSource.lineColor = this.defaultColor;
        } else {
          this.dataSource.lineColor = this.customColor;
        }
      },
    },
  };
</script>
