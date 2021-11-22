<template>
  <el-dialog :visible.sync="mShowDialog" title="选择优惠券" append-to-body width="80%">
    <div style="text-align: left; margin-bottom: 10px">
      <el-input type="search" placeholder="按优惠券名称搜索" style="width: 210px" v-model="name"></el-input>
      <el-button icon="el-icon-search" type="primary" style="margin-left: 10px" @click="onSizeChange(5)">
        搜索
      </el-button>
    </div>

    <c-table
      :list="data"
      has-selection
      :has-count="globalIsUmpPlatformApp"
      :selected-ids="selectArr"
      ref="table"
      @selection-change="onSelectChange"
      v-loading="loading"
    ></c-table>
    <el-pagination
      v-if="totalCount"
      :hide-on-single-page="true"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :page-size="pageParams.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      layout="sizes, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>

    <template #footer>
      <div style="text-align: right">
        <el-button @click="mShowDialog = false">取消</el-button>
        <el-button type="primary" @click="onSure">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import DialogMixin from '@/dss-common/mixins/dialog-mixin';
  import CTable from './table.vue';
  import { getCouponListByApp } from '@/mod-member/src/api/couponApi';
  import { validateCount, pretreatmentCoupon, event } from '../../utils';
  import { SET_COUNT_DIRTY } from './count-input.vue';

  export default {
    components: { CTable },
    mixins: [DialogMixin],
    props: {
      selectedCoupons: {
        type: Array,
        default: () => [],
      },
      appId: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        data: [],
        totalCount: 0,
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
        loading: false,
        selectedIds: new Set(), // 已选择的优惠券id
        allData: new Map(), // 已查询的所有优惠券数据
        name: '',

        flag: false,
      };
    },
    watch: {
      mShowDialog(value) {
        if (value) {
          this.selectedIds.clear();
          this.selectedCoupons.forEach(v => {
            this.selectedIds.add(v.couponId);
            this.allData.set(v.couponId, v);
          });
          this.flag = !this.flag;

          this.data = [];
          this.name = '';
          this.onSizeChange(5);
        }
      },
    },
    computed: {
      table: {
        cache: false,
        get() {
          return this.$refs.table;
        },
      },
      selectArr() {
        // eslint-disable-next-line no-unused-vars
        const x = this.flag;
        return Array.from(this.selectedIds);
      },
    },
    methods: {
      async getDataList() {
        if (this.loading) {
          return;
        }
        this.loading = true;

        const { data, totalCount } = await getCouponListByApp({
          appId: this.appId,
          name: this.name,
          status: 1,
          ...this.pageParams,
        }).finally(() => (this.loading = false));

        this.data.forEach(v => this.allData.set(v.id, v)); // 存储上次查询数据的赠券数
        this.data = data || [];
        this.totalCount = totalCount;

        // 暂存已选择优惠券, 防止数据变动时执行的selection-change清空数据
        const ids = new Set(this.selectedIds);
        await this.$nextTick();
        this.data.forEach(v => {
          pretreatmentCoupon(v);

          if (ids.has(v.id)) {
            this.table.elTable.toggleRowSelection(v, true);
            v.count = this.allData.get(v.id)?.count || '';
          }

          this.allData.set(v.id, v);
        });
      },
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.getDataList();
      },
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getDataList();
      },
      async onSelectChange(selection) {
        this.data.forEach(item => {
          if (selection.some(v => v.id === item.id)) {
            this.selectedIds.add(item.id);
          } else {
            this.selectedIds.delete(item.id);
          }
        });

        this.flag = !this.flag;
      },
      onSure() {
        event.$emit(SET_COUNT_DIRTY, true);

        const list = [];
        for (const id of this.selectedIds) {
          const coupon = this.allData.get(id);
          if (this.globalIsUmpPlatformApp && !validateCount(coupon)) {
            return this.$message.error(`[${coupon.name}]赠券数错误`);
          }

          list.push(coupon);
        }
        this.$emit('select', list);

        this.mShowDialog = false;
      },
    },
  };
</script>
