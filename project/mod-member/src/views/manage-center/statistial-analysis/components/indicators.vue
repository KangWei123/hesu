<template>
  <div class="indicators analysis-box">
    <div class="analysis-title">实时指标</div>
    <div class="list" v-loading="loading">
      <div class="indicator-item" v-for="(item, index) in realData" :key="index">
        <span class="indicator-item-name">{{ item.name }}</span>
        <el-tooltip :content="item.tip" placement="right">
          <span class="tip-logo">?</span>
        </el-tooltip>
        <div class="indicator-item-count">{{ item.count }}</div>
        <div v-if="'sequential' in item" class="sequential">
          日环比
          <span :class="item.sequential >= 0 ? 'up' : 'down'">
            <span>{{ item.sequential >= 0 ? '+' + item.sequential : item.sequential }}%</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/mod-member/src/api/manage.js';
  export default {
    props: {
      currentStore: null,
    },
    data() {
      return {
        realData: [],
        loading: false,
      };
    },
    watch: {
      currentStore(val) {
        this.getData();
      },
    },
    methods: {
      getData(data) {
        this.loading = true;
        api
          .getClientIndicators({
            storeId: this.currentStore,
          })
          .then(res => {
            const {
              totalClientCount,
              newClientCount,
              newClientCountQOQ,
              newTelesalesClientCount,
              newTelesalesClientCountQOQ,
              newInvalidClientCount,
              newInvalidClientCountQOQ,
            } = res.data;
            if (!this.currentStore) {
              this.realData = [
                { name: '企业客户总数', count: totalClientCount || 0, tip: '企业总客户数量' },
                {
                  name: '企业新增客户数（去重）',
                  count: newClientCount || 0,
                  tip: '企业新增的客户数（去重）',
                  sequential: ((newClientCountQOQ || 0) * 100).toFixed(2),
                },
                {
                  name: '新增电销客户数（去重）',
                  count: newTelesalesClientCount || 0,
                  tip: '添加至电销列表的客户数（去重）',
                  sequential: ((newTelesalesClientCountQOQ || 0) * 100).toFixed(2),
                },
                {
                  name: '今日战败客户数',
                  count: newInvalidClientCount || 0,
                  tip: '被置为放弃（无效）的客户数',
                  sequential: ((newInvalidClientCountQOQ || 0) * 100).toFixed(2),
                },
              ];
            } else {
              this.realData = [
                { name: '门店客户总数', count: totalClientCount || 0, tip: '门店总客户数量' },
                {
                  name: '门店新增客户数（去重）',
                  count: newClientCount || 0,
                  tip: '门店新增的客户数（去重）',
                  sequential: ((newClientCountQOQ || 0) * 100).toFixed(2),
                },
              ];
            }
          })
          .catch(err => {
            if (!this.currentStore) {
              this.realData = [
                { name: '企业客户总数', count: 0, tip: '企业总客户数量' },
                { name: '企业新增客户数（去重）', count: 0, tip: '企业新增的客户数（去重）', sequential: 0.0 },
                { name: '新增电销客户数（去重）', count: 0, tip: '添加至电销列表的客户数（去重）', sequential: 0.0 },
                { name: '今日战败客户数', count: 0, tip: '被置为放弃（无效）的客户数', sequential: 0.0 },
              ];
            } else {
              this.realData = [
                { name: '门店客户总数', count: 0, tip: '门店总客户数量' },
                { name: '门店新增客户数（去重）', count: 0, tip: '门店新增的客户数（去重）', sequential: 0.0 },
              ];
            }
          })
          .always(_ => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .indicators {
    overflow: hidden;
    .list {
      overflow: hidden;
    }
    .indicator-item {
      float: left;
      min-width: 150px;
      background: #fff;
      border-radius: 4px;
      margin: 0 0 20px 30px;
      padding-left: 30px;
      &-name {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a8a8a8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &-count {
        display: inline-block;
        width: 100%;
        font-size: 24px;
        font-family: DIN-Medium, DIN;
        font-weight: 500;
        color: #404040;
        padding: 10px 30px 10px 0;
        box-sizing: border-box;
        border-right: 1px solid #ebebeb;
      }
    }
    .indicator-item:last-child .indicator-item-count {
      border: 0;
    }
    .tip-logo {
      border-radius: 50%;
      border: 1px solid #a8a8a8;
      color: #a8a8a8;
      margin-left: 10px;
      display: inline-block;
      width: 14px;
      height: 14px;
      text-align: center;
      font-size: 12px;
      line-height: 14px;
      cursor: pointer;
    }
    .sequential {
      font-size: 12px;
      color: #333;
      padding: 10px 0;
      .up {
        color: #37be8f;
      }
      .up::after {
        width: 10px;
        height: 10px;
        display: inline-block;
        border: 4px solid transparent;
        border-bottom-color: #37be8f;
      }
      .down {
        color: #fb4938;
      }
    }
  }
</style>
