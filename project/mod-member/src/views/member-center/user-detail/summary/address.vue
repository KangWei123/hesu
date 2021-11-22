<template>
  <div class="address">
    <div class="address__header">
      <div class="title">地址信息</div>
      <el-button type="primary" @click="handleAdd">+ 添加地址</el-button>
    </div>
    <fat-table ref="table" :fetch-handler="handleFetch" :remove-handler="handleRemove" row-key="id" hide-on-single-page>
      <el-table-column label="序号" v-slot="scope">{{ scope.$index + 1 }}</el-table-column>
      <el-table-column label="地址" v-slot="{ row: { province, city, district, address, roomNumber } }">
        {{ province }}{{ city }}{{ district }}{{ address }}{{ roomNumber || '' }}
      </el-table-column>
      <el-table-column label="手机" prop="phone"></el-table-column>
      <el-table-column label="地址类型" v-slot="{ row }">{{ AddressTypeName[row.addressType] }}</el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" v-slot="{ row }">
        <table-actions
          v-if="[AddressType.Home, AddressType.Office].includes(row.addressType)"
          :options="tableActions(row)"
        />
      </el-table-column>
    </fat-table>
    <address-edit-dialog ref="edit" />
  </div>
</template>

<script>
  import { FatTable, TableActions } from '@/dss-common/components/list-page';
  import { AddressType, AddressTypeName } from '@/mod-member/src/enum/index';
  import api from '@/mod-member/src/api/memberAPI';
  import AddressEditDialog from './address-edit-dialog';

  export default {
    name: 'Address',
    props: {
      info: {
        type: Object,
        required: true,
      },
    },
    components: {
      FatTable,
      TableActions,
      AddressEditDialog,
    },
    data() {
      return {
        AddressType,
        AddressTypeName,
      };
    },
    methods: {
      tableActions(row) {
        return [
          {
            name: '编辑',
            onClick: () => {
              const { id, address, addressType, province, city, district } = row;
              this.$refs.edit.show({
                form: {
                  id: id,
                  type: addressType,
                  address,
                  area: [province, city, district].filter(Boolean),
                },
                onConfirm: async params => {
                  await api.memberCenter.updateAddress(this.transformParams(params));
                  this.$refs.table.search();
                },
              });
            },
          },
          {
            name: '删除',
            type: 'danger',
            onClick: () => {
              this.$refs.table.remove(row.id);
            },
          },
        ];
      },
      async handleFetch() {
        const { data } = await api.memberCenter.getAddress({ uniqueAccountId: this.info.uniqueAccountId });
        return {
          list: data,
          total: data.length,
        };
      },
      async handleAdd() {
        this.$refs.edit.show({
          onConfirm: async params => {
            await api.memberCenter.addAddress(this.transformParams(params));
            this.$refs.table.search();
          },
        });
      },
      transformParams(params) {
        const { type: addressType, area, ...other } = params;
        const [province, city, district] = area;
        return {
          uniqueAccountId: this.info.uniqueAccountId,
          province,
          city,
          district,
          ...other,
          addressType,
        };
      },
      async handleRemove(ids) {
        await api.memberCenter.removeAddress({ id: ids[0] });
      },
    },
  };
</script>

<style scoped lang="less">
  .address {
    border-top: 1px solid #dce1e6;
    margin-top: 60px;
    padding-top: 50px;
  }

  .address__header {
    padding: 0 16px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eff4fa;
  }

  .title {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    height: 26px;
    line-height: 26px;
    color: #303133;
  }
</style>
