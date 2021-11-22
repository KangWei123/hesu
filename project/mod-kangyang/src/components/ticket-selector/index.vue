<template>
  <el-dialog
    title="设置票种"
    custom-class="ticket-selector-dialog"
    :visible.sync="dialogVisible"
    width="847"
    :append-to-body="true"
    :before-close="dialogBeforeClose"
    :close-on-click-modal="false"
  >
    <list-page-layout>
      <template #sub-actions>
        <div class="actions">
          <el-button size="small" type="primary" @click="onClickAdd">+新增</el-button>
        </div>
      </template>

      <fat-table ref="ticketTable" :state.sync="form" :fetch-handler="handleFetch" row-key="id">
        <el-table-column prop="idx" align="center" label="序号"></el-table-column>
        <el-table-column prop="name" align="center" label="票种名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.status === 'up'" v-model="scope.row.name" placeholder="请输入"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" align="center" label="价格（元）">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.status === 'up'"
              type="number"
              v-model="scope.row.price"
              placeholder="请输入"
            ></el-input>
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limit" align="center" label="限购（件）">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.status === 'up'"
              type="number"
              v-model="scope.row.limitCount"
              placeholder="请输入"
            ></el-input>
            <span v-else>{{ scope.row.limitCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ticketCount" align="center" label="票数（件）">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.status === 'up'"
              type="number"
              v-model="scope.row.ticketCount"
              placeholder="请输入"
            ></el-input>
            <span v-else>{{ scope.row.ticketCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" align="center" label="余票（件）">
          <template slot-scope="scope">
            <span>{{ scope.row.usableStock || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-link
              :disabled="
                scope.row.id | isDisable(selectedActivity.isShelf, scope.row.ticketCount, scope.row.usableStock)
              "
              :type="true ? 'danger' : 'info'"
              :underline="false"
              @click="onClickDelete(scope.$index)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </fat-table>
    </list-page-layout>

    <div slot="footer">
      <el-button @click="cancel" :disabled="processing">取 消</el-button>
      <el-button type="primary" :disabled="processing" :loading="processing" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import { activityApi } from '@/mod-kangyang/src/api';
  import { addIdxToListItem } from '../../utils';

  export default {
    name: 'TicketSelector',
    components: {
      ListPageLayout,
      FatTable,
    },
    props: {
      selectedActivity: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        dialogVisible: true,
        form: {
          name: null,
          area: [],
        },
        myCode: this.selectedActivity.code,
        processing: false,
      };
    },
    computed: {
      code: function () {
        return this.selectedActivity.code;
      },
    },
    watch: {
      'selectedActivity.code': function () {
        setTimeout(() => {
          this.search();
        }, 600);
      },
    },
    filters: {
      isDisable: function (id, isShelf, total, usableStock) {
        return id > 0 && (isShelf || usableStock < total);
      },
    },
    methods: {
      open(code) {
        this.myCode = code;
      },
      search() {
        if (this.$refs.ticketTable) {
          this.$refs.ticketTable.search();
        }
      },
      onClickAdd() {
        const table = this.$refs.ticketTable;
        table.list.push({
          idx: table.list.length + 1,
          status: 'up',
        });
        table.pagination = Object.assign({}, table.list.pagination, { total: table.list.length });
      },
      onClickDelete(index) {
        const table = this.$refs.ticketTable;
        table.list.splice(index, 1);
        table.pagination = Object.assign({}, table.list.pagination, { total: table.list.length });
      },
      async handleFetch(params) {
        const { pagination } = params;
        const { currentPage: pageNo, pageSize } = pagination;
        const payload = {
          activityCode: this.myCode,
          pageNo: pageNo,
          pageSize: pageSize,
        };
        const { data, totalCount } = await activityApi.getTickets(payload);
        const list = (data || []).map(item => {
          return {
            ...item,
            price: (item.price / 100).toFixed(2),
            _id: item.id,
          };
        });

        return {
          list: addIdxToListItem(list, pageNo, pageSize),
          total: totalCount,
        };
      },
      confirm() {
        this.save();
      },
      cancel() {
        this.$emit('cancel');
      },
      dialogBeforeClose() {
        this.cancel();
      },
      async save() {
        const table = this.$refs.ticketTable;
        const list = table.list.map(item => {
          return {
            id: item.id,
            name: item.name,
            price: +item.price * 100,
            limitCount: +item.limitCount,
            ticketCount: +item.ticketCount,
          };
        });

        const payload = {
          code: this.myCode,
          ticketDTOList: list,
        };
        this.processing = true;
        try {
          await activityApi.saveTicket(payload);
          table.list = table.list.map(item => {
            return {
              id: item.id || item._id,
              ...item,
              status: '',
            };
          });
          this.$message.success('保存成功');
          setTimeout(() => {
            this.$emit('confirm');
          }, 2000);
        } finally {
          this.processing = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .ticket-selector-dialog .el-dialog__body {
    padding: 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    padding: 0 24px;
  }
</style>
