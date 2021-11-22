<template>

  <div class="real-box"
       :style="customStyle">
    <div class="real-name">
      {{itemData.realName}}
    </div>
    <div class="real-sales">{{itemData.realCount|thousands}}</div>
    <div class="real-prop">
      <span class="label"
            v-if="itemData.sameRatio||itemData.sameRatio===0">同比<span :class="itemData.sameRatio>=0?'same':'ring'">{{itemData.sameRatio|Percentage}}</span></span>
      <span class="label"
            v-if="itemData.ringRatio||itemData.ringRatio===0">环比<span :class="itemData.ringRatio>=0?'same':'ring'">{{itemData.ringRatio|Percentage}}</span></span>
      <span class="label"
            v-if="itemData.lastRatio||itemData.lastRatio===0">对比上周<span :class="itemData.lastRatio>=0?'same':'ring'">{{itemData.lastRatio|Percentage}}</span></span>
    </div>
  </div>

</template>

<script>
export default {
  name: 'realTime',

  props: {
    itemData: {
      type: Object,
      default: {}
    },

    customStyle: {
      type: Object,
      default() {
        return null;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.real-box {
  width: 19%;
  height: 150px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin-right: 1.21%;
  margin-bottom: 20px;
  float: left;
  padding: 20px;
  box-sizing: border-box;
  .real-name {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .real-sales {
    font-size: 36px;
    color: rgba(51, 51, 51, 1);
    margin-top: 10px;
  }
  .real-prop {
    font-size: 12px;
    color: rgba(51, 51, 51, 1);
    margin-top: 20px;
    .label + .label {
      margin-left: 30px;
    }
    .same {
      color: rgba(55, 190, 143, 1);
      margin-left: 5px;
    }
    .ring {
      color: rgba(251, 73, 56, 1);
      margin-left: 5px;
    }
  }
  @media screen and (max-width: 1500px) {
    .real-sales {
      font-size: 30px;
    }
    .real-prop {
      .label + .label {
        margin-left: 7px;
      }
    }
  }
  @media screen and (max-width: 1350px) {
    .real-sales {
      font-size: 24px;
    }
    .real-prop {
      margin-top: 15px;
      .label {
        display: block;
      }
      .label + .label {
        margin-left: 0px;
      }
    }
  }
}
.real-box:last-child {
  margin-right: 0px;
}
</style>
