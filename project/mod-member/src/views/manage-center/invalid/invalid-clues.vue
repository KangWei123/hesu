<template>
  <div class="cue-list-container">
    <el-form class="wkt-opt-label-container cue-list-filter-box" :inline="true" label-suffix=" :" label-width="80px">
      <el-form-item label="客户区域">
        <area-select @change="handleChangeArea" @clear="handleChangeArea" />
      </el-form-item>

      <el-form-item label="关键词">
        <search-input
          @search="onFilter"
          v-model.trim="keyword.keyword"
          :placeholder="'输入客户姓名/手机'"
          clearable
          :show-btn="false"
        />
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
    </el-form>

    <div style="text-align: right; background: #f5f7fa; padding: 0 30px 20px">
      <el-button size="mini" round type="primary" @click="deleteBatchClientInfo">批量删除</el-button>
    </div>

    <div class="cue-list-content" ref="tableContent">
      <el-table
        :max-height="tableHeight"
        :data="memberList"
        stripe
        v-loading="isLoading"
        class="wkt-table"
        ref="memberTable"
        @selection-change="handleSelectionChange"
        @sort-change="handleTableSortChange"
        @row-dblclick="showInfo"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="60" label="序号"></el-table-column>

        <el-table-column label="客户来源" prop="sourceList" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sourceList | filterSource }}</span>
          </template>
        </el-table-column>

        <el-table-column label="省" prop="province" width="90" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.province }}</span>
          </template>
        </el-table-column>

        <el-table-column label="市" prop="city" width="90" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.city }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="realName" label="客户姓名" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <a href="javascript:;" @click="showInfo(scope.row)">{{ scope.row.realName || scope.row.nickName }}</a>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="手机号" min-width="150" show-overflow-tooltip></el-table-column>

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

        <el-table-column
          prop="followInfo"
          label="跟进情况"
          min-width="100"
          :formatter="formatFollowInfo"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column prop="storeName" label="无效原因" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="formatTime"
          label="创建时间"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <a href="javascript:;" @click="handleRestore(scope.row)">恢复</a>
            <a href="javascript:;" @click="deleteClientInfo(scope.row)">删除</a>
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
  </div>
</template>

<script>
  import datetime from '@/dss-common/utils/date';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import avatar from '@/dss-common/img/default-avatar.png';
  import api from '@/mod-member/src/api/manage';
  import followInfoEnum from '@/mod-member/src/enum/followInfoEnum';
  import SearchInput from '@/mod-member/src/components/search-input';
  import AreaSelect from '../components/AreaSelect';

  const unionKeys = ['id'];
  export default {
    name: 'Memberlist',
    mixins: [tableCheckedHelperMixin],
    components: { AreaSelect, SearchInput },
    data() {
      return {
        avatar,
        tableHeight: 0,
        isHandBack: false,
        multiple: false,
        keyword: {
          keyword: null,
          source: [],
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
        multipleSelection: [],
        isLoading: false,
        followInfoList: followInfoEnum.infoList,

        isChangeSource: false, // 是否改变客户来源筛选
      };
    },
    beforeRouteEnter(to, from, next) {
      let isUpdate = false;
      if (from.path === '/manage/invalid-cue/detail') {
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
      // 客户来源
      channelsList() {
        return this.$store.state.dmp.clientSourceList;
      },
    },
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
      this.isRefresh();
    },
    filters: {
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
      // 点击搜索
      searchFilter() {
        this.onFilter();
      },

      isRefresh() {
        this.doSearch();
      },
      showInfo(user) {
        this.$router.push({
          path: '/manage/invalid-cue/detail',
          query: {
            id: user.id,
            memberId: user.memberId ? user.memberId : null,
            isRefresh: this.isRefresh,
            pageNo: this.pageParams.pageNo,
          },
        });
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
          status: 10, // 无效客户
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          provinceId: this.area.province,
          cityId: this.area.city,
          districtId: this.area.district,
          keyword: this.keyword.keyword,
          sortByTime: this.keyword.sortByTime,
          sources: [],
          customerSources: [],
          createTimeStart: this.keyword.createTime && this.keyword.createTime[0] + ' 00:00:00',
          createTimeEnd: this.keyword.createTime && this.keyword.createTime[1] + ' 23:59:59',
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
        api
          .query(this.searchParams())
          .then(res => {
            this.memberList = res.data || [];
            this.totalMemberCount = res.totalCount;
            this.mBuildMultipleTableSelection(this.memberList, 'memberTable', unionKeys);
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.isLoading = false;
          });
      },

      handleRestore(row) {
        this.$confirm('恢复后，客户将移入全域客户列表中，并支持分配到导购', '恢复客户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          api
            .recoverClientInfo({
              clientId: row.id,
            })
            .then(({ data }) => {
              if (data) {
                this.$message({
                  message: '恢复成功',
                  type: 'success',
                });
                this.doSearch();
              }
            });
        });
      },

      deleteClientInfo(row) {
        this.$confirm('线索一旦删除，该线索的所有信息将被清空，是否继续删除? ', '删除线索', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          api
            .deleteClientInfo({
              id: row.id,
            })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.$router.push({
                query: {
                  pageNo:
                    this.memberList.length === 1 && this.pageParams.pageNo != 1
                      ? this.pageParams.pageNo - 1
                      : this.pageParams.pageNo,
                },
              });
              this.pageParams.pageNo =
                this.memberList.length === 1 && this.pageParams.pageNo != 1
                  ? this.pageParams.pageNo - 1
                  : this.pageParams.pageNo;
              this.doSearch();
            })
            .catch(err => {
              console.error(err);
            });
        });
      },
      // 批量删除
      deleteBatchClientInfo() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择要批量删除的客户');
          return;
        }

        this.$confirm('线索一旦删除，该线索的所有信息将被清空，是否继续删除? ', '删除线索', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
          const ids = this.mTotalCheckedList.map(item => {
            return item.id;
          });
          const clientIds = ids.join(',');
          api
            .deleteBatchClientInfo({
              clientIds,
            })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.$router.push({
                query: {
                  pageNo:
                    this.memberList.length === 1 && this.pageParams.pageNo != 1
                      ? this.pageParams.pageNo - 1
                      : this.pageParams.pageNo,
                },
              });
              this.pageParams.pageNo =
                this.memberList.length === 1 && this.pageParams.pageNo != 1
                  ? this.pageParams.pageNo - 1
                  : this.pageParams.pageNo;
              this.$refs.memberTable.clearSelection();
              this.mUpdateTotalListBySelection(this.memberList, this.multipleSelection, unionKeys);
              this.doSearch();
            })
            .catch(err => {
              console.error(err);
            });
        });
      },

      formatTime(row, column) {
        const date = row[column.property];
        if (date) {
          return datetime.format(new Date(date), 'YYYY-MM-DD HH:mm:ss');
        }
        return '';
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 过滤跟进情况
      formatFollowInfo(row, column) {
        const f = row[column.property];
        if (f === null || f === undefined) return '';
        const followInfo = this.followInfoList.find(item => item.value === f);
        return followInfo ? followInfo.name : '';
      },

      // 选择省市区
      handleChangeArea(params) {
        this.area = { ...this.area, ...params };
        // 避免还没赋值就调用
        this.$nextTick(() => {
          this.onFilter();
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
    },
  };
</script>
<style lang="less" scoped>
  @import '../cue/index.less';
</style>
