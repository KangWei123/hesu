<template>
  <el-dialog title="添加活动" :visible.sync="dialogVisible" :close-on-click-modal="false" center>
    <div class="condition">
      <el-form inline size="mini" @submit.native.prevent="search">
        <el-form-item label="活动名称"><el-input v-model="query.name"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <fat-table
        ref="table"
        :fetch-handler="handleFetch"
        selectable
        :selected.sync="selected"
        row-key="id"
        :fetch-on-mounted="false"
      >
        <el-table-column v-slot="{ row }" label="活动封面">
          <img :src="row.coverImg" style="max-width: 97px" />
        </el-table-column>
        <el-table-column label="活动名称" prop="name"> </el-table-column>
        <el-table-column label="活动编号" prop="code"> </el-table-column>
        <el-table-column v-slot="{ row }" label="活动状态">
          {{ row.activityStatus === ActivityStatus.Pending ? '未开始' : '进行中' }}
        </el-table-column>
      </fat-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import { activityApi } from '@/register/kangyang';
  import { ActivityStatus } from '@/dss-wechat3rd/src/constants/kangyangEnum';

  export default {
    name: 'KyActivityPicker',
    components: {
      FatTable,
    },
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dialogVisible: false,
        ActivityStatus,
        selected: [],
        query: {
          name: '',
          activityNo: '',
        },
      };
    },
    watch: {
      dialogVisible(show) {
        if (show) {
          // 初始化
          if (this.$refs.table) {
            this.$refs.table.reset();
          }
          this.query.name = '';
          this.query.activityNo = '';

          this.$nextTick(() => {
            this.search();
            this.selected = this.value;
          });
        }
      },
    },
    methods: {
      show() {
        this.dialogVisible = true;
      },
      async handleFetch(params) {
        const payload = {
          ...this.query,
          pageNo: params.pagination.currentPage,
          pageSize: params.pagination.pageSize,
        };
        const { data, totalCount } = await activityApi.queryList(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
      search() {
        this.$refs.table.search();
      },
      handleConfirm() {
        this.dialogVisible = false;
        this.$emit('input', this.selected);
      },
    },
  };
</script>

<style scoped></style>
