<template>
  <div style="padding-bottom: 20px">
    <el-form style="padding: 20px" inline label-suffix="：" @submit.native.prevent="onSearch">
      <el-form-item label="应用">
        <app-select v-model="appId" placeholder="请选择应用" clearable></app-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filterStatus" placeholder="请选择状态">
          <el-option v-for="s in status" :key="s.value" :value="s.value" :label="s.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">搜索</el-button>
        <el-button plain @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <fat-table :fetch-handler="fetchData" ref="table">
      <el-table-column prop="userCardNo" label="礼品卡序号" width="220" class-name="stress-font"> </el-table-column>
      <el-table-column prop="cardItemName" label="名称"></el-table-column>
      <el-table-column prop="buyTime" label="购买时间"></el-table-column>
      <el-table-column prop="storeName" label="购买门店"></el-table-column>
      <el-table-column label="应用" prop="appName"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          {{ row.ownerStatus === 0 ? (row.cardStatus === 0 ? '' : '自用') : '赠送' }}
          {{ row.cardStatus === 0 ? '未激活' : '已激活' }}
        </template>
      </el-table-column>
      <el-table-column label="获赠人">
        <template slot-scope="{ row }">
          <div class="text-over-hidden">{{ row.receiveUserNickname }}</div>
          <div class="text-over-hidden">{{ row.receiveUserPhone || '-' }}{{ row.receiveUserRealName || '-' }}</div>
        </template>
      </el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { giftCardStatus } from '@/mod-member/src/enum/card';
  import api from '@/mod-member/src/api/memberAPI';
  import AppSelect from '@/business-common/components/app-select';
  import { FatTable } from '@/dss-common/components/list-page/index';

  export default {
    components: { AppSelect, FatTable },
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        status: [{ value: '', label: '所有' }].concat(giftCardStatus.getArray()),
        filterStatus: '',
        appId: '',
      };
    },
    computed: {
      selectedStatus() {
        switch (this.filterStatus) {
          case giftCardStatus.SELF_ACTIVATION: {
            return {
              ownerStatus: 0, // 自用
              cardStatus: 1, // 激活
            };
          }
          case giftCardStatus.GIFT_INACTIVATION: {
            return {
              ownerStatus: 1, // 赠送
              cardStatus: 0, // 未激活
            };
          }
          case giftCardStatus.GIFT_ACTIVATION: {
            return {
              ownerStatus: 1, // 赠送
              cardStatus: 1, // 激活
            };
          }
          case giftCardStatus.INACTIVATION: {
            return {
              ownerStatus: 0, // 自用
              cardStatus: 0, // 未激活
            };
          }
        }
        return {};
      },
    },
    methods: {
      async fetchData({ pagination: { pageSize, currentPage: pageNo } }) {
        const { data, totalCount } = await api.getMemberGiftCardList({
          ...this.selectedStatus,
          userId: this.info.id,
          appId: this.appId,
          pageSize,
          pageNo,
        });

        return {
          list: data || [],
          total: totalCount,
        };
      },
      onSearch() {
        this.$refs.table?.search();
      },
      onReset() {
        this.filterStatus = this.appId = '';
        this.onSearch();
      },
    },
  };
</script>
