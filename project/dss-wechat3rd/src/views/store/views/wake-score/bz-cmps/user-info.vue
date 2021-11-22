<template>
  <div class="user-info">
    <card-border />
    <div class="title">欢迎您来到{{wkbTitle ? wkbTitle : '惟客数据'}}</div>
    <div class="head-box">
      <img class="avetor"
           :style="{opacity: curent === 1 ? 1 : 0}"
           :src="img_1">
      <img class="avetor"
           :style="{opacity: curent === 2 ? 1 : 0}"
           :src="img_2">
    </div>
    <div class="tag sex">
      <span v-if="data.faceGender==null"></span>
      <span v-else>{{data.faceGender === 1 ? '男性': '女性'}}</span>
    </div>
    <div class="tag age">
      <span v-if="data.faceAge==null"></span>
      <span v-else>{{data.faceAge|age}}岁</span>
    </div>
    <div class="tag expression">{{getExpression(data.expression)}}</div>
    <div class="tag count">
      <span v-if="data.count==null"></span>
      <span v-else-if="isEnterFaceScore">{{data.count > 1 ? data.count+'次访问' : '首次访问'}}</span>
      <span v-else>{{data.count > 1 ? data.count+'次体验' : '首次体验'}}</span>
    </div>
    <!-- 疑似标识 -->
    <!-- <span class="suspected"
          v-if="data.faceTag===2">
      <span class="suspected-logo">!</span>
      <span class="suspected-text">照片不佳</span>
    </span> -->

    <!-- 连接线 -->
    <div class="line-box">
      <div class="line"></div>
      <div class="line"></div>
    </div>

  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import cardBorder from './card-border.vue';
export default {
  components: { cardBorder },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    wkbTitle: {
      type: String,
      default: null
    },
    isEnterFaceScore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      img_1: '',
      img_2: '',
      curent: 1,
      expressionList: [
        '黯然伤神',
        '半嗔半喜',
        '似笑非笑',
        '笑逐颜开',
        '莞尔一笑',
        '喜上眉梢',
        '眉开眼笑',
        '笑尽妖娆',
        '心花怒放',
        '一笑倾城'
      ]
    };
  },
  computed: {},
  watch: {
    data(val, oldVal) {
      if (this.curent === 1) {
        this.img_2 = val.image;
        this.curent = 2;
        if (!oldVal) {
          this.img_1 = val.image;
        }
      } else {
        this.img_1 = val.image;
        this.curent = 1;
        if (!oldVal) {
          this.img_2 = val.image;
        }
      }
    }
  },
  filters: {
    textoverflow(val) {
      if (val.length > 16) {
        val = val.substring(0, 15) + '...';
      }
      return val;
    },

    age(val) {
      if (val < 18) {
        val = '< ' + 18;
      }
      return val;
    },

    formatMoney(money, precision = 2) {
      return (~~money / 100).toFixed(precision);
    }
  },

  created() {
    if (this.data) {
      this.img_1 = this.data.image;
      this.img_2 = this.data.image;
    }
  },

  methods: {
    formatDate(strDate) {
      if (!strDate) {
        return '';
      }
      return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
    },
    getExpression(val) {
      if (val === 100) {
        return this.expressionList[9];
      }
      return this.expressionList[parseInt(val / 10, 10)];
    }
  }
};
</script>

<style lang="less" scoped>
.user-info {
  width: 100%;
  height: 100%;
  background-image: url('../../../asserts/images/face-score/user-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
  .title {
    padding-top: 14px;
    text-align: center;
    font-size: 18px;
    color: rgba(124, 250, 255, 1);
  }
  .head-box {
    position: absolute;
    top: 94px;
    left: 130px;
    display: inline-block;
    width: 262px;
    height: 262px;
    line-height: 262px;
    border: 2px dashed #4fe7f1;
    text-align: center;
    box-sizing: border-box;
    border-radius: 100%;
    .avetor {
      width: 206px;
      height: 206px;
      border-radius: 206px;
      box-shadow: 0px 0px 36px 2px rgba(70, 205, 218, 1);
      position: absolute;
      top: 28px;
      left: 28px;
      transition: all 0.8s linear;
    }
  }
  .tag {
    width: 108px;
    height: 47px;
    line-height: 47px;
    background-image: url('../../../asserts/images/face-score/tag-bg.png');
    background-repeat: no-repeat;
    background-size: contain;
    text-align: center;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
  }
  .sex {
    position: absolute;
    top: 90px;
    left: 27px;
  }
  .age {
    position: absolute;
    top: 91px;
    left: 389px;
  }
  .expression {
    position: absolute;
    top: 307px;
    left: 37px;
  }
  .count {
    position: absolute;
    top: 330px;
    left: 381px;
  }
  .line-box {
    left: -50px;
    top: 100px;
  }
}
</style>
