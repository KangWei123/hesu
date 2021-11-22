<template>
  <div class="flow-list top-right-shadow-box">
    <div class="inner-container"
         ref="Box"
         @scroll="scrollItem">
      <div class="flow-item"
           v-bind:class="index === selectIndex ? 'first-item': ''"
           v-for="(user, index) in data"
           :key="user.idStr"
           @click="handleIndex(index)">
        <img class="user-logo"
             v-bind:class="selectIndex ===0  ? 'first-logo': ''"
             :src="user.faceImgUrl" />
        <p class="user-name">{{user.name | hideName(user.faceGender) }}&nbsp;&nbsp;{{user.faceAge|age}}岁</p>
        <p class="detail">
          <span class="detail-title">会员等级:</span>
          <span>{{user.levelName | levelName(user.vip) }}</span>
        </p>
        <p class="detail">
          <span class="detail-title">进店次数:</span>
          <span>{{user.count || 0}}次</span>
        </p>
        <p class="detail">
          <span class="detail-title">消费次数:</span>
          <span>{{user.totalCount || 0}}次</span>
        </p>
      </div>
    </div>
    <div class="btn-time"
         @click="scrollTop"
         v-if="isStatic">返回实时列表</div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selectIndex: 0,
      isStatic: false
    };
  },
  filters: {
    age(val) {
      if (val < 18) {
        val = '<' + 18;
      }
      return val;
    },
    hideName(name, sex) {
      if (name) {
        return name.slice(0, 1) + (sex === 1 ? '先生' : '女士');
      } else {
        return '--';
      }
    },
    levelName(level, vip) {
      if (!vip || !level) {
        return '非会员';
      } else {
        return level.replace(/会员/g, '') + '会员';
      }
    }
  },

  methods: {
    formatDate(strDate) {
      if (!strDate) {
        return '';
      }
      return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
    },
    scrollItem() {
      if (this.$refs.Box.scrollTop) {
        this.isStatic = true;
        this.$emit('choose', this.selectIndex, this.isStatic);
      }
    },
    scrollTop() {
      this.$refs.Box.scrollTop = 0;
      this.selectIndex = 0;
      this.isStatic = false;
      this.$emit('choose', this.selectIndex, this.isStatic);
    },
    handleIndex(index) {
      this.selectIndex = index;
      this.isStatic = true;
      this.$emit('choose', this.selectIndex, this.isStatic);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../css/base.less';
.flow-list {
  width: 100%;
  height: 860px;
  border-top-right-radius: 10px;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  .btn-time {
    display: inline-block;
    text-align: center;
    width: 100%;
    height: 30px;
    border-radius: 6px;
    line-height: 30px;
    background: rgba(125, 122, 122, 0.81);
    color: #ffffff;
    position: absolute;
    left: 0;
    bottom: 0;
    cursor: pointer;
  }
  .inner-container {
    position: absolute;
    left: 0;
    top: 0;
    right: -17px;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .flow-item {
    margin: 25px 18px 0 0;
    border-bottom: 1px solid #25b5ff4f;
    box-sizing: border-box;
  }

  .flow-item:last-child {
    border-bottom: 0;
  }

  .user-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .user-name {
    color: @font-blue;
    font-size: 14px;
    line-height: 14px;
    margin: 10px 0;
  }

  .detail {
    width: 85%;
    height: 8px;
    color: #ffffff;
    font-size: 10px;
    line-height: 10px;
    text-align: right;
    margin: 11px 10px;

    &-title {
      float: left;
    }
  }

  .first-item {
    height: 160px;
    margin: 0 1px 0 0;
    padding-right: 18px;
    border-top: 2px solid @border-blue;
    border-bottom: 2px solid @border-blue;
    border-right: 2px solid @border-blue;
    box-shadow: -4px -3px 17px 4px @shadow-blue inset;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 10px;
    position: relative;

    .user-logo {
      width: 70px;
      height: 70px;
      border: 2px solid @border-blue;
      position: absolute;
      top: -40px;
      left: 48px;
    }
    .first-logo {
      position: fixed;
    }

    .user-name {
      margin: 50px 0 12px;
    }
  }
}
</style>
