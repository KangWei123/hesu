<template>
  <div class="graph">
    <div class="Add-Manage-Button">
      <el-button @click="showClassDialog">管理文章分类</el-button>
      <el-button @click="dialogVisible = true" type="primary" icon="el-icon-plus">从素材中心新增</el-button>
    </div>
    <div class="courtesy-filter">
      <el-form inline class="wkt-opt-label-container" :model="keyword" ref="keyword">
        <el-form-item label="图文：" prop="name">
          <el-input
            placeholder="搜索图文名称"
            v-model.trim="keyword.name"
            @input="handleStatus"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select clearable v-model="keyword.status" placeholder="选择文章状态" @change="handleStatus">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类：" prop="categoryId">
          <el-select clearable v-model="keyword.categoryId" placeholder="选择分类" @change="handleSearch">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button plain @click="handleReset">重置</el-button>
        </el-form-item>

      </el-form>

      
      <!-- <div class="courtesy-box"> -->
        
        <!-- <el-button style="float: right;" @click="onAdd" round type="primary" size="mini">新建营销图文</el-button> -->
      <!-- </div> -->
    </div>
    <div class="courtesy-list">
      <el-table :data="tableData" style="width: 100%" class="wkt-table" v-loading="loading">
        <el-table-column align="center" prop="pic" width="152" label="文章封面">
          <template slot-scope="scope">
            <div class="cover-url" :style="{ backgroundImage: `url(${scope.row.coverUrl})` }"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="文章标题" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="index" label="排序" />
        <el-table-column align="center" prop="categoryName" label="文章分类" />
        <el-table-column align="center" prop="viewsCount" label="阅读量" />
        <el-table-column align="center" prop="likeCount" label="点赞数" />
        <el-table-column align="center" prop="updateTime" label="更新时间" />
        <el-table-column align="center" prop label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">已下架</span>
            <span v-if="scope.row.status === 1">已上架</span>
            <span v-if="scope.row.status === 2">已删除</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="methods" label="操作" width="220" fixed="right">
          <div slot-scope="scope">
            <a v-if="scope.row.status === 0" @click="onShelve(scope.row)">上架</a>
            <a v-if="scope.row.status === 1" @click="offShelve(scope.row)">下架</a>
            <!-- <a v-if="scope.row.status===2" @click="onRecovery(scope.row)">恢复</a> -->
            <a @click="onDetail(scope.row)">详情</a>
            <!-- <a v-else @click="onEdit(scope.row)">编辑</a> -->
            <a @click="onComment(scope.row)">评论</a>
            <a class="table-del-a" v-if="scope.row.deleteFlag === 'N'" @click="onDelete(scope.row)">删除</a>
          </div>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination> -->

      <el-pagination
          v-if="totalCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="page.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalCount">
        </el-pagination>
    </div>

    <classify title="文章分类管理" ref="classify"></classify>
    <!-- v-if 关闭即销毁 -->
    <add-dialog v-if="dialogVisible" :visible.sync="dialogVisible" @on-success="handleAddSuccess" />
  </div>
</template>
<script>
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
import classify from './classify.vue';
import AddDialog from './add-dialog';
import { mapState } from 'vuex';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

