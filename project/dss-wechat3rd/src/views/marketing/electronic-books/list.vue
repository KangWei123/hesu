<template>
  <div class="graph marketing-page">
    <div class="Add-Manage-Button">
      <el-button @click="showManageCategoryDialog = true" :disabled="loading.category">管理分类</el-button>
      <el-button @click="addMaterialDialog = true" class="flex-right" type="primary">从素材中心新增</el-button>
    </div>
    <div class="top-filter-box wkt-opt-label-container">
      <search-input v-model="keyword" placeholder="请输入名称搜索"  clearable @search="onSearch" style="width: 200px"/>
      <el-select
        :loading="loading.satus"
        placeholder="请选择画册状态"
        clearable
        style="margin-left: 20px;"
        v-model="statusId"
        @change="onChangeStatus">
          <el-option :key="item.id" :label="item.label" :value="item.id" v-for="item in statusList"></el-option>
      </el-select>
      <el-select
        :loading="loading.category"
        placeholder="选择分类"
        clearable
        style="margin-left: 20px;"
        v-model="categoryId"
        @change="onChangeCategory">
          <el-option :key="item.id" :label="item.categoryName" :value="item.id" v-for="item in categoryList"></el-option>
      </el-select>
    </div>
    <div class="books-list">
    <el-table :data="tableData" v-loading='loading.list'>
      <el-table-column prop="coverUrl" label="画册封面">
        <template slot-scope="scope">
          <div class="cover-url" :style="{ backgroundImage: `url(${scope.row.coverUrl})` }"></div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="画册标题"></el-table-column>
      <el-table-column prop="categoryName" label="分类"></el-table-column>
      <el-table-column prop="albumSort" label="排序"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column prop="shareCount" label="分享数"></el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template slot-scope="scope">
          <div class="goods-shlef">
            <el-switch v-model="scope.row.albumStatus"
                       :active-value="1"
                       :inactive-value="0"
                       active-text="上架"
                       inactive-text="下架"
                       active-color="#52C41A"
                       inactive-color="#B1B5BD"
                       @change="onToggleSwitch(scope.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="操作" prop="id">
        <template slot-scope="scope">
          <a :href="scope.row.pdfUrl" :download="scope.row.title">下载</a>
          <a class="table-delete" :disable="loading.delete" @click="onDelete(scope.row)" type="text">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      :current-page.sync="page.pageNo"
      hide-on-single-page
      :page-size.sync="page.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      :total="page.totalCount"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      layout="prev, pager, next, jumper, sizes, total"
    ></el-pagination>
    </div>
    <manage-category-dialog v-model="showManageCategoryDialog" />
    <add-dialog v-if="addMaterialDialog" :visible.sync="addMaterialDialog" @on-success="handleAddSuccess" />
  </div>

</template>
<script>
import api from '@/dss-wechat3rd/src/api/material-pdf';
import services from '@/dss-common/utils/services';
import SearchInput from '@/dss-wechat3rd/src/components/search-input';
import manageCategoryDialog from './components/manage-category-dialog';
import addDialog from './components/add-dialog.vue';
export default {
  components: {
    SearchInput,
    addDialog,
    manageCategoryDialog
  },
  data() {
    return {
      categoryList: [],
      categoryId: '',
      statusList: [
        { label: '已上架', id: 1 },
        { label: '已下架', id: 0 }
      ],
      statusId: '',
      loading: {
        list: false,
        category: false,
        update: false,
        delete: false
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        totalCount: null
      },
      tableData: [],
      updateMsg: '',
      keyword: '',
      addMaterialDialog: false,
      showManageCategoryDialog: false
    };
  },
  methods: {
    fetchData() {
      this.loading.list = true;
      api
        .getEbooksList({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          categoryId: this.categoryId,
          title: this.keyword,
          albumStatus: this.statusId
        })
        .then(res => {
          this.tableData = res.data || [];
          this.page.totalCount = res.totalCount || 0;
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading.list = false;
        });
    },
    getCategoryList() {
      this.loading.category = true;
      let params = {
        pageNo: 1,
        pageSize: 100
      };
      api
        .getEbooksGroupList(params)
        .then(res => {
          this.categoryList = res.data || [];
        })
        .catch(e => {
          this.$message.error(e.errorMessage);
        })
        .finally(() => {
          this.loading.category = false;
        });
    },
    onToggleSwitch(row) {
      row.albumStatus = !row.albumStatus;
      this.setShelf(row);
    },
    setShelf(row) {
      let title = '上架提醒';
      let msg = '确认上架该画册？';
      let successMsg = '上架成功';
      let loadingMsg = '请稍候，正在上架中...';
      let url = api.onShelveUrl.url;
      if (row.albumStatus == 1) {
        title = '下架提醒';
        msg = '确定要下架吗？';
        successMsg = '下架成功';
        loadingMsg = '请稍候，正在下架中...';
        url = api.offShelveUrl.url;
      }
      this.$confirm(msg, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.updateMsg = loadingMsg;
          this.loading.update = true;
          services
            .post(url, { id: row.id })
            .done(res => {
              this.$message({
                message: successMsg,
                type: 'success'
              });
              this.fetchData();
            })
            .always(res => {
              this.loading.update = false;
            });
        })
        .catch(() => {
          console.log('取消');
        });
    },
    onDelete(row) {
      // this.loading.delete = true;
      this.$confirm('确认删除该画册吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'tips-warning',
        center: true
      })
        .then(() => {
          api
            .deleteEbooksById({ id: row.id })
            .then(res => {
              this.$message.success('删除成功');
            })
            .catch(res => {
              this.$message.error(res.errorMessage);
            })
            .finally(_ => {
              this.loading.delete = true;
              this.fetchData();
            });
        })
        .catch(() => {
          this.loading.delete = false;
        });
    },
    handleDownLoad() {},
    handleAddSuccess() {
      this.page.pageNo = 1;
      this.fetchData();
    },
    onSearch() {
      this.page.pageNo = 1;
      this.fetchData();
    },
    onChangeStatus() {
      this.page.pageNo = 1;
      this.fetchData();
    },
    onChangeCategory() {
      this.page.pageNo = 1;
      this.fetchData();
    },
    onPageChange() {
      this.fetchData();
    },
    onSizeChange() {
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
    this.getCategoryList();
  }
};
</script>
<style lang='less' scoped>
.el-button + .el-button.flex-right {
  margin-left: 16px;
}
.top-filter-box{
  .bg-mixin;
  display: flex;
  border-radius: 0px 0px 4px 4px;
  margin-bottom: 16px;
  padding: 6px 20px 16px;
}
.books-list {
  .bg-mixin;
  border-radius: 4px;
  padding-bottom: 20px;
}
</style>
