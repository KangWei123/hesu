<template>
  <div class="lucky">
    <!-- <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/lucky/list' }">幸运转盘</el-breadcrumb-item>
    </el-breadcrumb>-->
    <!--    <iframe style="display:none;" ref="ifr" width="0" height="0" src="about:blank"></iframe>-->
    <div class="Add-Manage-Button">
      <el-button @click="onAdd" icon="el-icon-plus" type="primary">新建幸运转盘</el-button>
    </div>

    <div class="lucky-filter">
      <el-form
        inline
        :model="keyword"
        ref="keyword"
        class="wkt-opt-label-container"
        style="padding-right: 120px"
        @submit.native.prevent
      >
        <el-form-item label="活动名称：" prop="activityName">
          <el-input
            v-model="keyword.activityName"
            clearable
            type="input"
            @input="onSearch"
            class="dss-filter-large-input"
            placeholder="搜索活动名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="活动类型：" prop="participationType">
          <el-select
            clearable
            v-model="keyword.participationType"
            placeholder="选择活动类型"
            @change="OnParticipationTypeChange"
          >
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态：" prop="statusList">
          <el-select clearable v-model="keyword.statusList" placeholder="选择活动状态" @change="OnStatusListChange">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="lucky-list">
      <el-table :data="luckylist" style="width: 100%" class="wkt-table" v-loading="loading">
        <el-table-column align="center" prop="activityName" label="活动名称" />
        <el-table-column align="center" prop="activityStartTime" label="开始时间" min-width="152px"></el-table-column>

        <el-table-column align="center" prop="activityEndTime" label="结束时间" min-width="152px"></el-table-column>

        <el-table-column align="center" :formatter="formartactType" prop="participationType" label="活动类型" />
        <el-table-column align="center" :formatter="formartactFrame" prop="activityScenario" label="活动场景" />
        <el-table-column align="center" :formatter="statusFormatter" prop="activityStatus" label="状态" />
        <el-table-column prop="activityLevel" width="120" label="活动类型">
          <template slot-scope="scope">
            <span v-if="scope.row.createStoreId">门店活动</span>
            <span v-else>品牌活动</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createUserName" :formatter="createUserNameFormatter" label="创建人" />
        <el-table-column
          align="center"
          prop="storeNameList"
          :formatter="storeFormatter"
          :show-overflow-tooltip="true"
          label="参与门店"
        />
        <el-table-column prop="methods" width="265px" label="操作" fixed="right">
          <div slot-scope="scope">
            <!-- <a @click="gotoModify(scope.row)">编辑</a> -->
            <template>
              <!-- createStoreId: 0 品牌 other 门店 -->
              <a v-if="hasPermission(scope.row.createStoreId)" @click="gotoModify(scope.row)">编辑</a>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else-if="!hasPermission(scope.row.createStoreId)"
                content="当前角色无法进行编辑"
              >
                <a href="javascript:;" slot="reference" class="popover-a-disabled">编辑</a>
              </el-popover>
            </template>
            <template v-if="scope.row.deleteFlag === 'Y'">
              <a @click="gotoDetail(scope.row)">详情</a>
              <a v-if="![0, 1, 2].includes(scope.row.activityStatus)" @click="onRecord(scope.row)">抽奖记录</a>
            </template>
            <template>
              <a @click="gotoDetail(scope.row)">详情</a>
              <a v-if="![0, 1, 2].includes(scope.row.activityStatus)" @click="onRecord(scope.row)">抽奖记录</a>

              <template>
                <a
                  v-if="![0, 4].includes(scope.row.activityStatus) && hasPermission(scope.row.createStoreId)"
                  @click="onEnd(scope.row)"
                  >结束活动</a
                >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-else-if="![0, 4].includes(scope.row.activityStatus) && !hasPermission(scope.row.createStoreId)"
                  content="当前角色无法结束活动"
                >
                  <a href="javascript:;" slot="reference" class="popover-a-disabled">结束活动</a>
                </el-popover>
              </template>

              <template>
                <a
                  v-if="[0, 4].includes(scope.row.activityStatus) && hasPermission(scope.row.createStoreId)"
                  @click="onDelete(scope.row)"
                  >删除</a
                >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-else-if="[0, 4].includes(scope.row.activityStatus) && !hasPermission(scope.row.createStoreId)"
                  content="当前角色无法进行删除"
                >
                  <a href="javascript:;" slot="reference" class="popover-a-disabled">删除</a>
                </el-popover>
              </template>
            </template>
          </div>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="totalCount"
        hide-on-single-page
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <modify-dialog
      :visible.sync="dialogVisible"
      :init-rule-description="current ? current.ruleDescription : ''"
      :id="current ? current.id : -1"
    />
  </div>
</template>

