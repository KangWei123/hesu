<template>
  <div class="qrcode-wrap">
    <!-- <div class="Add-Manage-Button">
      <el-button type="primary" class="add-btn" @click="onAdd">新增二维码</el-button>
    </div> -->
    <!-- toolbar -->
    <div class="toolbar">
      <search-input v-model="keyword.qrName" placeholder="请输入内容" clearable @search="onSearch" />
      <!-- <el-select v-model="keyword.status" placeholder="请选择" @change="onSearch">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
      <el-button type="primary" class="add-btn" @click="onAdd">新增二维码</el-button>
    </div>
    <div class="qrcode-list">
      <el-table class="qrcode-table" :data="tableData" v-loading="loading.list || loading.delete">
        <el-table-column label="二维码名称" width="300px" prop="qrName" />

        <el-table-column label="页面路径" prop="fullPath"> </el-table-column>
        <el-table-column label="创建时间" width="300px" prop="createTime" :formatter="timeFormatter" />
        <el-table-column label="操作" prop="id" align="center">
          <div slot-scope="scope" style="text-align: center">
            <div v-if="scope.row.status === 1">
              <el-button @click="onEditor(scope.row)" class="operation-button" type="text">编辑</el-button>
              <el-button @click="onDownload(scope.row)" class="operation-button" type="text">下载</el-button>
              <el-button @click="onCheckQrcode(scope.row)" class="operation-button" type="text">查看</el-button>
              <el-button @click="onDelete(scope.row)" class="table-delete" type="text">删除</el-button>
            </div>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="page.totalCount"
        :page-size.sync="page.pageSize"
        :current-page.sync="page.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
    <EditDialog ref="editDialog" />
    <Download :download-list="downloadList" ref="download" />
    <CheckQrcode ref="checkQrcodeDialog" @dowload="onDownload"></CheckQrcode>
  </div>
</template>

<script>
  import api from '@/dss-wechat3rd/src/api/qrCode.js';
  import EditDialog from './edit-dialog';
  import Download from './download';
  import dateUtils from '@/dss-common/utils/date.js';
  import SearchInput from './search-input';
  import CheckQrcode from './checkQrcode';

  export default {
    components: { EditDialog, Download, SearchInput, CheckQrcode },
    data() {
      return {
        downloadList: [],
        tableData: [],
        page: { totalCount: 0, pageSize: 10, pageNo: 1 },
        keyword: { qrName: '' },
        loading: { list: false, status: false, delete: false },
        statusList: [
          { value: null, label: '全部状态' },
          { value: 1, label: '生效中' },
          { value: 0, label: '已失效' },
        ],
        currentStatus: null,
        options: [
          {
            value: '',
            label: '全部状态',
          },
          {
            value: 1,
            label: '生效中',
          },
          {
            value: 0,
            label: '已失效',
          },
        ],
      };
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fetchData(); // 获取小程序二维码列表
      });
    },
    mounted() {},
    methods: {
      /**
       * 获取小程序二维码列表
       */
      async fetchData() {
        this.loading.list = true;
        try {
          const res = await api.list({
            qrType: 'mini', // 小程序二维码
            status: 1,
            ...this.page,
            ...this.keyword,
            ...(typeof this.currentStatus === 'number' ? { status: this.currentStatus } : {}),
          });

          this.tableData = res.data.map(item => {
            const miniprogramInfo = JSON.parse(item.miniProgramInfo);
            if (miniprogramInfo.pathInfo) {
              const { miniprogramUrl, pathInfo } = miniprogramInfo;
              const fullPath = miniprogramUrl + (miniprogramUrl.indexOf('?') === -1 ? '?' : '&') + pathInfo;

              item.fullPath = fullPath;
            } else {
              item.fullPath = miniprogramInfo.miniprogramUrl;
            }
            return item;
          });

          // mock数据
          // this.tableData = [
          //   {
          //     qrName: '二维码名称',
          //     fullPath: 'fullpath',
          //     createTime: 1624332399,
          //     id: '12',
          //     status: 1,
          //     url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erb4w6RFD0iaMGibjyK5mfDMb2huZEqIvTVbMzb8mMkv5Ur9FKxhygHwicZyH9UpNxic193YMeDy58lVw/132'
          //   }
          // ]
          this.page.totalCount = res.totalCount;
        } catch (e) {
          // ignore
          console.error(e);
        } finally {
          this.loading.list = false;
        }
      },

      changeStatus() {
        this.fetchData();
      },

      onSearch() {
        this.fetchData();
      },

      onSizeChange(pageSize) {
        this.page.pageSize = pageSize;
        this.fetchData();
      },

      onPageChange(pageNo) {
        this.page.pageNo = pageNo;
        this.fetchData();
      },

      timeFormatter(row, column, cellValue, index) {
        return dateUtils.format(new Date(cellValue * 1000));
      },

      onAdd() {
        this.$router.push('/marketing/minapp-qrcode/add');
      },

      onEditor(e) {
        this.$refs.editDialog.show(e);
      },

      // 查看
      async onCheckQrcode(row) {
        try {
          const res = await api.single({ id: row.id });
          row.curDetailPath = JSON.parse(res.data.qrSceneStr)[0].qrCodeUrl;
          console.log('data', res);
          this.$refs.checkQrcodeDialog.show(row);
        } catch (e) {
          // ignore
          console.error(e);
        }
      },

      async onDelete(row) {
        try {
          await this.$confirm('该操作无法撤销，确定删除该二维码吗？', '提示', { type: 'warning' });

          this.loading.list = true;
          await api.delete({ id: row.id });
          await this.fetchData();
        } finally {
          this.loading.list = false;
        }
      },

      onDownload(e) {
        console.log('onDownload-start', e);
        e.qrCodeUrl = e.qrSceneStr && JSON.parse(e.qrSceneStr);

        const list = [];
        if (e.qrCodeUrl && e.qrCodeUrl.length) {
          e.qrCodeUrl.forEach((item, index) => {
            const width = item.qrCodeSize && item.qrCodeSize.replace(/二维码尺寸/g, '');

            list.push({ width, qrCodeUrl: item.qrCodeUrl, qrName: e.qrName });
          });
        } else if (e.qrCodeUrl) {
          list.push({ width: '7cm', qrCodeUrl: e.qrCodeUrl.qrCodeUrl, qrName: e.qrName });
        }
        this.downloadList = list;
        this.$refs.download && this.$refs.download.show(e);
      },
    },
  };
</script>

<style lang="less" scoped>
  .page-header {
    width: 100%;
    height: 50px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #333;
  }

  .qrcode-wrap {
    // padding: 18px 20px;
  }

  .add-btn {
    margin-left: auto;
  }

  .toolbar {
    .bg-mixin;

    border-radius: 0 0 4px 4px;
    padding: 16px 20px;
    margin-bottom: 16px;
    display: flex;
  }

  .qrcode-list {
    .bg-mixin;

    padding-bottom: 20px;
    border-radius: 4px;
  }

  .qrcode-table {
    border-radius: 4px 4px 0 0;

    .operation-button {
      color: #1890ff;
    }
  }
</style>
