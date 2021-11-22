<template>
  <el-dialog title="选择项目" :visible.sync="dialogVisible" :close-on-click-modal="false" center>
    <div class="condition">
      <el-form inline size="mini" @submit.native.prevent="search">
        <el-form-item label="项目名称"><el-input v-model="query.prjName"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
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
        <el-table-column label="项目名称" prop="prjName"> </el-table-column>
        <el-table-column label="地址" prop="address"> </el-table-column>
        <el-table-column label="开业时间" prop="openDay"></el-table-column>
        <el-table-column v-slot="scope" label="项目均价">
          {{ `${scope.row.lessPrice}-${scope.row.maxPrice}` }} /床/元/月
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
  import { projectApi } from '@/register/kangyang';

  export default {
    name: 'KyProjectPicker',
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
        selected: [],
        query: {
          name: '',
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
        const { data, totalCount } = await projectApi.queryList(payload);

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
