<template>
  <div  element-loading-spinner="el-icon-loading" class="label-list">
     <div class="Add-Manage-Button">
        <el-button type="primary" plain @click="manageLabel">管理标签</el-button>
        <el-button type="primary" @click="editLabelPopup()" icon="el-icon-plus">增加标签</el-button>
     </div>

    <el-breadcrumb separator="/" class="wkt-breadcrumb-container" style="background:#fff;">
      <el-breadcrumb-item :to="{ path: breadPath }" replace>{{ breadLabel }}</el-breadcrumb-item>
      <el-breadcrumb-item>管理标签</el-breadcrumb-item>
    </el-breadcrumb>


    <div class="manage-btn-box">
      <span class="label">标签名称：</span>
      <search-input
        v-model="keyword"
        placeholder="请输入标签名称"
        clearable
        @search="onSearch"
        style="width: 220px； height:36px; lin-height:36px;"
      />
      <span class="label category">标签分类：</span>
      <el-select
        :loading="loading.label"
        placeholder="请选择标签分类"
        clearable
        v-model="labelTypeId"
        @change="onChangeLabel">
        <el-option :key="item.id" :label="item.categoryName" :value="item.id" v-for="item in labelClassify"></el-option>
      </el-select>

      <div class="reset">
        <el-button plain @click="reset">重置</el-button>
      </div>

    </div>



    <!-- 标签列表 -->
    <div class="label-table" v-loading="loading.list">
      <el-table :data="labelList" stripe class="wkt-table">
        <el-table-column prop="label" label="标签名"> </el-table-column>
        <el-table-column prop="categoryName" label="标签分类">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName ? scope.row.categoryName: '- -' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="135px">
          <template slot-scope="scope">
            <a href="javascript:;" @click="editLabelPopup(scope.row)" >编辑</a>
            <a class="table-delete" href="javascript:;" @click="isDelete(scope.row.id)" >删除</a>
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 分页功能 -->
      <div style="text-align: center">
        <!-- <el-pagination
          v-if="totalCount"
          layout="prev, pager, next, jumper, sizes, total"
          :total="totalCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          class="wkt-pagination"
          :hide-on-single-page="true"
        >
        </el-pagination> -->

        <el-pagination
          v-if="totalCount"
          @size-change="onSizeChange"
          :hide-on-single-page="true"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 管理标签 -->
    <manage-category-dialog v-model="showManageCategoryDialog" />

    <!-- 增加或修改标签的对话弹框 -->
    <label-edit-dialog
      v-if="showEditLabelPopup"
      :visible.sync="showEditLabelPopup"
      :edit-title="editTitle"
      :label-edit-obj="labelEditObj"
      @refresh-data="apiList"
    >
    </label-edit-dialog>

    <!-- 提示对话框 -->
    <!-- <dialog-tip
    :dialogVisible="dialogVisible"
    :tipTitle="tipTitle"
    :tipContent="tipContent"
    :iconClass="iconClass"
    :iconColor="iconColor"
    @DialogSure="DialogSure"
    @DialogCancel="DialogCancel"></dialog-tip> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import LabelEditDialog from '@/dss-wechat3rd/src/bz_components/goods-label-dialog/index.vue';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import SearchInput from '@/dss-wechat3rd/src/components/search-input';
import ManageCategoryDialog from '@/dss-wechat3rd/src/components/goods/ManageCategoryDialog.vue';

// import dialogTip from '@/dss-common/components/Dialog/index.vue';

