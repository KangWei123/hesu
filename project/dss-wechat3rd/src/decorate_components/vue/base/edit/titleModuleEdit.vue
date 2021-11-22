<template>
  <div class="title-editor" v-if="dataSource">
    <!-- <div class="com-title"><span>标题</span></div> -->
    <edit-header :data-source="dataSource" name="标题"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">上下内间距：</span>
        <span class="com-column">
          <div class="com-slide">
            <el-slider v-model="dataSource.margin" :max="40" :show-tooltip="false" :min="0" :step="5"></el-slider>
          </div>
        </span>
        <span class="px-title">{{ dataSource.margin }}</span>
      </div>
      <div class="com-row">
        <span class="com-column input-title">标题内容：</span>
        <span class="com-column">
          <el-input class="com-input" v-model="dataSource.title" placeholder="请输入"></el-input>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">背景颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.backgroundColor"
            :color-model.sync="dataSource.bgMode"
            :default-color="defaultBgColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">文字颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.titleColor"
            :color-model.sync="dataSource.titleMode"
            :default-color="defaultTitleColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">显示位置：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.textAlign">
            <el-radio v-for="(item, index) in posList" :label="item.value" :key="index" border>{{
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
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import size from './size.vue';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'TitleModuleEdit',
    components: {
      colorSelect,
      size,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        // 上下间距
        distance: 0,

        // 显示位置
        textAlign: 'left',
        posList: [
          { value: 'left', name: '靠左' },
          { value: 'center', name: '居中' },
          { value: 'right', name: '靠右' },
        ],

        // 标题内容
        title: '',

        // 背景颜色
        bgList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
        defaultBgColor: '#FFFFFF',

        // 文字颜色
        titleList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
        defaultTitleColor: '#000000',
      };
    },

    methods: {
      changeBgColor(val) {
        this.dataSource.bgMode = val;
        if (val === 'default') {
          this.customBgColor = this.dataSource.backgroundColor;
          this.dataSource.backgroundColor = this.defaultBgColor;
        } else {
          this.dataSource.backgroundColor = this.customBgColor;
        }
      },

      changeTitleColor(val) {
        this.dataSource.titleMode = val;
        if (val === 'default') {
          this.customTitleColor = this.dataSource.titleColor;
          this.dataSource.titleColor = this.defaultTitleColor;
        } else {
          this.dataSource.titleColor = this.customTitleColor;
        }
      },
    },
  };
</script>
