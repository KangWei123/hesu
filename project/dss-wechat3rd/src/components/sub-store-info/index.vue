<template>
  <div class="sub-store-info">
    <div class="all-sub-store" v-if="showAll && isAllStore">{{ allText }}</div>
    <div v-else>
      <el-tooltip placement="top" popper-class="sub-store-tooltip" :manual="showMore" v-model="showTooltip">
        <div slot="content" class="content-box">
          <i class="el-icon-close close" @click="onMore" v-if="showMore"></i>
          <div v-for="store in data.storeList" :key="store.id" class="store-item">
            <span>{{ store.storeName }}</span>
            <span v-if="!showAll">
              <span>：</span>
              <span v-if="store.suitSubStoreType === suitSubStoreTypeEnum.ALL">所有</span>
              <span v-else>
                <span v-for="(item, index) in store.subStoreList" :key="item.subStoreId"
                  >{{ index !== 0 ? '、' : '' }}{{ item.subStoreName }}</span
                >
              </span>
            </span>
          </div>
        </div>
        <div :class="['subStoreText', showMore ? 'wd260' : '']">
          {{ subStoreText }} <span v-if="showMoreButton" class="more" @click="onMore">更多</span>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import { suitSubStoreTypeEnum } from '@/dss-wechat3rd/src/constants/coupon';

  /**
   *
   */
  export default {
    name: 'SubStoreInfo',
    props: {
      data: {
        type: Object,
        default: function () {
          return {};
        },
      },
      showMore: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        suitSubStoreTypeEnum,
        showTooltip: false,
      };
    },
    computed: {
      // 是否展示所有
      showAll() {
        const { data } = this;
        let result = false;
        // 如果适用项目是全部门店显示所有
        if (data.suitStoreType === 0 || data.storeNameList == null) {
          result = true;
        } else {
          result = true;
          // 所有项目的子项目均是所有子项目，则显示所有
          data.storeList &&
            data.storeList.forEach(item => {
              if (item.suitSubStoreType === suitSubStoreTypeEnum.SUBSTORE) {
                result = false;
              }
            });
        }
        return result;
      },

      // 适用范围
      subStoreText() {
        let text = '';
        const { data } = this;
        if (data.storeList && data.storeList.length) {
          data.storeList.forEach((item, index) => {
            text += (index === 0 ? '' : '，') + item.storeName;
            if (!this.showAll) {
              text += '：';
              if (item.suitSubStoreType === suitSubStoreTypeEnum.ALL) {
                text += '所有';
              } else {
                item.subStoreList.forEach((s, i) => {
                  text += (i === 0 ? '' : '、') + s.subStoreName;
                });
              }
            }
          });
        }
        return text;
      },

      // 如果是核销弹窗非全部门店显示列出门店
      isAllStore() {
        return !this.showMore || this.data.suitStoreType === 0 || this.data.storeNameList == null;
      },

      // 展示所有文案
      allText() {
        return this.showMore ? '全部门店' : '所有';
      },

      // 是否展示更多按钮
      showMoreButton() {
        return this.showMore && this.subStoreText.length > 15;
      },
    },
    methods: {
      onMore() {
        this.showTooltip = !this.showTooltip;
      },
    },
  };
</script>

<style scoped lang="less">
  .subStoreText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .more {
      position: absolute;
      right: 30px;
      cursor: pointer;
      color: #2e8dff;
    }
  }

  .wd260 {
    width: 260px;
  }

  .content-box {
    padding: 0 10px;
    margin: 10px 0;
    max-height: 150px;
    overflow-y: auto;
    line-height: 20px;

    .store-item {
      margin-bottom: 2px;
    }

    .close {
      position: absolute;
      right: 7px;
      top: 7px;
      cursor: pointer;
    }
  }
</style>

<style lang="less">
  .el-tooltip__popper.sub-store-tooltip {
    width: auto;
    max-width: 300px;
  }
</style>
