<template>
  <div>
    <store-select @doSearch="getStoreId" @allLoading="allLoading" />
    <el-form class="wkt-opt-label-container store-client-filter-box" inline label-suffix=" :" label-width="80px">
      <el-form-item label="小区区域">
        <area-select ref="areaSelect" @change="handleChangeArea" @clear="handleChangeArea" :area="area" />
      </el-form-item>
      <el-form-item label="关键词">
        <search-input
          @search="onSearch"
          v-model.trim="keywords.estateName"
          :placeholder="'输入小区名称'"
          :show-btn="false"
        />
      </el-form-item>
      <div class="btn-box">
        <el-button
          size="mini"
          v-if="isAddEstate"
          class="btn-item"
          type="primary"
          :disabled="addDisabled || loading.all"
          @click="$router.push(`/manage/store/house-detail?storeId=${storeId}&dealerId=${identityId}`)"
          >新增小区
        </el-button>
      </div>
    </el-form>
    <div class="list-content" v-loading="loading.all" ref="tableContent">
      <el-table :data="tableData" :max-height="tableHeight" class="wkt-table">
        <el-table-column prop="name" min-width="100" label="小区名称" show-overflow-tooltip> </el-table-column>
        <el-table-column label="小区栋数" min-width="100" prop="blockCount"> </el-table-column>

        <el-table-column label="小区层数" min-width="100" prop="floorCount"> </el-table-column>
        <el-table-column label="小区户数" min-width="100" prop="houseCount"> </el-table-column>
        <el-table-column label="客资数" prop="clientCount" :formatter="formatClientCount"> </el-table-column>
        <el-table-column label="小区区域" prop="areas" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.district }}
          </template>
        </el-table-column>
        <el-table-column label="交房日期" prop="deliveryDate" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.deliveryDate | time }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUserName" min-width="100" show-overflow-tooltip />
        <el-table-column label="归属门店" prop="storeName" min-width="100" />
        <el-table-column label="操作" fixed="right" width="320">
          <template slot-scope="scope">
            <a href="javascript:;" @click="$router.push(`/manage/store/house-detail?id=${scope.row.id}`)">编辑</a>
            <a href="javascript:;" @click="openUpload(scope.row)">导入客户</a>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"> 客户明细<i class="el-icon-arrow-down el-icon--right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="
                    $router.push(
                      `/manage/store/store-client?storeId=${scope.row.storeId}&estate=${scope.row.id}&dealerId=${
                        scope.row.dealerId || ''
                      }`
                    )
                  "
                  >门店客户（{{ scope.row.clientNum }}）</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="
                    $router.push(
                      `/manage/store/store-cue?storeId=${scope.row.storeId}&estate=${scope.row.id}&dealerId=${
                        scope.row.dealerId || ''
                      }`
                    )
                  "
                  >门店线索（{{ scope.row.clueNum }}）</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button href="javascript:;" type="text" :disabled="!scope.row.clueNum" @click="allotCue(scope.row)"
              >批量分配</el-button
            >
            <a href="javascript:;" @click="delCue(scope.row)">删除</a>
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
      :params="upLoadParams"
      @upload-success="onUploadSuccess"
      :template-down-url="templateDownUrl"
      :upload-server-url="uploadServerUrl"
      :template-desc="'您可以下载我们提供的模版，批量上传线索信息。 模版下载'"
    >
    </upload>
    <!-- 批量分配线索 -->
    <batch-allot-dialog
      :estate-id="estateId"
      :store-id="storeId"
      @showTipDialog="showTip"
      :is-refresh="fetchData"
      v-if="dialog.cue"
      :clue-num="clueNum"
      :visible.sync="dialog.cue"
    >
    </batch-allot-dialog>
    <!-- 批量导入提示框 -->
    <el-dialog title="温馨提示" :visible.sync="dialog.tip" width="500px">
      <div style="font-size: 14px; padding: 40px 20px">{{ tip }}</div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import Upload from '@/dss-common/components/upload/index.vue';
  import api from '@/mod-member/src/api/manage-store.js';
  import SearchInput from '@/mod-member/src/components/search-input';
  import AreaSelect from '../../components/AreaSelect';
  import StoreSelect from '../components/store-select';
  import BatchAllotDialog from '../components/batch-allot-dialog';

  export default {
    components: {
      Upload,
      AreaSelect,
      SearchInput,
      StoreSelect,
      BatchAllotDialog,
    },
    data() {
      return {
        // 模板下载地址
        templateDownUrl: 'https://front-end-1259575047.file.myqcloud.com/dmp/小区客户导入.xlsx',
        // 模板上传接口
        uploadServerUrl: '/wp/housing/estate/clue/import',
        district: [],
        tip: null,
        area: {
          province: null,
          city: null,
          district: null,
        },
        keywords: {
          cityId: null,
          districtId: null,
          provinceId: null,
          estateName: null,
        },
        estateId: null, // 小区id
        tableData: [],
        dialog: {
          upload: null,
          cue: null,
          tip: false,
        },
        page: {
          pageNo: 1,
          pageSize: 50,
          totalCount: null,
        },
        loading: {
          all: false,
        },
        upLoadParams: null,
        storeId: null,
        identityId: null,
        addDisabled: false,
        clueNum: null,
        tableHeight: 0,
      };
    },
    activated() {
      // 新增/编辑操作之后刷新列表信息
      if (this.$route.query.edit) {
        this.doRefresh();
      }
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),
      // 店长 经销商 区管 企管可新增小区
      isAddEstate() {
        const idenity = [
          'common_role_storeKeeper',
          'common_role_dealer_manager',
          'common_role_enterprise',
          'common_role_area_manager',
        ];
        return idenity.includes(this.userInfo.roleList);
      },
    },
    methods: {
      showTip(e) {
        this.tip = e;
        this.dialog.tip = true;
      },
      async fetchData() {
        const { provinceId, cityId, districtId, estateName } = this.keywords;
        this.loading.all = true;
        const params = {
          cityId,
          provinceId,
          districtId,
          estateName,
          storeId: this.storeId,
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
        };
        try {
          const { data, totalCount } = await api.queryEstateList(params);
          this.tableData = data || [];

          this.page.totalCount = totalCount;
        } catch (e) {
          console.log(e);
        } finally {
          this.allLoading(false);
        }
      },

      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
        this.keywords.cityId = this.area.city;
        this.keywords.districtId = this.area.district;
        this.keywords.provinceId = this.area.province;
        this.fetchData();
      },

      delCue(row) {
        this.$confirm('若删除小区，小区线索也会同步删除，不可恢复，已成为客户的客户仍保留在客户池。 ', '删除小区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          api
            .delEstate({ estateId: row.id })
            .then(() => {
              this.$message({ message: '删除成功', type: 'success' });
            })
            .catch(res => {
              this.$message.error(res.errorMessage);
            })
            .finally(_ => {
              this.fetchData();
            });
        });
      },

      setTableHeight() {
        const set = () => {
          const height = window.innerHeight - this.$refs.tableContent.offsetTop - 200;
          this.tableHeight = height > 180 ? height : 180;
        };
        setTimeout(set, 200);
        window.onresize = set;
      },

      formatClientCount(row, column) {
        return row.clientNum + row.clueNum;
      },

      async getStoreId(val) {
        this.storeId = val.storeId;
        this.identityId = val.identityId;
        await this.doRefresh();
      },
      async doRefresh() {
        for (const item in this.keywords) {
          this.keywords[item] = null;
        }
        this.$refs.areaSelect.clear();
      },

      allLoading(val) {
        this.loading.all = val;
        this.addDisabled = val;
      },
      allotCue(row) {
        this.clueNum = row.clueNum;
        this.estateId = row.id;
        this.dialog.cue = true;
      },
      openUpload(row) {
        this.upLoadParams = {
          estateId: row.id,
        };
        this.dialog.upload = true;
      },
      onUploadSuccess() {
        this.onPageChange(1);
      },
      onSearch() {
        (this.page.pageNo = 1), this.fetchData();
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
  .header-filter {
    padding: 0 20px;
    background: #f5f7fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 120px;
  }
  .filter-item {
    margin-right: auto;
    margin-left: 20px;
  }
  .list-content {
    padding: 0 20px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #256eff;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    display: none;
  }
  .el-button.is-disabled {
    background: none;
    color: #cdcdcd;
    border: 0;
  }
  .el-button.is-disabled:hover {
    background: none;
    color: #cdcdcd;
    border: none;
  }
</style>
