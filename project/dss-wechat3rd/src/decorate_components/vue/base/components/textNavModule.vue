<template>
  <div class="text-nav-module">
    <div
      class="text-nav-module-container"
      :style="{
        'background-color': dataSource.bgColor,
        padding: (dataSource.paddingUpDown || 10) + 'px ' + (dataSource.paddingLeftRight || 10) + 'px',
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        borderRadius: dataSource.radius + 'px',
      }"
    >
      <div class="text-nav-module-title" :style="itemStyle()">
        <img class="left-icon" v-if="dataSource.icon && dataSource.showIcon" :src="iconStyle(dataSource.icon)" />
        <div class="ellipsis" style="max-width: 150px">{{ dataSource.title }}</div>
      </div>
      <div v-if="dataSource.showMore == 1" class="more" :style="moreStyle()">
        <div class="ellipsis" :style="{ color: dataSource.subTitleColor, 'max-width': '150px' }">
          {{ dataSource.subTitle }}
        </div>
        <div class="right-angle"></div>
      </div>
    </div>
  </div>
</template>
<script>
  function getImagesData(icon) {
    if (icon && icon.startsWith('http')) {
      return icon;
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(`@/dss-wechat3rd/src/decorate_components/vue/base/images/${icon}.png`);
  }
  export default {
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return {};
        },
      },
    },
    data() {
      return {};
    },
    methods: {
      itemStyle() {
        return {
          color: this.dataSource.titleColor,
          'font-size': this.dataSource.fontSize,
        };
      },

      moreStyle() {
        return {
          color: this.dataSource.titleColor,
        };
      },

      iconStyle(icon) {
        return getImagesData(icon);
      },
    },
  };
</script>

<style lang="less">
  .text-nav-module {
    .text-nav-module-container {
      position: relative;

      .text-nav-module-title {
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(55, 58, 68, 1);
        display: inline-block;
        font-size: 0;
        & > div:nth-child(n) {
          display: inline-block;
        }
        .left-icon {
          width: 23px;
          height: 20px;
          vertical-align: middle;
        }
      }

      .more {
        position: absolute;
        display: inline-block;
        right: 10px;
        line-height: 30px;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(55, 58, 68, 1);

        & > div {
          display: inline-block;
        }

        .right-angle {
          background-image: url(../images/right-angle-gray.png);
          background-size: auto 100%;
          background-repeat: no-repeat;
          width: 5px;
          height: 9px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
