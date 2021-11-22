<template>
  <div>
    <store-select @doSearch="getStoreId" @allLoading="allLoading" :store-id="storeId" />
    <el-form class="wkt-opt-label-container store-client-filter-box" inline label-suffix=" :" label-width="80px">
      <el-form-item label="客户区域">
        <area-select ref="areaSelect" class="area-select-wrap" @change="handleChangeArea" @clear="handleChangeArea" />
      </el-form-item>
      <el-form-item label="关键词">
        <search-input
          @search="onFilter"
          v-model.trim="keywords.name"
          :placeholder="'输入客户姓名/手机'"
          clearable
          :show-btn="false"
        />
      </el-form-item>
      <el-form-item label="导购信息">
        <el-select
          :loading="loading.guide"
          placeholder="全部导购"
          filterable
          clearable
          v-model="keywords.guideId"
          @change="onFilter"
        >
          <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in guideList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户阶段">
        <el-select
          :loading="loading.level"
          placeholder="全部客户阶段"
          filterable
          clearable
          v-model="keywords.stageId"
          @change="onFilter"
        >
          <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in stageList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小区信息">
        <el-select
          style="margin-right: auto"
          :loading="loading.plot"
          placeholder="全部小区"
          clearable
          filterable
          v-model="keywords.estateId"
          @change="onFilter"
        >
          <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in plotList"></el-option>
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
          v-model="keywords.source"
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
          v-model="keywords.createTime"
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
      <div class="btn-box">
        <el-button size="mini" class="btn-item" @click="handleClickMulti('move')" :disabled="loading.all"
          >批量移除客户
        </el-button>
        <el-button size="mini" class="btn-item" @click="handleClickMulti('export')" :disabled="loading.all"
          >批量导出
        </el-button>
        <el-button
          size="mini"
          class="btn-item"
          type="primary"
          :disabled="addDisabled || loading.all"
          @click="dialog.client = true"
          >添加客户
        </el-button>
      </div>
    </el-form>
    <div class="list-content" v-loading="loading.all" ref="tableContent">
      <el-table
        :data="tableList"
        stripe
        :max-height="tableHeight"
        @row-dblclick="showDetail"
        class="wkt-table"
        ref="storeTable"
        @selection-change="handleSelectionChange"
        @sort-change="handleTableSortChange"
      >
        <el-table-column type="selection" v-if="multiple" width="55"> </el-table-column>
        <el-table-column prop="id" label="序号" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="source" label="客户来源" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.sourceList | source }}
          </template>
        </el-table-column>
        <el-table-column prop="estateName" label="小区名称" min-width="100"> </el-table-column>
        <el-table-column label="省" prop="province" show-overflow-tooltip sortable="custom"> </el-table-column>
        <el-table-column prop="city" label="市" sortable="custom"> </el-table-column>
        <!-- <el-table-column prop="district"
                         label="区" sortable="custom">
        </el-table-column> -->
        <el-table-column prop="realName" label="客户姓名" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <a href="javascript:;" @click="showDetail(scope.row)">{{ scope.row.realName || scope.row.nickName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机" width="125"> </el-table-column>
        <el-table-column prop="nickName" label="微信头像/昵称" width="180" show-overflow-tooltip>
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
        <el-table-column prop="clientEmployeeBinds" label="客户阶段" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.clientEmployeeBinds | formatClientStage }}
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="归属门店" min-width="100"> </el-table-column>
        <el-table-column prop="bindEmployeeName" label="归属导购" min-width="100"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.createTime | time }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <a href="javascript:;" @click="turnOverGuide(scope.row)">移交导购</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="page.totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[10, 20, 50, 100, 200]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      >
      </el-pagination>
    </div>
    <!-- 添加客户dialog -->
    <add-client-dialog
      :do-search="fetchData"
      :visible.sync="dialog.client"
      :store-id="storeId"
      :source-list="custormerClientSource"
      :guide-list="guideList"
      :plot-list="plotList"
    >
    </add-client-dialog>
    <!-- 移交导购操作框 -->
    <bind-info-dialog
      :is-refresh="fetchData"
      :visible.sync="dialog.guide"
      :store-id="storeId"
      :client-ids="paramsClientId"
      :event-id="'crm_corp_hand_over_client'"
      :title="'移交导购'"
    >
    </bind-info-dialog>
    <!-- 批量导出提示框 -->
    <el-dialog title="温馨提示" :visible.sync="dialog.tip" width="500px">
      <span style="font-size: 14px">客户信息正在导出，请稍等...</span>
    </el-dialog>
  </div>
