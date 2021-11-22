<template>
  <div>
    <store-select @doSearch="getStoreId" @allLoading="allLoading" />
    <el-form class="wkt-opt-label-container store-client-filter-box" inline label-suffix=" :" label-width="80px">
      <el-form-item label="客户区域">
        <area-select ref="areaSelect" class="area-select-wrap" @change="handleChangeArea" @clear="handleChangeArea" />
      </el-form-item>
      <el-form-item label="关键词">
        <search-input
          @search="onFilter"
          v-model.trim="keywords.keyword"
          :placeholder="'输入客户姓名/手机'"
          :show-btn="false"
        />
      </el-form-item>
      <el-form-item label="跟进情况">
        <el-select placeholder="跟进情况" clearable filterable v-model="keywords.followInfo" @change="onFilter">
          <el-option
            :key="item.value"
            :label="item.name"
            :value="item.value"
            v-for="item in followInfoList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小区信息">
        <el-select
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
      <el-form-item label="APP跟进">
        <el-select
          style="margin-right: auto"
          placeholder="APP跟进情况"
          clearable
          styele
          v-model="keywords.appFollowInfo"
          @change="onFilter"
        >
          <el-option
            :key="item.value"
            :label="item.name"
            :value="item.value"
            v-for="item in appFollowInfoList"
          ></el-option>
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
        <el-button size="mini" class="btn-item" @click="importMulti" :disabled="loading.all">批量导入 </el-button>
        <el-button size="mini" class="btn-item" @click="handleClickMulti('export')" :disabled="loading.all"
          >批量导出
        </el-button>
        <el-button size="mini" class="btn-item" @click="handleClickMulti('allot')" :disabled="loading.all"
          >批量分配
        </el-button>
        <el-button size="mini" class="btn-item" type="primary" :disabled="addDisabled || loading.all" @click="addCue"
          >添加线索
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
        <el-table-column prop="id" label="序号" width="90"> </el-table-column>
        <el-table-column prop="source" label="客户来源" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.sourceList | source }}
          </template>
        </el-table-column>
        <el-table-column prop="estateName" label="小区名称" min-width="100"> </el-table-column>
        <el-table-column label="省" prop="province" show-overflow-tooltip sortable="custom" width="80">
        </el-table-column>
        <el-table-column prop="city" label="市" sortable="custom" width="80"> </el-table-column>
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
        <el-table-column prop="appFollowInfo" label="APP跟进情况" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.appFollowInfo | formatFollowInfo }}
          </template>
        </el-table-column>
        <el-table-column prop="followInfo" label="跟进情况" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.followInfo | formatFollowInfo }}
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="归属门店" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.createTime | time }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <a href="javascript:;" @click="batchCues(scope.row)">分配</a>
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
    <!--批量导入-->
    <upload
      :visible.sync="dialog.upload"
      :title="'线索导入'"
      @upload-success="onUploadSuccess"
      :template-down-url="templateDownUrl"
      :upload-server-url="uploadServerUrl"
      :params="uploadImportParams"
      :template-desc="'您可以下载我们提供的模版，批量上传线索信息。 模版下载'"
    >
    </upload>
    <!-- 添加线索 -->
    <add-client-dialog
      :is-cue="true"
      ref="cueEditorDialog"
      :do-search="fetchData"
      :title="'新增线索'"
      :visible.sync="dialog.add_cue"
      :store-id="storeId"
      :source-list="custormerClientSource"
      :plot-list="plotList"
    >
    </add-client-dialog>
    <!-- 分配线索dialog -->
    <bind-info-dialog
      :is-refresh="fetchData"
      :visible.sync="dialog.batch_cue"
      :store-id="storeId"
      :client-ids="paramsClientId"
      :title="'分配线索'"
    >
    </bind-info-dialog>
    <!-- 添加电销提示框 -->
    <el-dialog title="添加至电销失败" :visible.sync="dialog.errorTip" width="400px" center>
      <div class="tip-content">该客户已同步至电销列表，无需再次添加</div>
    </el-dialog>
    <!-- 批量导入提示框 -->
    <el-dialog title="温馨提示" :visible.sync="dialog.exportTip" width="500px">
      <span style="font-size: 14px">客户信息正在导出，请稍等...</span>
    </el-dialog>
  </div>
