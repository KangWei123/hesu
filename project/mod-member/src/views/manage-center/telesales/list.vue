<template>
  <div class="cue-list-container">
    <el-form
      class="wkt-opt-label-container cue-list-filter-box"
      inline
      label-suffix=" :"
      label-width="80px"
      ref="filterForm"
    >
      <el-form-item label="客户区域">
        <area-select @change="handleChangeArea" @clear="handleChangeArea" />
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

      <el-form-item v-if="selectHeadTab == 3 && guideList.length > 0" label="导购信息">
        <el-select
          v-model="keyword.employeeId"
          size="mini"
          placeholder="全部导购"
          @change="onFilter"
          filterable
          clearable
        >
          <el-option v-for="item in guideList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
          v-model="keyword.source"
          clearable
          filterable
          multiple
          collapse-tags
        >
          <el-option v-for="(item, index) in channelsList" :key="index" :label="item.name" :value="index"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="selectHeadTab == 1" label="CRM跟进">
        <el-select
          placeholder="全部"
          size="mini"
          @change="onFilter"
          default-first-option
          v-model="keyword.followInfo"
          clearable
          filterable
        >
          <el-option v-for="item in crmCallResult" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="selectHeadTab == 2" label="来源门店">
        <el-select
          placeholder="全部门店"
          size="mini"
          @change="onFilterStore"
          default-first-option
          v-model="keyword.sourceStoreId"
          filterable
          clearable
        >
          <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="selectHeadTab == 3" label="门店信息">
        <el-select
          placeholder="全部门店"
          size="mini"
          @change="onFilterStore"
          default-first-option
          v-model="keyword.storeId"
          filterable
          clearable
        >
          <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <br />

      <el-form-item v-if="selectHeadTab != 3" label="拨打时间">
        <el-date-picker
          v-model="keyword.dialTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="selectHeadTab != 3" label="回访时间">
        <el-date-picker
          v-model="keyword.returnVisitTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="selectHeadTab != 3" label="分配客服">
        <el-date-picker
          v-model="keyword.allotTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="selectHeadTab != 3" label="更新时间">
        <el-date-picker
          v-model="keyword.updateTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="selectHeadTab != 1" label="导入时间">
        <el-date-picker
          v-model="keyword.importTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="selectHeadTab === 1" label="创建时间">
        <el-date-picker
          v-model="keyword.createTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="onFilter"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="selectHeadTab !== 1" label="APP跟进">
        <el-select
          placeholder="全部"
          size="mini"
          @change="onFilter"
          default-first-option
          v-model="keyword.followInfo"
          clearable
          filterable
        >
          <el-option v-for="item in appCallResult" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <div class="btn-box" v-if="selectHeadTab != 1">
        <el-button size="mini" type="primary" round @click="dialog.upload = true">批量导入</el-button>
      </div>
    </el-form>

    <div class="cue-list-content" ref="tableContent">
      <el-table
        :max-height="tableHeight"
        :data="memberList"
        stripe
        v-loading="isLoading"
        class="wkt-table telemarketing-table"
        ref="telemarketingTable"
        :default-sort="{ prop: 'updateTime', order: 'descending' }"
        @selection-change="handleSelectionChange"
        @sort-change="handleTableSortChange"
        @row-dblclick="showInfo"
        @expand-change="handleExpandChange"
      >
        <el-table-column type="expand" width="20" key="1">
          <template slot-scope="props">
            <div class="table-expand-container">
              <h4 class="table-expand-title">电销记录</h4>
              <div class="table-expand-content telemark-table-expand">
                <div class="table-expand-con-head">
                  <span v-if="selectHeadTab != 3">电销客服</span>
                  <span>拨打时间</span>
                  <span v-if="selectHeadTab == 3">拨打时长</span>
                  <span v-if="selectHeadTab != 3">跟进情况</span>
                  <span v-if="selectHeadTab != 3">回访时间</span>
                  <span v-if="selectHeadTab != 3">备注</span>
                </div>
                <div class="table-expand-con-body" v-if="props.row.clientEmployeeBinds">
                  <div class="table-expand-con-item" :key="item.id" v-for="item in props.row.clientEmployeeBinds">
                    <span v-if="selectHeadTab != 3">{{ item.employeeName }}</span>
                    <span>{{ item.dialTime | filterFormatTime }}</span>
                    <span v-if="selectHeadTab == 3">{{ item.dialDuration ? item.dialDuration + '秒' : '' }}</span>
                    <span v-if="selectHeadTab != 3">{{ item.followInfoDesc }}</span>
                    <span v-if="selectHeadTab != 3">{{ item.returnVisitTime | filterFormatTime }}</span>
                    <span v-if="selectHeadTab != 3">{{ item.remark }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column type="selection" width="50" key="2" v-if="showTableMulti"></el-table-column> -->

        <el-table-column width="60" label="序号" type="index" key="3"></el-table-column>

        <el-table-column label="客户来源" prop="clientSourceInfos" show-overflow-tooltip key="4" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.clientSourceInfos | filterSource }}</span>
          </template>
        </el-table-column>

        <el-table-column label="省" prop="province" show-overflow-tooltip key="5-1" min-width="90" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.province }}</span>
          </template>
        </el-table-column>

        <el-table-column label="市" prop="city" show-overflow-tooltip key="5-2" min-width="90" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.city }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="clientRealName" label="客户姓名" show-overflow-tooltip key="6" min-width="120">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showInfo(scope.row)">{{
              scope.row.clientRealName || scope.row.clientNickName
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip key="7" min-width="180"></el-table-column>

        <el-table-column
          prop="lastFollowInfo"
          label="CRM跟进情况"
          min-width="150"
          :formatter="formatFollowInfo"
          key="CRM跟进情况"
          v-if="selectHeadTab == 1"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="lastFollowInfo"
          :formatter="formatFollowInfo"
          show-overflow-tooltip
          key="APP跟进情况"
          min-width="150"
          v-if="selectHeadTab == 2"
        >
          <template slot="header">
            <span style="padding-right: 5px">APP跟进情况</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="电销跟进情况为“愿意沟通”的客户将同步新增至“归属门店”的门店线索中。"
              placement="bottom"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastFollowInfo"
          :formatter="formatFollowInfo"
          show-overflow-tooltip
          key="9"
          min-width="150"
          v-if="selectHeadTab == 3"
        >
          <template slot="header">
            <span style="padding-right: 5px">APP跟进情况</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="电销跟进情况为“愿意沟通”的客户将同步新增至“归属门店”的门店线索中。"
              placement="bottom"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="selectHeadTab != 1"
          prop="storeName"
          label="归属门店"
          min-width="150"
          show-overflow-tooltip
          key="10"
        ></el-table-column>

        <el-table-column
          v-if="selectHeadTab == 3"
          prop="createTime"
          :formatter="formatTime"
          label="创建时间"
          show-overflow-tooltip
          key="12"
          min-width="180"
        ></el-table-column>

        <el-table-column
          v-if="selectHeadTab != 3"
          prop="dialTime"
          :formatter="formatTime"
          label="拨打时间"
          show-overflow-tooltip
          key="13"
          min-width="180"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          v-if="selectHeadTab != 3"
          prop="returnVisitTime"
          :formatter="formatTime"
          label="回访时间"
          show-overflow-tooltip
          key="14"
          min-width="180"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          v-if="selectHeadTab != 3"
          prop="allotTime"
          :formatter="formatTime"
          label="分配客服时间"
          show-overflow-tooltip
          key="15"
          min-width="180"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          v-if="selectHeadTab === 1"
          prop="clientCreateTime"
          :formatter="formatTime"
          label="创建时间"
          show-overflow-tooltip
          min-width="190"
          sortable="custom"
        >
          <template slot="header">
            <span>
              <span>创建时间（全域）</span>
              <el-tooltip effect="dark" content="本时间与该客户在全域客户列表中的创建时间一致。" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="selectHeadTab != 3"
          prop="updateTime"
          :formatter="formatTime"
          label="更新时间"
          show-overflow-tooltip
          key="16"
          min-width="180"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          v-if="selectHeadTab != 1"
          prop="importTime"
          :formatter="formatTime"
          label="导入时间"
          show-overflow-tooltip
          key="18"
          min-width="170"
        ></el-table-column>

        <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" fixed="right" width="100" key="17">
          <template slot-scope="scope">
            <a href="javascript:;" @click="toggleExpand(scope.row)">{{ scope.row.showExpand ? '收起' : '电销记录' }}</a>
            <!-- <a href="javascript:;" @click="showInfo(scope.row)">详情</a> -->
            <!-- <a
              v-if="selectHeadTab!=3"
              href="javascript:;"
              @click="handleShowShopDialog(scope.row)"
            >分配导购</a> -->
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

    <upload
      :visible.sync="dialog.upload"
      :title="'电销客户导入'"
      @upload-success="onPageChange(1)"
      :template-down-url="templateDownUrl"
      :upload-server-url="uploadServerUrl"
      :template-desc="'您可以下载我们提供的模版，批量上传线索信息。 模版下载'"
    ></upload>

    <!-- <shopping-dialog
      isShowStore
      isShowShop
      isMultipleShop
      :visible="dialog.openBatchShop"
      @close="handleCloseShop"
      :shopDataSource="shopDataSource"
      :storeDataSource="storeList"
      @change-store="handleChangeStore"
      :submitLoading="loading.moveGuideLoading"
      @submit="handleBatchShopGuide"
      title="批量分配导购"
      :handleCascaderChange="handleCascaderChange"
      :provinceList="provinceList"
      :guideLoading="loading.guideLoading"
    />
    <shopping-dialog
      isShowShop
      isShowStore
      :visible="dialog.openShop"
      :shopDataSource="shopDataSource"
      :storeDataSource="storeList"
      @close="handleCloseShop"
      @change-store="handleChangeStore"
      :submitLoading="loading.moveGuideLoading"
      @submit="handleShopGuide"
      title="分配导购"
      :disabledStore="selectHeadTab==2"
      :curStoreId="currentStoreId"
      :handleCascaderChange="handleCascaderChange"
      :provinceList="provinceList"
      :clientEmployeeBinds="curClientEmployeeBinds"
      :guideLoading="loading.guideLoading"
    /> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import datetime from '@/dss-common/utils/date';
  import Upload from '@/dss-common/components/upload/index.vue';
  import services from '@/dss-common/utils/services';

  import api from '@/mod-member/src/api/manage';
  import SearchInput from '@/mod-member/src/components/search-input';
  import followInfoEnum from '@/mod-member/src/enum/followInfoEnum';

  import AreaSelect from '../components/AreaSelect';
  import ShoppingDialog from '../components/ShoppingDialog';

  import { sharedStoreApi } from '@/register/console';
  const { queryProvinceList, queryCityList } = sharedStoreApi;

  const unionKeys = ['id'];
  export default {
    name: 'TelemarketingList',
    mixins: [tableCheckedHelperMixin],
    components: { AreaSelect, ShoppingDialog, SearchInput, Upload },
    props: {
      selectHeadTab: {
        type: Number,
        default: 1, // 1:总部电销; 2:外包电销; 3:导购跟进
      },
    },
    data() {
      return {
        templateDownUrl: 'https://front-end-1259575047.file.myqcloud.com/dmp/电销客户导入模板.xlsx',
        uploadServerUrl: '/wp/client/telesales/import?status=' + this.selectHeadTab,

        tableHeight: 0,
        keyword: {
          keyword: null,
          source: [],
          storeId: null, // 门店id
          employeeId: null, // 导购id
          sourceStoreId: null, // 来源门店
          dialTime: null, // 拨打时间
          returnVisitTime: null, // 回访时间
          allotTime: null, // 分配客服时间
          updateTime: null, // 更新时间
          importTime: null, // 导入时间
          createTime: null, // 创建时间
          followInfo: null, // 跟进情况
          sortByTime: null,
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
        multipleSelection: [],
        isLoading: false,
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
        stageList: [],
        guideList: [],
        visibleShop: false, // 分配导购
        visibleBatchShop: false, // 批量分配导购
        dialog: {
          // openBatchShop: false, // 是否显示批量导购弹窗
          // openShop: false, // 是否显示导购弹窗
          upload: false, // 是否显示批量导入弹窗
        },
        shopDataSource: [],
        loading: {
          moveGuideLoading: false,
          guideLoading: false,
        },
        currentStoreId: null,
        followInfoList: followInfoEnum.infoList, // 跟进情况
        appCallResult: followInfoEnum.appCallResult, // app跟进情况
        crmCallResult: followInfoEnum.crmCallResult, // crm跟进情况
        curClientEmployeeBinds: [],
        provinceList: [],
        isChangeSource: false, // 是否改变客户来源筛选
      };
    },
    beforeRouteEnter(to, from, next) {
      if (from.path === '/manage/telemarketing/detail') {
        to.meta.keepAlive = true;
      }
      next();
    },
    beforeRouteLeave(to, from, next) {
      // from.meta.keepAlive = false;
      next();
    },
    activated() {
      this.$router.push({
        query: {
          pageNo: this.$route.query.pageNo,
        },
      });
    },
    computed: {
      ...mapState({
        baseStoreList: 'storeList',
      }),
      storeList() {
        return this.baseStoreList.filter(item => item.id);
      },
      // 客户来源
      channelsList() {
        return this.$store.state.dmp.clientSourceList;
      },
      showTableMulti() {
        // table 多选
        return this.selectHeadTab == 1;
      },
    },
    watch: {},
    mounted() {
      if (this.$route.query.pageNo) {
        this.pageParams.pageNo = +this.$route.query.pageNo;
        this.$nextTick(() => {
          this.$refs.pagination.internalCurrentPage = this.pageParams.pageNo;
        });
      } else {
        this.pageParams.pageNo = 1;
      }
      this.setTableHeight();
      this.queryProvinceList();
      this.getClientStage();
      this.isRefresh();
      this.guideObj = {};
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
      stageValue(id, list) {
        const item = list.filter(item => item.stageId === id)[0];
        return (item && item.stageName) || '--';
      },
      filterFormatTime(date) {
        if (!date) return '';
        return datetime.format(new Date(date), 'YYYY-MM-DD HH:mm:ss');
      },
    },
    methods: {
      // 表格区域排序
      handleTableSortChange({ column, prop, order }) {
        console.log(prop, order);
        /**
         * 1-根据省顺序;2-根据省倒序;
         * 3-根据市顺序;4-根据市倒序;
         * 5-根据区顺序;6-根据区倒序;
         * 7-回访时间顺序;8-回访时间倒序;
         * 9-分配客服时间顺序;10-分配客服时间倒序;
         * 11-更新时间顺序;12-更新时间倒序;
         * 13-创建时间顺序;14-创建时间倒序;
         */
        const orderBy = {
          province_ascending: 1,
          province_descending: 2,
          city_ascending: 3,
          city_descending: 4,
          dialTime_ascending: 5,
          dialTime_descending: 6,
          returnVisitTime_ascending: 7,
          returnVisitTime_descending: 8,
          allotTime_ascending: 9,
          allotTime_descending: 10,
          updateTime_ascending: 11,
          updateTime_descending: 12,
          clientCreateTime_ascending: 13,
          clientCreateTime_descending: 14,
        };
        this.keyword.sortByTime = orderBy[prop + '_' + order] || null;
        console.log(this.keyword.sortByTime);
        this.onFilter();
      },
      // 查询客户阶段
      getClientStage() {
        api
          .getClientStage({
            queryAll: true,
          })
          .then(res => {
            this.stageList = res.data || [];
          });
      },

      // 点击搜索
      searchFilter() {
        this.onFilter();
      },

      isRefresh() {
        this.doSearch();
      },
      showInfo(user) {
        if (this.selectHeadTab !== 1 && !user.clientId) {
          this.$alert(
            '该客户暂未成为门店客户，状态为“愿意沟通“会同步至客户池，方可查看客户详情。',
            '该客户无客户详情',
            {
              showClose: true,
              customClass: 'telesales-alert',
              showConfirmButton: false,
              center: true,
            }
          );
        } else {
          this.$router.push({
            path: `${this.$route.path}/detail`,
            query: {
              id: user.clientId,
              memberId: user.memberId ? user.memberId : null,
              isRefresh: this.isRefresh,
              pageNo: this.pageParams.pageNo,
            },
          });
        }
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.doSearch();
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

      onFilterStore(storeId) {
        this.guideList = [];
        this.keyword.employeeId = null;
        if (storeId) {
          this.getGuideList(storeId);
        }

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
      onFilter() {
        this.pageParams.pageNo = 1;
        this.doSearch();
      },

      searchParams() {
        const params = {
          status: this.selectHeadTab,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          provinceId: this.area.province,
          cityId: this.area.city,
          districtId: this.area.district,
          keyword: this.keyword.keyword,
          storeId: this.selectHeadTab == 2 ? this.keyword.sourceStoreId : this.keyword.storeId,
          employeeId: this.keyword.employeeId,
          followInfo: this.keyword.followInfo,
          orderBy: this.keyword.sortByTime,
          sources: [],
          customerSources: [],
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

        // 拨打时间
        if (Array.isArray(this.keyword.dialTime) && this.keyword.dialTime.length > 0) {
          params.dialTimeStart = this.keyword.dialTime[0] + ' 00:00:00';
          params.dialTimeEnd = this.keyword.dialTime[1] + ' 23:59:59';
        }
        // 回访时间
        if (Array.isArray(this.keyword.returnVisitTime) && this.keyword.returnVisitTime.length > 0) {
          params.returnVisitTimeStart = this.keyword.returnVisitTime[0] + ' 00:00:00';
          params.returnVisitTimeEnd = this.keyword.returnVisitTime[1] + ' 23:59:59';
        }
        // 分配客服时间
        if (Array.isArray(this.keyword.allotTime) && this.keyword.allotTime.length > 0) {
          params.allotTimeStart = this.keyword.allotTime[0] + ' 00:00:00';
          params.allotTimeEnd = this.keyword.allotTime[1] + ' 23:59:59';
        }
        // 更新时间
        if (Array.isArray(this.keyword.updateTime) && this.keyword.updateTime.length > 0) {
          params.updateTimeStart = this.keyword.updateTime[0] + ' 00:00:00';
          params.updateTimeEnd = this.keyword.updateTime[1] + ' 23:59:59';
        }
        // 导入时间
        if (Array.isArray(this.keyword.importTime) && this.keyword.importTime.length > 0) {
          params.importTimeStart = this.keyword.importTime[0] + ' 00:00:00';
          params.importTimeEnd = this.keyword.importTime[1] + ' 23:59:59';
        }
        // 创建时间
        if (Array.isArray(this.keyword.createTime) && this.keyword.createTime.length > 0) {
          params.clientCreateTimeStart = this.keyword.createTime[0] + ' 00:00:00';
          params.clientCreateTimeEnd = this.keyword.createTime[1] + ' 23:59:59';
        }

        return params;
      },

      doSearch() {
        this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
        this.isLoading = true;
        api
          .getTelesaleList(this.searchParams())
          .then(res => {
            this.memberList = res.data || [];
            this.totalMemberCount = res.totalCount;
            this.mBuildMultipleTableSelection(this.memberList, 'telemarketingTable', unionKeys);
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.isLoading = false;
          });
      },

      // 根据门店id查询对应的导购
      getGuideList(storeId) {
        if (this.guideObj[storeId]) {
          this.guideList = this.guideObj[storeId];
          return;
        }

        services
          .get('/wp/client/guide/list', {
            action: '获取导购员列表',
            params: {
              storeId,
              queryAll: true,
              positionIds: 'common_role_storeKeeper,common_role_sales',
            },
          })
          .then(({ data }) => {
            this.guideList = data || [];
            if (!data) return;
            this.guideObj[storeId] = data;
          });
      },

      // 批量分配
      handleBatchAllocation() {
        if (this.multipleSelection && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需要批量分配的客户');
          return false;
        }

        this.dialog.openBatchShop = true;
      },
      // 关闭导购弹窗
      handleCloseShop() {
        this.dialog.openBatchShop = false;
        this.dialog.openShop = false;
        this.dialog.openGuides = false;
        this.dialog.openSyncTelemark = false;
        this.currentStoreId = null;
        this.guideForm = null;
        this.shopDataSource = [];
      },
      // 单条导购分配
      handleShowShopDialog(item) {
        this.guideForm = { ...item };
        this.currentStoreId = item.storeId;
        this.handleChangeStore(item.storeId);
        if (item.clientEmployeeBinds) {
          this.curClientEmployeeBinds = item.clientEmployeeBinds || [];
          this.dialog.openShop = true;
        } else {
          this.getTelesaleRecord(item, data => {
            this.curClientEmployeeBinds = data || [];
            this.$nextTick(() => {
              this.dialog.openShop = true;
            });
          });
        }
      },

      // 门店改变
      handleChangeStore(storeId) {
        this.shopDataSource = [];
        if (storeId) {
          this.getClientGuideList(storeId);
        }
      },

      // 查询导购
      getClientGuideList(storeId, dialog) {
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
            this.loading.guideLoading = false;
            this.shopDataSource = data || [];
            loading.close();
          })
          .catch(() => {
            this.loading.guideLoading = false;
            loading.close();
          });
      },

      // 分配导购
      handleShopGuide({ employeeId, storeId }) {
        this.saveBindClientSet({
          clientIds: this.guideForm.clientId,
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
        const clientIds = this.multipleSelection.map(item => {
          return item.clientId;
        });

        this.saveBindClientSet(
          {
            clientIds: clientIds.join(','),
            eventId: 'crm_corp_assign_clue',
            employeeIds: employeeIds.join(','),
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

      formatTime(row, column) {
        const date = row[column.property];
        if (date) {
          return datetime.format(new Date(date), 'YYYY-MM-DD HH:mm:ss');
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

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 选择省市区
      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
        // 避免还没赋值就调用
        this.$nextTick(() => {
          this.onFilter();
        });
      },

      handleExpandChange(row) {
        this.memberList.forEach(item => {
          if (item.id === row.id) {
            item.showExpand = !item.showExpand;
          }
        });
        if (!row.clientEmployeeBinds) {
          this.getTelesaleRecord(row);
        }
      },

      toggleExpand(row) {
        this.$refs.telemarketingTable.toggleRowExpansion(row);
      },

      // 查询电销记录
      getTelesaleRecord(row) {
        this.isLoading = true;
        api
          .getTelesaleRecord({
            clientId: row.clientId,
            telesalesId: row.id,
          })
          .then(({ data }) => {
            this.isLoading = false;

            this.memberList.forEach(item => {
              if (item.id === row.id) {
                item.clientEmployeeBinds = data || [];
              }
            });
          })
          .catch(() => {
            this.isLoading = false;
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

      setTableHeight() {
        const set = () => {
          const height = window.innerHeight - this.$refs.tableContent.offsetTop - 200;
          this.tableHeight = height > 180 ? height : 180;
        };
        setTimeout(set, 200);
        window.onresize = set;
      },
    },
    beforeDestroy() {
      this.guideObj = null;
    },
  };
</script>
<style lang="less" scoped>
  @import '../cue/index.less';

  .head-tab-container {
    background: #ffffff;
    color: #333333;
    padding: 17px 20px 10px 20px;
    box-sizing: border-box;
    font-weight: 400;
    border-bottom: 1px solid #dcdde0;
    display: flex;

    .head-tab-item {
      padding: 5px 9px;
      box-sizing: border-box;
      border-radius: 2px;
      margin-right: 10px;
      background: #f5f7fa;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 12px;
      color: #999;
      border: 1px solid transparent;
      list-style: none;
    }
    .head-tab-active {
      border: 1px solid #256eff;
      color: #256eff;
    }
  }
  .telemarketing-table .el-table__expand-icon i {
    /* display: none !important; */
    font-size: 0 !important;
  }
</style>
<style lang="less">
  .telesales-alert {
    .el-message-box__headerbtn {
      .el-message-box__close {
        display: inline-block;
      }
    }
  }
</style>
