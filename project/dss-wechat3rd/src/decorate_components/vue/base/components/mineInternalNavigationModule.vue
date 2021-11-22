<template>
  <div
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <div class="nav-title" v-if="dataSource.showTitle">{{ dataSource.title }}</div>
    <div
      class="navigation-module"
      :class="dataSource.rowNum === 2 ? 'navigation-module-2' : ''"
      v-if="dataSource.displayStyle === 'custom'"
      :style="'background:' + dataSource.backgroundColor"
    >
      <template v-for="(item, index) in dataSource.list">
        <div class="item-wrap" :class="'item-row-' + dataSource.rowNum" v-if="item.checked" :key="index">
          <div class="item">
            <img
              v-if="item.logo"
              class="img"
              :src="item.logo"
              :style="dataSource.circularCorner === 1 ? 'border-radius:100%' : ''"
            />
            <div v-else class="img" />
            <div class="name">{{ item.name || '－' }}</div>
          </div>
        </div>
      </template>
    </div>
    <div class="default-nav-module" v-if="dataSource.displayStyle === 'default'">
      <template v-for="item in dataSource.list">
        <div class="default-nav-module-item" :key="item.id" v-if="item.checked">
          <img
            v-if="item.logo"
            class="default-nav-img"
            :src="item.logo"
            :style="dataSource.circularCorner === 1 ? 'border-radius:100%' : ''"
          />
          <div class="default-nav-name">{{ item.name || '－' }}</div>
          <img class="right-angle" src="../images/right-angle-gray.png" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';

  export default {
    name: 'MineNavigationModule',
    mixins: [industryHelperMixin],
    data() {
      return {};
    },
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },
    mounted() {
      const defaultConfig = this.$plain(this.mGetMineDecorateInternalNavLinks());

      if (!this.dataSource.list || !this.dataSource.list.length) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.list = defaultConfig;
      } else if (this.dataSource.list.length !== defaultConfig.length) {
        const objSource = {};

        this.dataSource.list.forEach(item => {
          objSource[item.value] = item;
        });

        defaultConfig.forEach((item, index) => {
          const key = item.value;

          defaultConfig[index] = objSource[key] ? objSource[key] : { ...item, ...{ checked: false } };
        });

        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.list = defaultConfig;
      }
    },
    computed: {
      showDownAngle() {
        let realLength = 0;
        this.dataSource.list.forEach(item => {
          if (item.checked) {
            realLength += 1;
          }
        });
        return realLength > this.dataSource.rowNum * 2;
      },
    },

    methods: {},
  };
</script>

<style lang="less" scoped>
  .default-nav-module {
    background: white;
  }

  .default-nav-module-item {
    height: 50px;
    position: relative;

    .default-nav-img {
      width: 28px;
      height: 28px;
      position: absolute;
      left: 20px;
      top: 11px;
    }

    .default-nav-name {
      position: absolute;
      left: 60px;
      top: 11px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }

    .right-angle {
      width: 5px;
      height: 9px;
      position: absolute;
      right: 30px;
      top: 20.5px;
    }
  }

  .navigation-module {
    background: rgba(255, 255, 255, 1);
    font-size: 0;
  }

  .navigation-module-2 {
    padding-left: 20px;
  }

  .navigation-module-2 .item-wrap {
    margin-top: 10px;
  }

  .item-wrap {
    display: inline-block;
    margin-top: 15px;
  }

  .item-row-2 {
    width: 160px;
  }

  .item-row-4 {
    width: 25%;
  }

  .item-row-5 {
    width: 20%;
  }

  .item-row-2:nth-child(odd) {
    margin-right: 15px;
  }

  .item-row-2 .item {
    width: 100%;

    .img {
      width: 100%;
      height: 80px;
      border-radius: 4px;
    }

    .name {
      width: 100%;
      color: #343434;
      font-size: 15px;
      height: 21px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(52, 52, 52, 1);
      line-height: 21px;
      margin-top: 16px;
    }
  }

  .item {
    width: 60px;
    margin: 0 auto;
    text-align: center;

    .img {
      width: 28px;
      height: 28px;
      margin: 0 auto;
    }

    .name {
      width: 60px;
      overflow: hidden;
      white-space: nowrap;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      transform: scale(0.95);
    }
  }

  .down-angle img {
    width: 17px;
    height: 10px;
  }

  .down-angle {
    margin: 4px auto 0;
    text-align: center;
  }

  .reverse {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }

  .nav-title {
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 21px;
    background: white;
    padding: 20px 20px 10px;
  }
</style>
