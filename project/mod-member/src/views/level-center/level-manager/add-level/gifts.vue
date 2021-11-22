<template>
  <form-group>
    <template #title>升级礼包</template>
    <div style="margin-left: 40px">
      <div class="flex-vertical-center warning">
        <div><i class="el-icon-warning-outline"></i></div>
        <div>升级礼包仅在首次领取时发放</div>
      </div>
      <el-table :data="appList" style="width: 900px; border: 1px solid #dce1e6">
        <el-table-column prop="name" label="应用" width="150px"></el-table-column>
        <el-table-column label="积分" width="170px">
          <template slot-scope="{ row }">
            <el-input
              type="number"
              min="0"
              :max="999999"
              v-model="gifts[row.id].score"
              style="width: 94px"
              size="mini"
            ></el-input>
            <span>&nbsp;分</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠券">
          <template slot-scope="{ row }">
            <div class="flex-vertical-center">
              <a @click.prevent="openSelectDialog(row.id)" class="plus">
                <i class="el-icon-plus"></i>
                <span>选择优惠券</span>
              </a>
              <div class="coupons flex-vertical-center">
                <div
                  v-for="(v, i) of gifts[row.id].coupons"
                  :key="v.couponId"
                  :class="{ gray: v.status !== STATUS.VALID }"
                  class="flex-vertical-center"
                >
                  <span>【</span>
                  <el-tooltip :content="v.name">
                    <div class="name">{{ v.name }}</div>
                  </el-tooltip>
                  <span>】</span>
                  <span v-if="v.status !== STATUS.VALID">(已{{ STATUS_DESC[v.status] }})</span>
                  <i class="el-icon-close" @click="gifts[row.id].coupons.splice(i, 1)"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <select-dialog
      v-model="visible"
      :selected-coupons="selectedCoupons"
      @select="onSelect"
      :app-id="appId"
    ></select-dialog>
  </form-group>
</template>

<script>
  import { FormGroup } from '@/dss-common/components/form-page';
  import { sharedAppApi } from '@/business-common/api';
  import SelectDialog from '../components/upgrade-gifts-coupons/select-dialog';
  import { formatUpgradeGifts, getScoreAndCoupons } from '../utils';
  import couponEnum from '@/mod-member/src/enum/couponEnum';

  export default {
    components: { FormGroup, SelectDialog },
    props: {
      initGifts: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        appList: [],
        gifts: {},
        visible: false,
        selectedCoupons: [],
        appId: -1,
        STATUS: couponEnum.status,
        STATUS_DESC: couponEnum.getStatusDesc(),
      };
    },
    created() {
      sharedAppApi.listAllApp({}).then(
        ({ data }) =>
          (this.appList = data.map(v => {
            this.$set(this.gifts, v.id, this.gifts[v.id] || { coupons: [], score: '' });

            return { id: v.id, name: v.appName };
          }))
      );
    },
    watch: {
      initGifts(list) {
        list.forEach(v => this.$set(this.gifts, v.appId, getScoreAndCoupons(v.gifts)));
      },
    },
    methods: {
      openSelectDialog(id) {
        this.appId = id;
        this.selectedCoupons = this.gifts[id].coupons;
        this.visible = true;
      },
      onSelect(list) {
        this.gifts[this.appId].coupons = list;
      },
      getGifts() {
        const statusDesc = couponEnum.getStatusDesc();
        for (const { coupons } of Object.values(this.gifts)) {
          for (const coupon of coupons) {
            if (coupon.status !== couponEnum.status.VALID) {
              return `存在${statusDesc[coupon.status]}的优惠券: [${coupon.name}]`;
            }
          }
        }

        return formatUpgradeGifts(this.gifts, this.appList);
      },
    },
  };
</script>

<style lang="less" scoped>
  .warning {
    background: #fff3e0;
    width: 300px;
    margin-bottom: 10px;

    div {
      &:first-child {
        color: #fff;
        background: #fa7516;
        font-size: 20px;
        padding: 5px 8px;
      }

      &:last-child {
        padding-left: 20px;
        color: #fa7516;
        font-size: 16px;
      }
    }
  }

  .el-icon-close {
    color: #bcc0c7;
    cursor: pointer;

    &:hover {
      color: #ced3db;
    }
  }

  .flex-vertical-center {
    display: flex;
    align-items: center;
  }

  .name {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .coupons {
    flex-wrap: wrap;
    column-gap: 10px;
  }

  .plus {
    margin-right: 20px;
    color: #409eff;
    white-space: nowrap;

    &:hover {
      color: #66b1ff;
    }

    .el-icon-plus {
      font-size: 12px;
    }
  }

  .gray {
    color: #bcc0c7;
  }
</style>