</template>
<script>
  import services from '@/dss-common/utils/services';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import avatar from '@/dss-common/img/default-avatar.png';

  import api from '@/mod-member/src/api/manage-store';
  import manageApi from '@/mod-member/src/api/manage';
  import SearchInput from '@/mod-member/src/components/search-input';

  import AreaSelect from '../../components/AreaSelect';
  import StoreSelect from '../components/store-select';
  import BindInfoDialog from '../components/bind-info-dialog';
  import AddClientDialog from '../components/add-client-dialog';

  const unionKeys = ['id'];
  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      AreaSelect,
      SearchInput,
      StoreSelect,
      BindInfoDialog,
      AddClientDialog,
    },
    data() {
      return {
        avatar,
        page: {
          pageNo: 1,
          pageSize: 50,
          totalCount: null,
        },
        loading: {
          list: false,
          level: false,
          guide: false,
          plot: false,
          form: false,
          all: true,
        },
        keywords: {
          name: null,
          guideId: null,
          estateId: null,
          provinceId: null,
          cityId: null,
          districtId: null,
          source: [],
          stageId: null,
          sortByTime: null, // 1-根据创建时间排序;2-根据更新时间排序;3-根据省市区顺序;4-根据省市区倒序 不传默然按ID排序
          createTime: null,
        },
        dialog: {
          tip: false,
          client: false,
          guide: false,
        },
        tableList: [],
        plotList: [],
        guideList: [],
        stageList: [],
        addDisabled: false,
        rules: {
          bindEmployeeId: [{ required: true, message: '请选择导购', trigger: 'blur' }],
        },
        form: {
          bindEmployeeId: null,
        },
        // 获取门店id
        storeId: null,

        // 移交导购弹框params
        paramsClientId: null,

        multiple: false,
        multipleSelection: [],
        area: {
          province: null,
          city: null,
          district: null,
        },
        tableHeight: 0,

        isChangeSource: false, // 是否改变客户来源筛选
      };
    },
    computed: {
      // 客户来源
      channelsList() {
        return this.$store.state.dmp.clientSourceList;
      },
      // 自定义客户来源
      custormerClientSource() {
        return this.$store.state.dmp.custormerClientSource;
      },
    },
    watch: {
      'dialog.guide': {
        handler() {
          if (this.$refs.Form) {
            this.$refs.Form.resetFields();
          }
        },
      },
    },
    beforeRouteEnter(to, from, next) {
      let isUpdate = false;
      if (from.path === '/manage/store/store-client/detail') {
        isUpdate = !!from.meta.isUpdate;
        from.meta.isUpdate = false;
      }
      next(vm => {
        if (isUpdate) {
          vm.fetchData();
        }
      });
    },
    activated() {
      if (this.$route.query.storeId) {
        this.storeId = Number(this.$route.query.storeId);
      }
    },

    filters: {
      source(row) {
        if (row && row.length) {
          return row.map(item => item.name).join(',');
        }
      },
      formatClientStage(clientEmployeeBinds) {
        if (clientEmployeeBinds && clientEmployeeBinds.length) {
          return clientEmployeeBinds[0].stageName;
        } else {
          return '';
        }
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
        this.keywords.sortByTime = orderBy[prop + '_' + order] || null;
        this.onFilter();
      },
      async fetchData() {
        this.mUpdateTotalListBySelection(this.tableList, this.multipleSelection, unionKeys);
        this.loading.all = true;
        try {
          const { data, totalCount } = await api.queryClientCue(this.searchParams());
          this.tableList = (data || []).map(item => {
            const storeName = [];
            const employeeNames = [];
            (item.clientEmployeeBinds || []).forEach(item => {
              employeeNames.push(item.employeeName);
              storeName.push(item.storeName);
            });
            return { ...item, storeName: storeName.join('、'), bindEmployeeName: employeeNames.join('、') };
          });
          this.page.totalCount = totalCount;
          this.mBuildMultipleTableSelection(this.tableList, 'storeTable', unionKeys);
        } catch (e) {
          console.error(e);
        } finally {
          this.allLoading(false);
        }
      },
      async getGuideList() {
        this.loading.guide = true;
        const params = {
          queryAll: true,
          storeId: this.storeId,
          positionIds: 'common_role_storeKeeper,common_role_sales',
        };
        try {
          const { data } = await api.queryGuideList(params);
          this.guideList = (data || []).map(item => {
            return {
              id: item.id,
              name: item.name,
            };
          });
        } catch (e) {
          console.error(e);
        } finally {
          this.loading.guide = false;
        }
      },
      async getClientStage() {
        const { data } = await manageApi.getClientStage({ queryAll: true });
        this.stageList = (data || []).map(item => {
          return {
            value: item.stageId,
            name: item.stageName,
          };
        });
      },
      async getEstateList() {
        const query = JSON.parse(JSON.stringify(this.$route.query));
        this.loading.plot = true;
        try {
          const { data } = await api.queryEstateList({ storeId: this.storeId });
          this.plotList = data || [];
          if (query.estate) {
            this.keywords.estateId = Number(query.estate);
          }
          query.estate = null;
          this.$router.push({ path: this.$route.path, query });
        } catch (e) {
          console.error(e);
        } finally {
          this.loading.plot = false;
        }
      },

      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
        this.keywords.provinceId = this.area.province;
        this.keywords.districtId = this.area.district;
        this.keywords.cityId = this.area.city;
        this.fetchData();
      },

      turnOverGuide(row) {
        this.paramsClientId = String(row.id);
        this.dialog.guide = true;
      },

      showDetail(row) {
        this.$router.push({
          path: '/manage/store/store-client/detail',
          query: {
            id: row.id,
            memberId: row.memberId ? row.memberId : null,
            isRefresh: this.fetchData,
          },
        });
      },

      searchParams() {
        const { provinceId, cityId, districtId, stageId, estateId, sortByTime, source, createTime } = this.keywords;
        const params = {
          sortByTime,
          status: 3,
          estateId,
          cityId,
          provinceId,
          districtId,
          stageId,
          storeId: this.storeId,
          keyword: this.keywords.name,
          pageSize: this.page.pageSize,
          bindEmployeeIds: this.keywords.guideId,
          pageNo: this.tableList.length === 1 && this.page.pageNo != 1 ? this.page.pageNo - 1 : this.page.pageNo,
          sources: [],
          customerSources: [],
          createTimeStart: createTime && createTime[0] + ' 00:00:00',
          createTimeEnd: createTime && createTime[1] + ' 23:59:59',
          isPc: true,
        };
        // 客户来源区分, 系统:0  自定义:1
        if (source.length) {
          source.forEach(item => {
            const currentSource = this.channelsList[item];
            params[currentSource.type == 0 ? 'sources' : 'customerSources'].push(currentSource.id);
          });
        }
        params.sources = params.sources.join(',') || null;
        params.customerSources = params.customerSources.join(',') || null;
        return params;
      },

      handleClickMulti(action) {
        if (this.multipleSelection && this.multipleSelection.length) {
          this.mUpdateTotalListBySelection(this.tableList, this.multipleSelection, unionKeys);
          const list = this.mTotalCheckedList.map(item => {
            return item.id;
          });
          const ids = list.join(',');
          if (action == 'move') {
            this.handleMove(ids);
          } else {
            this.handleExport({ ...this.searchParams(), ...{ ids } });
          }
        } else {
          this.multiple = !this.multiple;
        }
      },

      handleMove(ids) {
        this.$confirm('选中客户将从当前门店移除，且解除与归属导购的绑定关系 ', '移除客户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          const params = { storeId: this.storeId };
          let key = 'clientId';
          let url = api.removeBinding.url;
          if (ids.includes(',')) {
            url = api.batchRemoveBinding.url;
            key = 'clientIds';
          }
          params[key] = ids;
          services
            .post(url, params, { action: '移除绑定关系' })
            .then(({ data }) => {
              const message = typeof data === 'number' ? `批量操作移除客户${data}条` : '移除客户成功';
              this.$message.success(message);
              this.initSelection();
            })
            .catch(res => {
              this.$message.error(res.errorMessage);
            })
            .finally(_ => {
              this.fetchData();
            });
        });
      },

      handleExport(params) {
        this.$confirm(`确定批量导出过滤后的客户信息吗？ `, '批量导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          this.dialog.tip = true;
          exportExcel
            .getDownload(api.export, params)
            .then(res => {
              this.initSelection();
            })
            .always(() => {
              this.dialog.tip = false;
            });
        });
      },

      initSelection() {
        this.$refs.storeTable.clearSelection();
        this.mUpdateTotalListBySelection(this.tableList, this.multipleSelection, unionKeys);
        this.multiple = false;
      },

      setTableHeight() {
        const set = () => {
          const height = window.innerHeight - this.$refs.tableContent.offsetTop - 200;
          this.tableHeight = height > 180 ? height : 180;
        };
        setTimeout(set, 200);
        window.onresize = set;
      },

      async getStoreId(val) {
        this.storeId = val.storeId;
        await this.doRefresh();
      },

      async doRefresh() {
        // 切换门店重置筛选项
        if (this.keywords.provinceId) {
          this.$refs.areaSelect.clear();
        }
        for (const item in this.keywords) {
          this.keywords[item] = null;
        }
        this.keywords.source = [];
        if (!this.storeId) return;
        await this.getEstateList();
        await this.getGuideList();
        await this.onFilter();
      },

      allLoading(val) {
        this.loading.all = val;
        this.addDisabled = val;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onFilter() {
        (this.page.pageNo = 1), this.fetchData();
      },
      onFilterSources(show) {
        if (!show && this.isChangeSource) {
          this.isChangeSource = false;
          this.page.pageNo = 1;
          this.fetchData();
        }
      },
      onPageChange(page) {
        this.page.pageNo = page;
        this.fetchData();
      },
      onSizeChange(size) {
        this.page.pageSize = size;
        this.page.pageNo = 1;
        this.fetchData();
      },
    },
    mounted() {
      this.setTableHeight();
      this.getClientStage();
    },
  };
</script>
<style lang="less" scoped>
  @import '../index';
</style>
