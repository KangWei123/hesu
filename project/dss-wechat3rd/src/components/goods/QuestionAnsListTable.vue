<template>
  <div>
    <div class="Add-Manage-Button">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!edititem"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button class="manage-btn" type="primary" slot="reference" plain>管理分类</el-button>
      </el-popover>
      <el-button class="manage-list" v-else type="primary" @click="manageClassify" plain>管理分类</el-button>
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!edititem"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button icon="el-icon-plus" type="primary" slot="reference">新增模板</el-button>
      </el-popover>
      <el-button
        v-else
        icon="el-icon-plus"
        type="primary"
        @click="$router.push('/retail/goods-mgr/product/question-answer/add-template')"
        class="add-btn"
        >新增模板</el-button
      >
    </div>
    <div class="top-filter-box">
      <span style="display: flex">
        <span style="line-height: 36px">模板名称：</span>
        <search-input
          v-model="keyword"
          placeholder="请输入模板名称搜索"
          clearable
          @search="onSearch"
          style="width: 220px； margin-left: 20px;"
        />
      </span>
      <span style="display: flex">
        <span style="line-height: 36px; margin-left: 15px">模板分类：</span>
        <el-select
          :loading="loading.temp"
          placeholder="请选择模板分类"
          clearable
          style="margin-left: 20px"
          v-model="templateId"
          @change="onChangeTemplate"
        >
          <el-option
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
            v-for="item in templateList"
          ></el-option>
        </el-select>
      </span>
    </div>
    <div class="template-list">
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
            <el-popover
              placement="top-start"
              width="200"
              v-if="!edititem"
              trigger="hover"
              :content="scopeMenuEnum.disabledBtnTip"
            >
              <a href="javascript:void(0);" slot="reference">编辑</a>
            </el-popover>
            <a
              href="javascript:;"
              v-else
              @click="$router.push(`/retail/goods-mgr/product/question-answer/add-template?id=${scope.row.id}`)"
              >编辑</a
            >
            <el-popover
              placement="top-start"
              width="200"
              v-if="!edititem"
              trigger="hover"
              :content="scopeMenuEnum.disabledBtnTip"
            >
              <a class="table-delete" href="javascript:void(0);" slot="reference">删除</a>
            </el-popover>
            <a class="table-delete" href="javascript:;" v-else @click="handleRemove(scope.row)">删除</a>
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
        :total="page.totalCount"
      >
      </el-pagination>
    </div>
    <category-dialog v-model="showCategoryDialog" />
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import SearchInput from '@/dss-wechat3rd/src/components/search-input';
  import api from '@/dss-wechat3rd/src/api/template.js';
  import CategoryDialog from '@/dss-wechat3rd/src/components/goods/CategoryDialog.vue';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  const TABLE_COLS_ENUM = {
    templateName: '问答模板',
    categoryName: '模板分类',
    createTime: '创建时间',
    updateTime: '更新时间',
  };

  export default {
    name: 'ParameterList',
    components: {
      SearchInput,
      CategoryDialog,
    },
    computed: {
      ...mapState({
        env: 'env',
        roleList: 'roleList',
        wkbScopeMenu: 'wkbScopeMenu',
      }),
    },
    data() {
      return {
        scopeMenuEnum,
        page: {
          pageNo: 1,
          pageSize: 10,
        },
        showCategoryDialog: false,
        TABLE_COLS_ENUM,
        keyword: '',
        templateId: '',
        templateList: [],
        loading: {
          temp: false,
          list: false,
        },
        tableData: [],

        // 按钮接口返回的权限
        lookitem: false, // 查看
        edititem: false, // 编辑
      };
    },
    props: {
      goodsType: {
        type: Object,
        default: null,
      },
    },
    watch: {
      wkbScopeMenu: {
        immediate: true,
        handler() {
          if (this.wkbScopeMenu) {
            this.assembleOrderMgrMenu();
          }
        },
      },
    },
    mounted() {
      this.getTemCategoryList();
      this.fetchData();
    },
    methods: {
      assembleOrderMgrMenu() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goodsListButton.goods_list_answer_template
        );
        scopeMenu.childMenu &&
          scopeMenu.childMenu.forEach(item => {
            if (item.identifier == 'goods_list_answer_template_detail' && item.isHasPermission == 1) {
              this.lookitem = true;
            }
            if (item.identifier == 'goods_list_answer_template_edit' && item.isHasPermission == 1) {
              this.edititem = true;
            }
          });
      },
      fetchData() {
        this.loading.list = true;
        api
          .getAskTemplateList({
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            templateName: this.keyword,
            categoryId: this.templateId,
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
      getTemCategoryList() {
        this.loading.temp = true;
        const params = {
          pageNo: 0,
          pageSize: 0,
        };
        api
          .queryTemCategoryList(params)
          .then(res => {
            this.templateList = res.data || [];
          })
          .catch(res => {
            this.$message.error(res.errorMessage);
          })
          .finally(_ => {
            this.loading.temp = false;
          });
      },
      manageClassify() {
        this.showCategoryDialog = true;
      },
      handleRemove(row) {
        this.$confirm('删除模板后，商品无法再使用该问答参数，已使用该模板的商品不受影响。', '删除模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          console.log('删除成功');
          api
            .delQaTemplate({ id: row.id })
            .then(() => {
              this.$message({ message: '删除成功', type: 'success' });
            })
            .finally(() => {
              if (this.tableData.length <= 1 && this.page.pageNo > 1) {
                this.page.pageNo = this.page.pageNo - 1;
              }
              this.fetchData();
            });
        });
      },
      onChangeTemplate() {
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
      },
    },
  };
</script>
<style lang="less" scoped>
  .top-filter-box {
    background: #fff;
    padding: 30px 20px;
    display: flex;
  }
  .template-list {
    margin-top: 16px;
    background: #fff;
  }
  .btn-box {
    margin-left: auto;
    .manage-list {
      margin-right: 20px;
      color: #266fff;
      line-height: 30px;
    }
  }
</style>