/*标签管理组件：美业、零售通用*/
export default {
  name: 'manage-label-list',
  mixins: [industryHelperMixin],
  components: {
    PlaceHolder,
    LabelEditDialog,
    SearchInput,
    ManageCategoryDialog
    // dialogTip
  },
  data() {
    return {
      loading: {
        list: false,
        label: false
      },
      totalCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      keyword: '',
      showEditLabelPopup: false, //是否显示编辑标签弹框
      editTitle: '', //编辑标签弹框标题
      labelEditObj: null, //用于传给标签dialog对话框子组件的标签对象
      labelType: null, //用于请求标签列表的标签类型

      labelList: [],
      labelClassify: [], //标签分类列表
      labelTypeId: '', //标签分类id

      showManageCategoryDialog: false, //是否显示管理标签弹窗
      // labelCategoryUrl: '',//标签分类接口
      // updateUrl: '',//编辑标签分类
      // deleteUrl: '',//删除标签分类
      // addaddUrl: '',//新增标签分类
      // checkUrl: ''//检查标签是否重名

      // 对话框
      dialogVisible: false,
      tipTitle: '',
      tipContent: '',
      iconClass: '',
      iconColor: '',
      keyWord: '',
      row: ''
    };
  },
  computed: {
    ...mapState({
      env: 'env'
    }),
    breadLabel() {
      return this.$route.query.goodsType === goodsTypeEnum.estate.type ? '楼盘列表' : '商品列表';
    },
    breadPath() {
      return this.mGetLabelBreadPath(this.$route.query.goodsType);
    }
  },
  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.apiList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.apiList();
    },

    //打开编辑标签弹窗
    editLabelPopup(label) {
      this.showEditLabelPopup = true;
      this.labelEditObj = {};
      this.labelEditObj.labelType = this.labelType;
      if (label) {
        this.labelEditObj.labelId = label.id;
        this.labelEditObj.labelName = label.label;
        this.labelEditObj.categoryId = label.categoryId;
        this.editTitle = '编辑标签';
      } else {
        this.editTitle = '新建标签';
      }
    },
    //打开管理标签弹窗
    manageLabel() {
      this.showManageCategoryDialog = true;
    },

    // 标签列表查询
    apiList() {
      this.loading.list = true;
      const params = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        type: this.labelType,
        status: 1,
        label: this.keyword,
        categoryId: this.labelTypeId
      };
      const url = constants.Api.goods.label.list;
      services
        .get(url, {
          params,
          action: '标签列表'
        })
        .done(res => {
          //标签列表
          this.labelList = res.data || [];
          this.totalCount = res.totalCount;

          this.labelEditObj = null; //将标签对象重新赋值为空，以免重复编辑同一个标签
        })
        .always(() => {
          this.loading.list = false;
        });
    },

    // 对话框确认操作
    // DialogSure() {
    //   this.dialogVisible = false;
    //   if (this.keyWord === 'delLabel') {
    //     this.clickDelete(this.row);
    //   }
    // },

    // // 对话框取消
    // DialogCancel() {
    //   this.dialogVisible = false;
    // },

    //是否确认删除二次弹框
    isDelete(id) {
      //   this.tipTitle = '删除标签';
      //   this.tipContent = '是否确认删除该标签?';
      //   this.iconClass = 'el-icon-warning';
      //   this.dialogVisible = true;
      //   this.iconColor = '#F5222D';
      //   this.keyWord = 'delLabel';
      //   this.row = id;

      this.$confirm('确认删除该标签？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.clickDelete(id); //删除标签
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },

    //删除标签
    clickDelete(id) {
      this.loading.list = true;
      const params = {
        id: id
      };
      const url = constants.Api.goods.label.delete;
      services
        .post(url, params, {
          action: '删除标签'
        })
        .done(res => {
          //查询标签列表
          this.apiList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .always(() => {
          this.loading.list = false;
        });
    },

    // 查询标签分类列表
    getLabelClassifyList() {
      this.loading.label = true;
      const url = constants.Api.goods.label.cateList;
      let params = {
        pageNo: 1,
        pageSize: 1000
      };
      services
        .get(url, {
          params,
          action: '标签分类列表'
        })
        .then(res => {
          let data = res.data || [];
          data.unshift({ categoryName: '默认分类', id: '0' });
          this.labelClassify = data;
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading.label = false;
        });
    },
    onChangeLabel() {
      this.pageParams.pageNo = 1;
      this.apiList();
    },
    onSearch() {
      this.pageParams.pageNo = 1;
      this.apiList();
    },

    // 重置按钮
    reset() {
      this.keyword = '';
      this.labelTypeId = '';
      this.apiList();
    }
  },

  mounted() {
    //获取连接上的标签类型
    const labelType = parseInt(this.$route.query.labelType);
    if (labelType || labelType === 0) {
      this.labelType = labelType; //获取连接上的标签类型用于查询标签列表
    }

    //查询标签列表
    this.apiList();
    //查询标签类型列表
    this.getLabelClassifyList();
  }
};
</script>

<style lang="less">
.label-list {
  font-size: 12px !important;

  .manage-btn-box {
    display: flex;
    text-align: right;
    padding: 20px;
    background: #fff;;
    .label {
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: right;
      color: @ui-font-color-darkGrey;
    }
    .category {
      margin-left: 24px;
    }
    .reset, .reset>button  {
      width: 64px;
      height: 36px;
      margin-left: 32px;
    }
  }

  .label-table {
    border-radius: 4px;
    padding: 0px 20px 20px;
    margin-top: 16px;
    background-color: #ffffff;
  }
}
</style>
