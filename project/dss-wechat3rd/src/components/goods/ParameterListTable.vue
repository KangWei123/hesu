<template>
  <div>
    <div class="Add-Manage-Button">
      <el-popover placement="top-start"
                  width="200"
                  trigger="hover"
                  v-if="!edititem"
                  :content="scopeMenuEnum.disabledBtnTip">
        <el-button icon="el-icon-plus" type="primary" slot="reference">新增模板</el-button>
      </el-popover>
      <el-button v-else
                 type="primary"
                 icon="el-icon-plus"
                 class="add-btn"
                 @click="$router.push('/retail/goods-mgr/product/parameter/add-template')">新增模板</el-button>
    </div>
    <div class="top-filter-box">
      <span style="display: flex;">
        <span style="line-height: 36px; ">模板名称：</span>
        <search-input
          v-model="keyword"
          placeholder="请输入模板名称搜索"
          clearable
          @search="onSearch"
          style="width: 280px"
        />
      </span>
      

      <span style="display: flex;">
        <span style="line-height: 36px; margin-left:15px;">可用分类：</span>
        <el-select
          :loading="loading.cate"
          placeholder="请选择可用分类"
          clearable
          style="margin-left: 20px;"
          v-model="categoryId"
          @change="onChangeCategory">
            <el-option :key="item.id" :label="item.category" :value="item.id" v-for="item in categoryList"></el-option>
        </el-select>
      </span>
    </div>
    <div class="parameter-list">
      <el-table :data="tableData" style="width: 100%" v-loading="loading.list">
        <el-table-column
          v-for="(key, val) of TABLE_COLS_ENUM"
          :key="key"
          :prop="val"
          :label="key"
          align="left"
        ></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-popover placement="top-start"
                        width="200"
                        v-if="!edititem"
                        trigger="hover"
                        :content="scopeMenuEnum.disabledBtnTip">
              <a href="javascript:void(0);" slot="reference">编辑</a>
            </el-popover>
            <a href="javascript:;"
               v-else
               class="btn-operation"
               @click="$router.push(`/retail/goods-mgr/product/parameter/add-template?id=${scope.row.id}`)">编辑</a>
            <el-popover placement="top-start"
                        width="200"
                        v-if="!edititem"
                        trigger="hover"
                        :content="scopeMenuEnum.disabledBtnTip">
              <a class="table-delete" href="javascript:void(0);" slot="reference">删除</a>
            </el-popover>
            <a href="javascript:;"
               v-else
               class="table-delete"
               @click="handleRemove(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :current-page.sync="page.pageNo"
        :page-size.sync="page.pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        :total="page.totalCount"
        @current-change="onPageChange"
        @size-change="onSizeChange"
        layout="prev, pager, next, jumper, sizes, total"
      ></el-pagination> -->
      <el-pagination
          v-if="page.totalCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          layout="sizes, prev, pager, next"
          :total="page.totalCount">
        </el-pagination>
    </div>
  </div>
</template>
<script>
const TABLE_COLS_ENUM = {
  templateName: '参数模板',
  categoryStr: '可用分类',
  createTime: '创建时间',
  updateTime: '更新时间'
};
import { mapState } from 'vuex';
import SearchInput from '@/dss-wechat3rd/src/components/search-input';
import api from '@/dss-wechat3rd/src/api/template.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  name: 'ParameterList',
  components: {
    SearchInput
  },
  computed: {
    ...mapState({
      env: 'env',
      roleList: 'roleList',
      wkbScopeMenu: 'wkbScopeMenu'
    })
  },
  data() {
    return {
      scopeMenuEnum,
      page: {
        pageNo: 1,
        pageSize: 10
      },
      TABLE_COLS_ENUM,
      keyword: '',
      categoryId: '',
      categoryList: [],
      loading: {
        cate: false,
        list: false
      },
      tableData: [],

      // 按钮接口返回的权限
      lookitem: false, // 查看
      edititem: false // 编辑
    };
  },
  props: {
    goodsType: {
      type: Object,
      default: null
    }
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleOrderMgrMenu();
        }
      }
    }
  },
  mounted() {
    this.getCategoryList();
    this.fetchData();
  },
  methods: {
    assembleOrderMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goodsListButton.goods_list_paramter_template
      );
      scopeMenu.childMenu &&
        scopeMenu.childMenu.forEach(item => {
          if (item.identifier == 'goods_list_paramter_template_detail' && item.isHasPermission == 1) {
            this.lookitem = true;
          }
          if (item.identifier == 'template_edit' && item.isHasPermission == 1) {
            this.edititem = true;
          }
        });
    },
    fetchData() {
      this.tableData = [];
      this.loading.list = true;
      api
        .getParameterList({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          templateName: this.keyword,
          categoryId: this.categoryId
        })
        .then(res => {
          let data = res.data || [];
          data.forEach(item => {
            let list = [];
            item.categoryList.forEach(_item => {
              list.push(_item.categoryName);
            });
            item.categoryStr = list.join(',');
          });
          this.tableData = data;
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
      this.loading.cate = true;
      let params = {
        type: 1
      };
      api
        .queryCategoryList(params)
        .then(res => {
          this.categoryList = res.data || [];
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading.cate = false;
        });
    },
    handleRemove(row) {
      this.$confirm('删除模板后，商品无法再使用该模板参数，已使用该模板的商品不受影响。', '删除模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      }).then(() => {
        console.log('删除成功');
        api.delParameter({ id: row.id }).then(() => {
          this.$message({ message: '删除成功', type: 'success' });
          this.fetchData();
        });
      });
    },
    onChangeCategory() {
      if (this.lookitem) {
        this.page.pageNo = 1;
        this.fetchData();
      } else {
        this.$message.error('该角色暂无权限操作');
      }
    },
    onSearch() {
      if (this.lookitem) {
        this.page.pageNo = 1;
        this.fetchData();
      } else {
        this.$message.error('该角色暂无权限操作');
      }
    },
    onPageChange() {
      if (this.lookitem) {
        this.fetchData();
      } else {
        this.$message.error('该角色暂无权限操作');
      }
    },
    onSizeChange() {
      if (this.lookitem) {
        this.fetchData();
      } else {
        this.$message.error('该角色暂无权限操作');
      }
    }
  }
};
</script>
<style lang='less' scoped>
.top-filter-box{
  background: #fff;
  padding: 30px 20px;
  display: flex;
}
.parameter-list{
  margin-top: 16px;
  background: #fff;
}
.add-btn{
  margin-left: auto;
}
</style>

