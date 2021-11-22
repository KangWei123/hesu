<template>
  <div>
    <div class="com-row" v-if="!hiddenRadius">
      <span class="com-column">圆角效果：</span>
      <span class="com-column">
        <div class="com-slide">
          <el-slider v-model="dataSource.radius" :show-tooltip="false" :max="20" :min="0" :step="1"></el-slider>
        </div>
      </span>
      <el-input class="px-title" v-model.number="dataSource.radius" type="number"></el-input>
    </div>

    <div class="com-row">
      <span class="com-column">上间距：</span>
      <span class="com-column">
        <div class="com-slide">
          <el-slider
            v-model="dataSource.marginUp"
            :show-tooltip="false"
            :max="25"
            :min="-50"
            :step="1"
            :marks="marks"
          ></el-slider>
        </div>
      </span>
      <el-input class="px-title" v-model.number="dataSource.marginUp" type="number"></el-input>
    </div>

    <div class="com-row">
      <span class="com-column">下间距：</span>
      <span class="com-column">
        <div class="com-slide">
          <el-slider v-model="dataSource.marginDown" :show-tooltip="false" :max="25" :min="0" :step="1"></el-slider>
        </div>
      </span>
      <el-input class="px-title" v-model.number="dataSource.marginDown" type="number"></el-input>
    </div>

    <div class="com-row">
      <span class="com-column">左右间距：</span>
      <span class="com-column">
        <div class="com-slide">
          <el-slider v-model="dataSource.marginLeftRight" :show-tooltip="false" :max="25" :min="0" :step="1" />
        </div>
      </span>
      <el-input class="px-title" v-model.number="dataSource.marginLeftRight" type="number"></el-input>
    </div>

    <div class="com-row" v-if="showGap">
      <span class="com-column">{{ gapName }}：</span>
      <span class="com-column">
        <div class="com-slide">
          <el-slider v-model="dataSource.gap" :show-tooltip="false" :max="30" :min="0" :step="1" />
        </div>
      </span>
      <el-input class="px-title" v-model.number="dataSource.gap" type="number"></el-input>
    </div>
  </div>
</template>

<script>
  import './css/common.less';

  export default {
    name: 'DecorateEditSize',
    props: {
      showGap: {
        type: Boolean,
        default: false,
      },
      gapName: {
        type: String,
        default: '间隙',
      },
      dataSource: {
        type: Object,
        default: null,
      },
      hiddenRadius: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        marks: {
          0: '0',
        },
      };
    },
    mounted() {
      if (!this.dataSource.hasOwnProperty('radius')) {
        this.$set(this.dataSource, 'radius', 0);
      }
      if (!this.dataSource.hasOwnProperty('marginUp')) {
        this.$set(this.dataSource, 'marginUp', 0);
      }
      if (!this.dataSource.hasOwnProperty('marginDown')) {
        this.$set(this.dataSource, 'marginDown', 0);
      }
      if (!this.dataSource.hasOwnProperty('marginLeftRight')) {
        this.$set(this.dataSource, 'marginLeftRight', 0);
      }
    },
  };
</script>
<style lang="less" scoped>
  /deep/.el-slider__marks-text {
    margin-top: -24px;
    color: #7e859f;

    &::before {
      content: '';
      border-left: 1px dotted #cfd4dd;
      height: 13px;
      width: 0;
      position: absolute;
      top: 21px;
      left: 4px;
    }
  }

  /deep/.el-slider__stop {
    visibility: hidden;
  }
</style>
