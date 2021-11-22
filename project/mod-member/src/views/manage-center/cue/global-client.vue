<template>
  <div class="cue-list-container">
    <el-form class="wkt-opt-label-container cue-list-filter-box" inline label-suffix=" :" label-width="80px">
      <el-form-item label="客户区域">
        <area-select @change="handleChangeArea" @clear="handleChangeArea" />
      </el-form-item>

      <el-form-item label="门店信息">
        <el-select
          placeholder="全部门店"
          size="mini"
          @change="onFilter"
          default-first-option
          v-model="keyword.store"
          :disabled="disabledStore"
          filterable
          clearable
        >
          <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="search" label="关键词">
        <search-input
          @search="onFilter"
          v-model.trim="keyword.keyword"
          :placeholder="'输入客户姓名/手机'"
          clearable
          :show-btn="false"
        />
      </el-form-item>

      <el-form-item label="跟进情况">
        <el-select
          placeholder="全部跟进情况"
          size="mini"
          @change="onFilter"
          default-first-option
          v-model="keyword.followInfo"
          clearable
          filterable
        >
          <el-option
            v-for="item in followInfoList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="客户来源">
        <el-select
          placeholder="全部客户来源"
          size="mini"
          @change="isChangeSource = true"
          @visible-change="onFilterSources"
          @remove-tag="onFilter"
          @clear="onFilter"
          default-first-option
          v-model="keyword.source"
          clearable
          filterable
          multiple
          collapse-tags
        >
          <el-option v-for="(item, index) in channelsList" :key="index" :label="item.name" :value="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="keyword.createTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="notStore" @change="onFilter" :disabled="checkDisabled" style="">无归属门店</el-checkbox>
      </el-form-item>
      <el-form-item class="end-filter"></el-form-item>

      <div class="btn-box">
        <el-button size="mini" class="border-radius-15" @click="handleClickMulti('invalid')" :disabled="isLoading"
          >批量移入无效</el-button
        >

        <el-button
          size="mini"
          class="border-radius-15"
          @click="handleClickMulti('elect')"
          :disabled="isLoading"
          v-if="isTelesales"
          >批量添加至电销</el-button
        >

        <el-button size="mini" class="border-radius-15" @click="openVipUpload" :disabled="isLoading"
          >批量导入</el-button
        >

        <el-button size="mini" class="border-radius-15" @click="handleClickMulti('export')" :disabled="isLoading"
          >批量导出</el-button
        >

        <el-button size="mini" class="border-radius-15" :disabled="isExport || isLoading" @click="exportAll"
          >一键导出</el-button
        >

        <el-button
          size="mini"
          class="border-radius-15"
          :disabled="isExport || isLoading"
          @click="handleBatchAllocation"
          v-if="effectiveScope == 2"
          >批量分配</el-button
        >

        <el-button
          size="mini"
          class="border-radius-15"
          :disabled="isExport || isLoading"
          @click="handleSyncTelemarkList"
          v-if="isTelesales"
          >同步电销列表</el-button
        >

        <el-button
          size="mini"
          type="primary"
          class="border-radius-15"
          style="margin-right: 15px"
          @click="addNewMember"
          :disabled="isLoading"
          >添加客户</el-button
        >
      </div>
    </el-form>

    <div class="cue-list-content" ref="tableContent">
      <el-table
        :data="memberList"
        :max-height="tableHeight"
        @row-dblclick="showInfo"
        v-loading="isLoading"
        class="wkt-table"
        ref="memberTable"
        @selection-change="handleSelectionChange"
        @sort-change="handleTableSortChange"
      >
        <el-table-column type="expand" v-if="isEffectiveScope">
          <template slot-scope="props">
            <div
              class="table-expand-container"
              v-if="!!props.row.clientEmployeeBinds && props.row.clientEmployeeBinds.length != 0"
            >
              <h4 class="table-expand-title">客户归属情况</h4>
              <div class="table-expand-content last-expand">
                <div class="table-expand-con-head">
                  <span>归属门店</span>
                  <span>归属导购</span>
                  <span>操作</span>
                </div>
                <div class="table-expand-con-body">
                  <div class="table-expand-con-item" :key="item.id" v-for="item in props.row.clientEmployeeBinds">
                    <span>{{ item.storeName }}</span>
                    <span>{{ item.employeeName }}</span>
                    <a
                      href="javascript:;"
                      v-if="item.employeeId"
                      @click="handleOpenShopNoStore(item.storeId, item.employeeId, props.row.id)"
                      >移交导购</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="60" label="序号"></el-table-column>

        <el-table-column label="客户来源" prop="sourceList" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sourceList | filterSource }}</span>
          </template>
        </el-table-column>
        <el-table-column label="省" prop="province" show-overflow-tooltip sortable="custom"> </el-table-column>
        <el-table-column prop="city" label="市" sortable="custom"> </el-table-column>
        <!-- <el-table-column prop="district"
                         label="区" sortable="custom">
        </el-table-column> -->

        <el-table-column prop="realName" label="客户姓名" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <a href="javascript:;" @click="showInfo(scope.row)">{{ scope.row.realName || scope.row.nickName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="150"></el-table-column>
        <el-table-column prop="nickName" label="微信头像/昵称" width="180" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="wxInfo-box">
              <img v-if="!scope.row.avatar" class="avatar" :src="avatar" />
              <el-tooltip placement="top" v-if="scope.row.avatar">
                <img class="avatar" :src="scope.row.avatar" />
                <div slot="content">
                  <img class="avatar" style="width: 60px; height: 60px; border-radius: 50%" :src="scope.row.avatar" />
                </div>
              </el-tooltip>
              <span>{{ scope.row.nickName || scope.row.realName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="followInfo"
          label="跟进情况"
          min-width="100"
          :formatter="formatFollowInfo"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="storeName" label="归属门店" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="bindEmployeeName"
          label="归属导购"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="formatTime"
          label="创建时间"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <a href="javascript:;" @click="handleShowShopDialog(scope.row)">分配导购</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalMemberCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        ref="pagination"
        :page-sizes="[10, 20, 50, 100, 200]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      ></el-pagination>
    </div>

    <!--批量导入-->
    <upload
      :visible.sync="dialog.upload"
      :title="'客户导入'"
      @upload-success="onUploadSuccess"
      :template-down-url="templateDownUrl"
      :upload-server-url="uploadServerUrl"
      :template-desc="'您可以下载我们提供的模版，批量上传客户信息。 模版下载'"
    ></upload>

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="dialog.showTipDialog" width="500px">
      <span style="font-size: 14px">客户信息正在导出，请等候...</span>
    </el-dialog>

    <sync-telemark-dialog
      :visible="dialog.openSyncTelemark"
      @close="handleCloseShop"
      :source-list="channelsList"
      :do-search="onFilter"
    />
    <shopping-dialog
      is-show-store
      is-show-shop
      is-multiple-shop
      :visible="dialog.openBatchShop"
      @close="handleCloseShop"
      :shop-data-source="shopDataSource"
      :store-data-source="storeList"
      @change-store="handleChangeStore"
      :submit-loading="loading.moveGuideLoading"
      @submit="handleBatchShopGuide"
      title="批量分配导购"
      :handle-cascader-change="handleCascaderChange"
      :province-list="provinceList"
      :guide-loading="loading.guideLoading"
    />
    <shopping-dialog
      is-show-shop
      is-show-store
      :visible="dialog.openShop"
      :shop-data-source="shopDataSource"
      :store-data-source="storeList"
      @close="handleCloseShop"
      @change-store="handleChangeStore"
      :submit-loading="loading.moveGuideLoading"
      @submit="handleShopGuide"
      title="分配导购"
      :handle-cascader-change="handleCascaderChange"
      :province-list="provinceList"
      :client-employee-binds="curClientEmployeeBinds"
      :guide-loading="loading.guideLoading"
    />

    <shopping-dialog
      is-show-shop
      :visible="dialog.openGuides"
      :shop-data-source="shopDataSource"
      @close="handleCloseShop"
      title="移交导购"
      :submit-loading="loading.moveGuideLoading"
      @submit="handleSubmitMoveGuide"
      :cur-store-id="guideForm && guideForm.storeId"
    />

    <!-- 移入无效列表 -->
    <el-dialog title="移入无效" :visible.sync="dialog.showInvalidDialog" width="400px">
      <el-form :model="invalidForm" :rules="invalidRules" ref="invalidForm">
        <el-form-item label="失效原因:" prop="invalidCause" label-width="100px">
          <el-select v-model="invalidForm.invalidCause" size="mini" placeholder="请选择" style="width: 200px" clearable>
            <el-option
              v-for="item in invalidOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="justify-content: flex-end">
        <el-button @click="handleCancelInvalid">取 消</el-button>
        <el-button :loading="invalidLoading" type="primary" @click="handleSubmitInvalid">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加客户 -->
    <add-user-dialog
      :do-search="onFilter"
      :source-list="channelsList"
      :custormer-client-source="custormerClientSource"
      :store-list="storeList"
      :visible.sync="dialog.showAddUser"
      :is-effective-scope="effectiveScope == 1"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import datetime from '@/dss-common/utils/date';
  import services from '@/dss-common/utils/services';
  import Upload from '@/dss-common/components/upload/index.vue';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import avatar from '@/dss-common/img/default-avatar.png';

  import api from '@/mod-member/src/api/manage.js';
  import followInfoEnum from '@/mod-member/src/enum/followInfoEnum';

  import SearchInput from '../../../components/search-input';
  import AreaSelect from '../components/AreaSelect';
  import ShoppingDialog from '../components/ShoppingDialog';
  import addUserDialog from './components/add-user-dialog';
  import SyncTelemarkDialog from './components/SyncTelemarkDialog';

  import { sharedStoreApi } from '@/register/console';
  const { queryProvinceList, queryCityList } = sharedStoreApi;

  const unionKeys = ['id'];
  export default {
    name: 'CommonCue',
    mixins: [tableCheckedHelperMixin],
    components: {
      Upload,
      addUserDialog,
      SyncTelemarkDialog,
      AreaSelect,
      SearchInput,
      ShoppingDialog,
    },
    data() {
      return {
        // 模板下载地址
        templateDownUrl: 'https://front-end-1259575047.file.myqcloud.com/dmp/客户导入模板.xlsx',
        // 模板上传接口
        uploadServerUrl: '/wp/client/info/import/clue',

        avatar,

        keyword: {
          source: [],
          keyword: null,
          store: null,
          followInfo: null, // 跟进情况
          sortByTime: null, // 1-根据创建时间排序;2-根据更新时间排序;3-根据省市区顺序;4-根据省市区倒序 不传默然按ID排序
          createTime: null, // 创建时间
        },
        area: {
          province: null,
          city: null,
          district: null,
        },
        memberList: [],
        totalMemberCount: 0,
        pageParams: {
          pageSize: 50,
          pageNo: 1,
        },
        memberAssig: null,
        multipleSelection: [],

        dialog: {
          upload: null,
          showTipDialog: false,
          openSyncTelemark: false, // 同步电销
          openBatchShop: false, // 是否显示批量导购弹窗
          openShop: false, // 是否显示导购弹窗
          openGuides: false, // 移交导购
          showInvalidDialog: false, // 移入无效
          showAddUser: false, // 新增客户
        },
        curClientEmployeeBinds: [],
        provinceList: [],
        errorMessage: null,
        isLoading: false,
        isExport: false, // 导出
        notStore: false, // 无归属门店
        disabledStore: false, // 是否禁用门店
        invalidOptions: [
          {
            value: 1,
            name: '不在营业范围内',
          },
          {
            value: 2,
            name: '暂无合适产品',
          },
          {
            value: 3,
            name: '长期无法联系',
          },
          {
            value: 4,
            name: '强烈拒绝',
          },
          {
            value: 5,
            name: '已在友商购买',
          },
        ],
        followInfoList: followInfoEnum.infoList,
        invalidForm: {
          invalidCause: null,
        },
        invalidRules: {
          invalidCause: [{ required: true, message: '请选择失效原因', trigger: 'change' }],
        },
        invalidLoading: false,
        shopDataSource: [],
        loading: {
          moveGuideLoading: false,
          guideLoading: false,
        },
        tableHeight: 0,
        checkDisabled: false,
        isChangeSource: false, // 是否改变客户来源筛选
        guideForm: {
          storeId: null,
          employeeId: null,
          clientIds: null,
        },
      };
    },
    watch: {
      notStore(newVal) {
        // 选中归属门店，禁用并清除门店筛选
        if (newVal) {
          this.keyword.store = null;
        }
        this.disabledStore = !!newVal;
      },
    },
    computed: {
      ...mapState({
        baseStoreList: 'storeList',
        isTelesales: state => state.dmp.isTelesales,
      }),
      storeList() {
        return this.baseStoreList.filter(item => item.id);
      },
      // 客户来源
      channelsList() {
        return this.$store.state.dmp.clientSourceList;
      },
      // 自定义客户来源
      custormerClientSource() {
        return this.$store.state.dmp.custormerClientSource;
      },
      // 企业一对一，不显示归属门店
      isEffectiveScope() {
        return !this.notStore && this.effectiveScope == 2;
      },
      effectiveScope() {
        // 1企业一对一，2门店一对一
        return this.$store.state.dmp.effectiveScope;
      },
    },
    beforeRouteEnter(to, from, next) {
      let isUpdate = false;
      if (from.path === '/manage/cue/common-cue/detail') {
        to.meta.keepAlive = true;
        isUpdate = !!from.meta.isUpdate;
        from.meta.isUpdate = false;
      }
      next(vm => {
        if (isUpdate) {
          vm.isRefresh();
        }
      });
    },
    beforeRouteLeave(to, from, next) {
      // from.meta.keepAlive = true;
      next();
    },
    activated() {
      this.$router.push({
        query: {
          pageNo: this.$route.query.pageNo,
        },
      });
    },
    mounted() {
      // if (!this.$store.state.dmp.openClientAttribution) {
      //   // 未开启客户归属关系不允许访问线索列表页面
      //   // this.$router.replace('/manage/rules/relation')
      // }
      if (this.$route.query.pageNo) {
        this.pageParams.pageNo = +this.$route.query.pageNo;
        this.$nextTick(() => {
          this.$refs.pagination.internalCurrentPage = this.pageParams.pageNo;
        });
      } else {
        this.pageParams.pageNo = 1;
      }
      this.setTableHeight();
      this.isRefresh();
      this.queryProvinceList();
    },
    filters: {
      price(value, scale = 100) {
        return value ? (value / scale).toFixed(2) : '0.00';
      },
      filterSource(sourceList) {
        if (!Array.isArray(sourceList)) return '--';

        const target = sourceList.map(item => item.name);
        return target ? target.join('、') : '--';
      },
    },
    methods: {
      // 表格区域排序
      handleTableSortChange({ column, prop, order }) {
        const orderBy = {
          province_ascending: 3,
          province_descending: 4,
          city_ascending: 6,
          city_descending: 7,
          district_ascending: 8,
          district_descending: 9,
        };
        this.keyword.sortByTime = orderBy[prop + '_' + order] || null;
        this.onFilter();
      },

      getRowClassName({ row, rowIndex }) {
        if (!Array.isArray(row.clientEmployeeBinds) || row.clientEmployeeBinds.length == 0) {
          return 'row-expand-cover';
        }
      },

      // 点击搜索
      searchFilter() {
        this.onFilter();
      },
      onBreak(val) {
        return val.replace('\n', '<br/>');
      },

      isRefresh() {
        this.doSearch();
      },
      showInfo(user) {
        this.$router.push({
          path: '/manage/cue/common-cue/detail',
          query: {
            id: user.id,
            memberId: user.memberId ? user.memberId : null,
            isRefresh: this.isRefresh,
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
          },
        });
      },
      addNewMember() {
        this.dialog.showAddUser = true;
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.doSearch();
      },

      // 选择省市区
      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
        // 避免还没赋值就调用
        this.$nextTick(() => {
          this.onFilter();
        });
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.$router.push({
          query: {
            pageNo: page,
          },
        });
        this.doSearch();
      },

      onFilter() {
        this.pageParams.pageNo = 1;
        this.doSearch();
      },
      onFilterSources(show) {
        if (!show && this.isChangeSource) {
          this.isChangeSource = false;
          this.pageParams.pageNo = 1;
          this.doSearch();
        }
      },

      searchParams() {
        const params = {
          status: 4,
          pageNo:
            this.memberList.length === 1 && this.pageParams.pageNo != 1
              ? this.pageParams.pageNo - 1
              : this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          provinceId: this.area.province,
          cityId: this.area.city,
          districtId: this.area.district,
          keyword: this.keyword.keyword,
          storeId: this.notStore ? null : this.keyword.store,
          notStore: this.notStore,
          followInfo: this.keyword.followInfo,
          sortByTime: this.keyword.sortByTime,
          createTimeStart: this.keyword.createTime && this.keyword.createTime[0] + ' 00:00:00',
          createTimeEnd: this.keyword.createTime && this.keyword.createTime[1] + ' 23:59:59',
          sources: [],
          customerSources: [],
          isPc: true,
        };

        // 客户来源区分, 系统:0  自定义:1
        if (this.keyword.source.length) {
          this.keyword.source.forEach(item => {
            const currentSource = this.channelsList[item];
            params[currentSource.type == 0 ? 'sources' : 'customerSources'].push(currentSource.id);
          });
        }
        params.sources = params.sources.join(',') || null;
        params.customerSources = params.customerSources.join(',') || null;

        return params;
      },

      doSearch() {
        this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
        this.isLoading = true;
        this.checkDisabled = true;
        api
          .query(this.searchParams())
          .then(res => {
            let memberList = res.data || [];

            memberList = memberList.map(item => {
              let storeName = '';
              let bindEmployeeName = '';

              if (Array.isArray(item.clientEmployeeBinds) && item.clientEmployeeBinds.length > 0) {
                const names = [];
                const employeeNames = [];

                item.clientEmployeeBinds.map(v => {
                  names.push(v.storeName);
                  employeeNames.push(v.employeeName);
                });
                storeName = names.filter(v => v).join('、');
                bindEmployeeName = employeeNames.filter(v => v).join('、');
              }

              return { ...item, storeName, bindEmployeeName };
            });

            this.memberList = memberList;
            this.totalMemberCount = res.totalCount;
            this.mBuildMultipleTableSelection(this.memberList, 'memberTable', unionKeys);
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            this.checkDisabled = false;
            this.isLoading = false;
          });
      },

      formatTime(row, column) {
        const date = row[column.property];
        if (date) {
          return datetime.format(new Date(date), 'YYYY-MM-DD');
        }
        return '';
      },

      // 过滤跟进情况
      formatFollowInfo(row, column) {
        const f = row[column.property];
        if (f === null || f === undefined) return '';
        const followInfo = this.followInfoList.find(item => item.value === f);
        return followInfo ? followInfo.name : '';
      },

      // 判断已勾选列表数据
      isMultiple(str) {
        if (this.multipleSelection && this.multipleSelection.length === 0) {
          this.$message.warning(str);
          return false;
        }
        return true;
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 打开会员导入
      openVipUpload() {
        this.dialog.upload = true;
      },

      // 会员导入成功后回调
      onUploadSuccess() {
        this.onPageChange(1);
      },

      // 批量操作
      handleClickMulti(action) {
        if (!this.isMultiple('请先选择需要批量操作的客户')) {
          return;
        }
        this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
        const list = this.mTotalCheckedList.map(item => {
          return item.id;
        });
        const ids = list.join(',');

        switch (action) {
          case 'invalid':
            this.clientId = ids;
            this.dialog.showInvalidDialog = true;
            break;
          case 'elect':
            this.handleAddTelemark(list);
            break;
          case 'export':
            this.handleExport(0, { ...this.searchParams(), ...{ ids } });
            break;
        }
      },

      // 一键导出
      exportAll() {
        this.handleExport(1, this.searchParams());
      },

      handleExport(index, params) {
        const str = `${['批量导出', '一键导出'][index]}`;

        this.$confirm(`确定${str}过滤后的客户信息吗？ `, str, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          this.isExport = true;
          index === 1 && (this.dialog.showTipDialog = true);
          exportExcel
            .getDownload(api.export, params)
            .then(res => {
              this.$message({
                message: '导出客户信息成功，正在下载',
                type: 'success',
              });
              if (index === 0) {
                this.$refs.memberTable.clearSelection();
                this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
              }
            })
            .always(() => {
              this.isExport = false;
              this.dialog.showTipDialog = false;
            });
        });
      },

      // 批量分配
      handleBatchAllocation() {
        if (!this.isMultiple('请选择需要批量分配的客户')) {
          return;
        }

        this.dialog.openBatchShop = true;
      },
      // 关闭导购弹窗
      handleCloseShop() {
        this.dialog.openBatchShop = false;
        this.dialog.openShop = false;
        this.dialog.openGuides = false;
        this.dialog.openSyncTelemark = false;
        this.curClientEmployeeBinds = [];
        this.shopDataSource = [];
      },
      // 单条导购分配
      handleShowShopDialog(item) {
        this.guideForm = { ...item };
        this.curClientEmployeeBinds = item.clientEmployeeBinds || [];
        this.dialog.openShop = true;
      },

      // 门店改变
      handleChangeStore(storeId) {
        this.shopDataSource = [];
        if (storeId) {
          this.getClientGuideList(storeId);
        }
      },

      // 同步电销列表
      handleSyncTelemarkList() {
        this.dialog.openSyncTelemark = true;
      },
      // 添加至电销
      handleAddTelemark(item) {
        this.$confirm(`确定要添加至电销吗？ `, '添加至电销', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const paramsArr = item.map(i => ({ clientId: i, status: 1 }));
            if (item.length > 1) {
              api.batchAddTelesales(paramsArr).then(({ data }) => {
                this.$message.success(`批量添加成功${data}条数据`);
              });
            } else {
              api.addTelesales(...paramsArr).then(({ success }) => {
                if (success) {
                  this.$message.success('添加成功');
                }
              });
            }
            this.initSelection();
            this.onFilter();
          })
          .catch(console.log);
      },
      handleCancelInvalid() {
        this.clientId = null;
        this.dialog.showInvalidDialog = false;
        this.$refs.invalidForm.resetFields();
      },
      handleSubmitInvalid() {
        this.$refs.invalidForm.validate(valid => {
          if (!valid) return;
          this.invalidLoading = true;
          let key = 'clientId';
          let url = api.moveInvalid.url;
          if (this.clientId.includes(',')) {
            key = 'clientIds';
            url = api.batchMoveInvalid.url;
          }
          const params = {
            invalidCause: this.invalidForm.invalidCause,
          };
          params[key] = this.clientId;
          services
            .post(url, params, { action: '移入无效客户' })
            .then(({ data, success }) => {
              this.invalidLoading = false;
              this.dialog.showInvalidDialog = false;
              this.invalidForm.invalidCause = null;
              if (success) {
                const message = typeof data === 'number' ? `批量操作移入无效客户${data}条` : '移入无效客户成功';
                this.$message.success(message);
                this.initSelection();
                this.onFilter();
              }
            })
            .finally(() => {
              this.dialog.showInvalidDialog = false;
              this.invalidLoading = false;
            });
        });
      },

      initSelection() {
        this.mResetCheckedData();
        this.multipleSelection = [];
        this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
      },

      setTableHeight() {
        const set = () => {
          const height = window.innerHeight - this.$refs.tableContent.offsetTop - 200;
          this.tableHeight = height > 170 ? height : 170;
        };
        setTimeout(set, 200);
        window.onresize = set;
      },

      // 移交导购
      handleOpenShopNoStore(storeId, employeeId, clientId) {
        this.guideForm = { storeId, employeeId, clientIds: clientId };

        this.getClientGuideList(storeId, 'openGuides', () => {
          this.shopDataSource = this.shopDataSource.filter(item => item.id !== employeeId);
        });
      },

      // 查询导购
      getClientGuideList(storeId, dialog, callback) {
        this.loading.guideLoading = true;
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.3)',
        });
        api
          .getClientGuideList({
            storeId,
            queryAll: true,
            positionIds: 'common_role_storeKeeper,common_role_sales',
          })
          .then(({ data }) => {
            if (dialog) {
              this.dialog[dialog] = true;
            }
            if (Array.isArray(data)) {
              this.shopDataSource = data;
            }
            this.loading.guideLoading = false;
            loading.close();
            callback && callback();
          })
          .catch(() => {
            this.loading.guideLoading = false;
            loading.close();
          });
      },

      // 移交导购
      handleSubmitMoveGuide({ employeeId }) {
        this.saveBindClientSet({
          ...this.guideForm,
          eventId: 'crm_corp_hand_over_client',
          employeeId,
        });
      },
      // 分配导购
      handleShopGuide({ employeeId, storeId }) {
        this.saveBindClientSet({
          clientIds: this.guideForm.id,
          eventId: 'crm_corp_assign_clue',
          employeeIds: employeeId,
          storeId: storeId || this.guideForm.storeId,
        });
      },
      // 批量分配
      handleBatchShopGuide({ employeeIds, storeId }) {
        // this.mUpdateTotalListBySelection(
        //   this.memberList,
        //   this.multipleSelection,
        //   unionKeys
        // );
        let clientIds = this.multipleSelection.map(item => {
          return item.id;
        });
        clientIds = clientIds.join(',');
        employeeIds = employeeIds.join(',');
        this.saveBindClientSet(
          {
            clientIds,
            eventId: 'crm_corp_assign_clue',
            employeeIds,
            storeId,
          },
          () => {
            this.multipleSelection = [];
          }
        );
      },
      // 移交导购，分配导购
      saveBindClientSet(params, callback) {
        this.loading.moveGuideLoading = true;
        api
          .bindClientSet(params)
          .then(({ data }) => {
            this.loading.moveGuideLoading = false;
            if (data) {
              callback && callback();
              this.handleCloseShop();
              this.guideForm = null;
              this.onFilter();
            }
          })
          .catch(() => {
            this.loading.moveGuideLoading = false;
          });
      },

      async queryProvinceList() {
        const { data } = await queryProvinceList();
        this.provinceList = (data || []).map(i => ({
          label: i.province,
          value: i.province,
          children: [],
        }));
      },

      async handleCascaderChange([provinceName]) {
        const cityList = await this.queryCityList(provinceName);
        const cur = this.provinceList.find(i => i.value === provinceName);
        if (cur) {
          cur.children = cityList;
        }
      },

      async queryCityList(provinceName) {
        const { data } = await queryCityList({ provinceName });
        return data.map(i => ({ label: i.city, value: i.city }));
      },
    },
  };
</script>
<style lang="less" scoped>
  @import './index';
  .border-radius-15 {
    border-radius: 15px;
  }
</style>
<style>
  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }
</style>