<script>
  import luckyApi from '@/dss-wechat3rd/src/api/lucky.js';
  import utils from '@/dss-common/utils/index';
  import '@/dss-wechat3rd/src/views/marketing/marketing.less';
  import ModifyDialog from './components/modify-dialog';
  import { actTypes, staTus } from './luckEnums';
  import { mapState } from 'vuex';

  export default {
    components: {
      'modify-dialog': ModifyDialog,
    },

    data() {
      // let downloadUrl = location.protocol + '//' + location.host + luckyApi.download;
      return {
        // el-table表格数据
        luckylist: [],
        // 共多少条
        totalCount: 0,
        page: {
          pageNo: 1, // 第几页
          pageSize: 10, // 每页显示尺寸
        },
        // 筛选对象
        keyword: {
          deleteFlag: 'N',
          // 活动名称
          activityName: '',
          // 活动类型
          participationType: '',
          // 活动状态
          statusList: '',
        },
        api: luckyApi,
        loading: false,
        options1: [
          { label: '选择活动类型' },
          { value: actTypes.drawByscore, label: '积分抽奖' },
          { value: actTypes.free, label: '免费抽奖' },
        ],
        options2: [
          {
            label: '选择活动状态',
          },
          {
            value: '0,1,2',
            label: '未开始',
          },
          {
            value: '3',
            label: '进行中',
          },
          {
            value: '4',
            label: '已结束',
          },
          {
            value: '5',
            label: '已删除',
          },
        ],
        // 修改弹框相关数据
        dialogVisible: false,
        // 修改弹窗的默认值
        current: null,
      };
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fetch(); // 获取列表
      });
    },

    computed: {
      ...mapState({
        roleList: state => state.roleList,
      }),
      /**
       * 是否区域管理员
       */
      isAreaManager() {
        return (
          !!this.roleList &&
          (this.roleList.indexOf('common_role_area_manager') !== -1 ||
            this.roleList.indexOf('common_role_dealer_manager') !== -1)
        );
      },
      hasPermission() {
        return createStoreId => {
          const roleList = this.roleList;

          if (!!~roleList.split(',').indexOf('common_role_enterprise') && !createStoreId) {
            return true;
          } else if (this.isAreaManager && createStoreId) {
            return true;
          }
          return false;
        };
      },
    },

    mounted() {
      // fix切换门店不请求列表接口
      this.fetch();
    },
    methods: {
      End(e) {
        //  e> scope.row
        //  已结束
        console.log('已结束');
      },
      onDelete(row) {
        // 逻辑引用 或者 进行中， 不能结束、、、、、
        // if (row.beCited) {
        //   this.$message({
        //     message: '该转盘活动不能被删除，已被首页装修或签到有礼引用',
        //     type: 'warning'
        //   });
        //   return;
        // }

        this.$confirm('活动删除后不可恢复，你还要继续吗?', '确定删除该活动吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.api.delete(row.id).then(res => {
              if (res.success) {
                console.log('delete_success');
                this.fetch();
              }
            });
          })
          .catch(err => {
            console.log('取消删除', err);
          });
      },
      OnStatusListChange(e) {
        this.fetch();
      },
      OnParticipationTypeChange(e) {
        console.log('OnParticipationTypeChange');
        this.fetch();
      },
      onSizeChange(size) {
        this.page.pageSize = size;
        this.page.pageNo = 1;
        this.fetch();
      },
      onPageChange(page) {
        this.page.pageNo = page;
        this.fetch();
      },
      fetch() {
        const params = { ...this.keyword, ...this.page };
        if (params.statusList == '5') {
          params.deleteFlag = 'Y';
          // delete params.statusList;
        } else {
          params.deleteFlag = 'N';
        }
        // params.statusList = [...params.statusList]
        // console.log('params', params);
        this.loading = true;
        this.api
          .list(params)
          .then(res => {
            // console.log(JSON.stringify(res.data));
            // let arr = res.data.filter(item => item.deleteFlag !== 'Y');
            // if (params.statusList === 'Y') {
            //   //已删除的数据
            //   let softremoveedItems = res.data.filter(f => f.deleteFlag === 'Y');
            //   this.luckylist = softremoveedItems;
            //   this.totalCount = softremoveedItems.length;
            // } else {
            //   // 未删除的数据
            //   let nodeleteLucklist = res.data.filter(f => f.deleteFlag === 'N');
            //   this.luckylist = nodeleteLucklist;
            //   this.totalCount = nodeleteLucklist.length;
            // }
            this.luckylist = res.data;
            this.totalCount = res.totalCount;
          })
          .always(_ => {
            this.loading = false;
          });

        // this.luckylist.forEach(item => {
        //   if (item.beCited !== 0 || item.beCited === 1) {
        //     console.log('item.beCited ===================================1');
        //   }
        // });
      },
      // 处理结束活动
      onEnd(row) {
        // activityStatus = 012 可关
        // console.log('onEnd', e);
        console.log('onEnd', row);
        // activityScenario 和 beCited 同时为1不可被关闭；
        const activityScenario = row.activityScenario;
        const beCited = row.beCited;

        if (activityScenario === 1 && beCited === 1) {
          this.$confirm('请先结束或删除相关「下单有礼」活动后方可结束', '该活动正在参与下单有礼，不可结束', {
            confirmButtonText: '知道了',
            // cancelButtonText: '取消',
            showCancelButton: false,
            type: 'error',
            center: true,
          });
        } else {
          this.$confirm('活动结束后不可重启，你还要继续吗?', '确定结束该活动吗', {
            confirmButtonText: '继续',
            type: 'warning',
          })
            .then(() => {
              // console.log('id',e.id)
              this.api.close(row.id).then(e => {
                if (e.success) {
                  this.onSearch();
                }
              });
              //  这里访问结束活动的接口把luckyTurningId传进去
            })
            .catch(err => {
              console.log('取消删除', err);
            });
        }
      },
      // 修改
      gotoModify(e) {
        this.dialogVisible = true;
        this.current = e;
      },
      handleDialogClose() {
        this.dialogVisible = false;
        this.form = {
          dialogVisible: '',
        };
      },
      // 跳转到详情
      gotoDetail(e) {
        this.$router.push(`/marketing/lucky/add?id=${e.id}`);
      },
      // 跳转抽奖记录
      onRecord(e) {
        console.log('onRecord', e);
        this.$router.push(`/marketing/lucky/record?id=${e.id}`);
      },
      formartactivitydate(row, column, cellValue, index) {
        const st = row.activityStartTime;
        const et = row.activityEndTime;

        return `${st} ~ ${et} `;
      },
      // 格式化表格活动场景
      formartactFrame(row, column, cellValue, index) {
        switch (cellValue) {
          case 1:
            return '下单有礼';
          case 0:
            return '首页活动';
          default:
            return '';
        }
      },
      // 格式化表格活动类型
      formartactType(row, column, cellValue, index) {
        switch (cellValue) {
          case actTypes.drawByscore:
            return '积分抽奖';
          case actTypes.free:
            return '免费抽奖';
          default:
            return '';
        }
      },
      onSearch() {
        // 访问后端把keyword传进去得到赛选过的tabledata数组
        this.page.pageNo = 1;
        this.fetch();
      },
      // 跳转页面装修
      toMiniIndex() {
        this.$router.switchPage('/setting/homedecorate');
      },
      // 新建幸运转盘
      onAdd() {
        this.$router.push('/marketing/lucky/add');
      },
      // onEditor(e) {
      //   this.$refs.edit && this.$refs.edit.show(e);
      // },
      statusFormatter(row, column, cellValue, index) {
        switch (cellValue) {
          case staTus.Ongoing:
            return '进行中';
          case staTus.Closed:
            return '已结束';
          case staTus.Ondelete:
            return '已删除';
          default:
            return '未开始';
        }
      },
      timeFormatter(row, column, cellValue, index) {
        return utils.timeFormat(cellValue);
      },
      createUserNameFormatter(row, column, cellValue, index) {
        const createUserName = row.createUserName || '';
        const userRole = row.userRole || '';
        return createUserName ? `${createUserName}(${userRole})` : '';
      },
      storeFormatter(row, column, cellValue, index) {
        if (!row.suitStoreType) return '全部门店';
        return (row.storeNameList || []).join(',');
      },
      // 提交修改
      onModifySubmit() {
        this.$refs.modifyDialog.validate(valid => {
          if (valid) {
            // @TODO api
            this.dialogVisible = false;
          }
          console.log(valid);
        });
      },
      resetForm() {
        this.$refs.keyword.resetFields();
        this.page.pageNo = 1;
        this.fetch();
      },
    },
  };
</script>

<style lang="less">
  .lucky {
    // padding: 0 20px;

    .title {
      height: 50px;
      font-size: 20px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
    }

    .lucky-list {
      background: white;
      border-radius: 4px;
      padding-bottom: 20px;

      .table-mixin;
      .el-table {
        .el-table__body {
          .cell {
            span > a {
              margin-right: 12px;
            }
          }
        }
      }
    }

    .lucky-filter {
      .bg-mixin;
      padding-left: 20px;
      background: #fff;
      border-radius: 0px 0px 4px 4px;
      // position: relative;

      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }

      .wkt-opt-label-container {
        box-shadow: none;
        padding-top: 16px;
      }

      // .lucky-box {
      //   position: absolute;
      //   top: 30px;
      //   right: 20px;
      // }
    }

    .el-table .disabled-lucky {
      color: #ccc;
      cursor: no-drop;
    }

    .el-table .disabled-lucky:hover {
      color: #ccc;
      cursor: no-drop;
    }

    .popover-a-disabled {
      color: #c0c4cc !important;
      cursor: not-allowed;
    }
  }

  .lucky-list-tooltip-img {
    width: 150px;
  }
</style>