export default {
  mixins: [AdapterIfr.AdapterMixins],
  components: {
    classify,
    AddDialog
  },
  data() {
    return {
      dialogVisible: false,
      keyword: {
        name: null,
        status: null,
        categoryId: null
      },
      tableData: [],
      options: [
        {
          value: 0,
          label: '已下架'
        },
        {
          value: 1,
          label: '已上架'
        },
        {
          value: 2,
          label: '已删除'
        }
      ],
      categoryList: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      delItem: {},
      deleteFlag: 'N',
      loading: false
    };
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      this.dialogVisible = newVal;
      this.adapterIfmMask(newVal);
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  methods: {
    handleAddSuccess() {
      this.page.pageNo = 1;
      this.getList();
    },
    getList() {
      let params = {
        title: this.keyword.name,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        deleteFlag: this.deleteFlag,
        ...this.keyword
      };
      this.loading = true;
      marketArticleApi
        .list(params)
        .then(res => {
          if (res.data && res.data.length) {
            this.tableData = res.data || [];
            if (this.tableData && this.tableData.length) {
              this.totalCount = res.totalCount;
            }
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }

          console.log('营销列表', this.tableData);
        })
        .catch(err => {
          this.tableData = [];
          this.totalCount = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getCategory() {
      marketArticleApi
        .categoryList({
          pageNo: 1,
          pageSize: 1000,
          deleteFlag: 'N'
        })
        .then(res => {
          this.categoryList = res.data || [];
        });
    },
    onAdd() {
      this.$router.push('/marketing/marketing-graph/list/add');
    },
    onShelve(row) {
      marketArticleApi
        .onshelve({
          id: row.id
        })
        .then(res => {
          this.$message({
            type: 'success',
            message: '上架成功！'
          });
          this.getList(); //重新请求列表
        });
    },
    offShelve(row) {
      marketArticleApi
        .offshelve({
          id: row.id
        })
        .then(res => {
          this.$message({
            type: 'success',
            message: '下架成功！'
          });
          this.getList(); //重新请求列表
        });
    },
    onComment(row) {
      this.$router.push({
        name: 'marketing-graph-comment',
        params: {
          id: row.id,
          title: row.title
        }
      });
    },
    //详情(只读)
    onDetail(row) {
      if (row.relatedMaterialArticleId) {
        let url = window.location.origin + '/preview.html?id=' + row.relatedMaterialArticleId + '&mass=1';
        window.open(url);
      } else {
        this.$router.push({
          path: '/marketing/marketing-graph/list/add',
          query: {
            id: row.id,
            writable: false
          }
        });
      }
    },
    onEdit(row) {
      //跳转详情编辑
      this.$router.push({
        path: '/marketing/marketing-graph/list/add',
        query: {
          id: row.id,
          writable: true
        }
      });
    },
    handleDelete() {
      let params = {
        id: this.delItem.id
      };
      marketArticleApi
        .delete(params)
        .then(res => {
          console.log('删除', res);
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList(); //重新请求列表
        })
        .catch(err => {
          console.error('删除err', err);
        });
    },
    onDelete(row) {
      this.delItem = row;
      this.$confirm('确定删除这篇文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDelete();
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    handleSearch() {
      this.page.pageNo = 1;
      this.getList();
    },
    handleStatus(e) {
      if (e === 2) {
        this.deleteFlag = 'Y';
      } else {
        this.deleteFlag = 'N';
      }
      this.page.pageNo = 1;
      this.getList();
    },
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getList();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.getList();
    },
    showClassDialog() {
      this.$refs.classify.show();
    },
    handleReset() {
      this.$refs.keyword.resetFields();
      this.handleSearch();
    }
  },
  mounted() {
    this.getList();
    this.getCategory();
  }
};
</script>
<style lang="less">
// .has-gutter {
//   th:nth-last-child(2) .cell {
//     text-align: right;
//   }
// }
.graph {
  // padding: 0 20px;
  .wkt-opt-label-container {
    box-shadow: none;
  }
  .title {
    height: 50px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 50px;
  }
  .courtesy-list {
    // padding: 20px 0;
    background: white;
    border-radius: 4px;
    margin-top: 16px;
    .el-table {
      padding-top: 0px;
    }
    // thead {
    //   th:last-child > .cell {
    //     text-align: right;
    //   }
    // }
  }

  .courtesy-filter {
    position: relative;
    padding: 0px 20px;
    background: #fff;
    padding-top: 5px;
    .el-form-item {
      margin-bottom: 15px;
    }

    .el-input__inner {
      border-radius: 4px 0 0 4px;
    }

    // .courtesy-box {
    //   position: absolute;
    //   top: 30px;
    //   right: 20px;
    // }
  }
  .el-table .cell {
    text-align: left;
  }
  .el-table .disabled-qrcode {
    color: #ccc;
    cursor: no-drop;
  }

  .el-table .disabled-qrcode:hover {
    color: #ccc;
    cursor: no-drop;
  }
.cover-url {
  width: 152px;
  height: 84px;
  background-size: contain;
  background-repeat: no-repeat;
}
.delete {
  display: none;
}
.content-title {
  border-bottom: none !important;
}
}

</style>