</template>
<script>
  import exportExcel from '@/dss-common/utils/exportExcel';
  import services from '@/dss-common/utils/services';
  import Upload from '@/dss-common/components/upload/index.vue';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import avatar from '@/dss-common/img/default-avatar.png';

  import SearchInput from '@/mod-member/src/components/search-input';
  import api from '@/mod-member/src/api/manage-store';
  import followInfoEnum from '@/mod-member/src/enum/followInfoEnum';

  import AreaSelect from '../../components/AreaSelect';
  import BindInfoDialog from '../components/bind-info-dialog';
  import AddClientDialog from '../components/add-client-dialog';
  import StoreSelect from '../components/store-select';

  const unionKeys = ['id'];
  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      Upload,
      AreaSelect,
      SearchInput,
      StoreSelect,
      BindInfoDialog,
      AddClientDialog,
    },
    data() {
      return {
        avatar,
        // 模板下载地址
        templateDownUrl: 'https://front-end-1259575047.file.myqcloud.com/dmp/客户线索导入.xlsx',
        // 模板上传接口
        uploadServerUrl: '/wp/client/info/import/clue',
        // 模板上传需要携带门店id
        uploadImportParams: {
          storeId: null,
        },
        page: {
          pageNo: 1,
          pageSize: 50,
          totalCount: null,
        },
        loading: {
          state: false,
          guide: false,
          plot: false,
          all: false,
        },
        keywords: {
          keyword: null,
          estateId: null,
          followInfo: null,
          appFollowInfo: null,
          guideId: null,
          provinceId: null,
          cityId: null,
          districtId: null,
          source: [],
          sortByTime: null, // 1-根据创建时间排序;2-根据更新时间排序;3-根据省市区顺序;4-根据省市区倒序 不传默然按ID排序
          createTime: null,
        },
        area: {
          province: null,
          city: null,
          district: null,
        },
        dialog: {
          tip: false,
          upload: false,
          exportTip: false,
          errorTip: false,
          batch_cue: false,
          add_cue: false,
        },
        tableHeight: 0,
        plotList: [],
        tableList: [],
        multiple: false,
        multipleSelection: [],
        addDisabled: false,
        storeId: null,
        // 分配线索弹框参数
        paramsClientId: null,
        followInfoList: followInfoEnum.infoList,
        appFollowInfoList: followInfoEnum.infoList,

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
      'dialog.batch_cue': {
        handler() {
          if (this.$refs.Form) {
            this.$refs.Form.resetFields();
          }
        },
      },
      storeId(newVal) {
        this.uploadImportParams.storeId = newVal;
      },
    },
    filters: {
      source(row) {
        if (row && row.length) {
          return row.map(item => item.name).join(',');
        }
      },
      formatFollowInfo(followId) {
        if (followId != null) {
          const followItem = followInfoEnum.infoList.find(item => item.value == followId);
          return followItem ? followItem.name : '';
        }
      },
    },
    beforeRouteEnter(to, from, next) {
      let isUpdate = false;
      if (from.path === '/manage/store/store-cue/detail') {
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
            (item.clientEmployeeBinds || []).forEach(item => {
              storeName.push(item.storeName);
            });
            return { ...item, storeName: storeName.join('、') };
          });
          this.page.totalCount = totalCount;
          this.mBuildMultipleTableSelection(this.tableList, 'storeTable', unionKeys);
        } catch (e) {
          console.error(e);
        } finally {
          this.allLoading(false);
        }
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
      handleMove(ids) {
        this.$confirm('选中客户将从当前门店移除 ', '移除客户', {
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
              const message = typeof data === 'number' ? `成功移除客户${data}条` : '移除客户成功';
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
      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
        this.keywords.provinceId = this.area.province;
        this.keywords.districtId = this.area.district;
        this.keywords.cityId = this.area.city;
        this.fetchData();
      },
      // 批量导出
      handleClickMulti(action) {
        if (this.multipleSelection && this.multipleSelection.length) {
          this.mUpdateTotalListBySelection(this.tableList, this.multipleSelection, unionKeys);
          const list = this.mTotalCheckedList.map(item => {
            return item.id;
          });
          const ids = list.join(',');
          switch (action) {
            case 'move':
              this.handleMove(ids);
              break;
            case 'allot':
              this.paramsClientId = this.multipleSelection.map(item => item.id).join(',');
              this.dialog.batch_cue = true;
              break;
            case 'export':
              this.handleExport({ ...this.searchParams(), ...{ ids } });
              break;
          }
        } else {
          this.multiple = !this.multiple;
        }
      },
      // 分配线索
      batchCues(row) {
        this.paramsClientId = String(row.id);
        this.dialog.batch_cue = true;
      },
      // 新增线索
      addCue() {
        this.dialog.add_cue = true;
        this.editorTitle = '新增线索';
      },
      // 关闭新增线索弹框
      onCloseCueEditor() {},
      onCueClose() {
        this.dialog.add_cue = false;
      },
      onMemberEditorClose() {
        this.dialog.add_cue = false;
        this.doSearch();
      },
      // 跳转详情
      showDetail(row) {
        this.$router.push({
          path: '/manage/store/store-cue/detail',
          query: {
            id: row.id,
            memberId: row.memberId ? row.memberId : null,
            isRefresh: this.fetchData,
          },
        });
      },

      handleExport(params) {
        this.$confirm(`确定批量导出过滤后的客户信息吗？ `, '批量导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          this.dialog.exportTip = true;
          exportExcel
            .getDownload(api.export, params)
            .then(res => {
              this.initSelection();
            })
            .always(() => {
              this.dialog.exportTip = false;
            });
        });
      },

      searchParams() {
        const {
          keyword,
          estateId,
          provinceId,
          cityId,
          districtId,
          followInfo,
          sortByTime,
          appFollowInfo,
          createTime,
        } = this.keywords;
        const params = {
          sortByTime,
          cityId,
          keyword,
          estateId,
          status: 2,
          provinceId,
          districtId,
          followInfo,
          appFollowInfo,
          storeId: this.storeId,
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          sources: [],
          customerSources: [],
          createTimeStart: createTime && createTime[0] + ' 00:00:00',
          createTimeEnd: createTime && createTime[1] + ' 23:59:59',
          isPc: true,
        };
        // 客户来源区分, 系统:0  自定义:1
        if (this.keywords.source.length) {
          this.keywords.source.forEach(item => {
            const currentSource = this.channelsList[item];
            params[currentSource.type == 0 ? 'sources' : 'customerSources'].push(currentSource.id);
          });
        }
        params.sources = params.sources.join(',') || null;
        params.customerSources = params.customerSources.join(',') || null;
        return params;
      },

      async getStoreId(val) {
        this.storeId = val.storeId;
        await this.doRefresh();
      },

      async doRefresh() {
        // 切换门店重置搜索项
        if (this.keywords.provinceId) {
          this.$refs.areaSelect.clear();
        }
        for (const item in this.keywords) {
          this.keywords[item] = null;
        }
        this.keywords.source = [];
        await this.getEstateList();
        await this.fetchData();
      },
      allLoading(val) {
        this.loading.all = val;
        this.addDisabled = val;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      setTableHeight() {
        const set = () => {
          const height = window.innerHeight - this.$refs.tableContent.offsetTop - 200;
          this.tableHeight = height > 180 ? height : 180;
        };
        setTimeout(set, 200);
        window.onresize = set;
      },

      initSelection() {
        this.$refs.storeTable.clearSelection();
        this.mUpdateTotalListBySelection(this.tableList, this.multipleSelection, unionKeys);
        this.multiple = false;
      },

      importMulti() {
        this.dialog.upload = true;
      },
      onUploadSuccess() {
        this.onPageChange(1);
      },
      onFilter() {
        this.page.pageNo = 1;
        this.fetchData();
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
    },
  };
</script>
<style lang="less" scoped>
  @import '../index';
  .tip-content {
    text-align: center;
    height: 80px;
    line-height: 50px;
  }
</style>
