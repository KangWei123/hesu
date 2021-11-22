<template>
  <list-page-layout>
    <template v-if="globalIsUmpPlatformApp" #main-actions>
      <div class="button-box">
        <el-button type="text" @click="upgradeRules">降级规则</el-button>
        <el-button type="primary" @click="newLevel">+ 新增等级</el-button>
      </div>
    </template>
    <fat-table class="el-table-no-padding" :fetch-handler="handleFetch" ref="table">
      <el-table-column prop="levelNumber" label="等级" align="center">
        <template slot-scope="scope">
          <span v-text="queryLevelName(scope.row.levelNumber)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="levelName" label="等级名称" align="center"></el-table-column>
      <el-table-column prop="upgradeCondition" align="center">
        <template slot="header">
          <div>升级条件(成长值)</div>
        </template>
      </el-table-column>
      <el-table-column label="直升规则" header-align="center" min-width="100">
        <template slot-scope="scope">
          <span v-text="directUpgradeRule(scope.row.directUpgradeRule)"></span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div>保级条件(成长值)</div>
        </template>
        <template slot-scope="scope">
          <span v-text="relegationCondition(scope.row.relegationRule)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="rightsNotes" label="会员权益">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.rightsDesc" placement="top">
            <el-button type="text">
              <div class="el-table-column-button-text">{{ scope.row.rightsDesc }}</div>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="memberCount" label="会员数" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="180px" v-slot="{ row }">
        <table-actions :options="getRowActionOptions(row)"></table-actions>
      </el-table-column>
    </fat-table>
    <el-dialog :visible.sync="upgradeRulesVisible" title="配置降级规则" width="500">
      <span>
        <el-radio-group v-model="rules">
          <el-radio class="el-dialog-radio" label="1">不降级</el-radio>
          <el-radio class="el-dialog-radio el-radio-multi-line" label="2">
            获得等级<el-input class="el-dialog-input" v-model="dayNum" type="number" min="1"></el-input>
            天后，若用户升级，新等级有效期从升级当天开始计算。若没有在当前有效期内升级，新等级有效期会在当前等级有效期到期日的次日重新计算并变更为新的等级；
            <br />
            同时，在当前等级有效期变更前获取的成长值会<span class="auto-reset">自动清零</span
            >。新等级有效期内获取的成长值，将计算在新的等级有效期内。
          </el-radio>
        </el-radio-group>
      </span>
      <span slot="footer" class="dialog-footer-box">
        <el-button @click="upgradeRulesVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBaseConfig">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="deleteDialogVisible">
      <i class="el-icon-warning"></i><br />
      <span class="title">删除会员等级</span><br />
      <div class="content" v-text="deleteText"></div>
      <span slot="footer" class="dialog-footer-box">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </span>
    </el-dialog>

    <gifts-dialog v-model="giftsDialogVisible" :level="level"></gifts-dialog>
    <upgrade-immediately v-model="upgradeImmediatelyVisible" :level="level" @refresh="onRefresh"></upgrade-immediately>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import * as listPageComponents from '@/dss-common/components/list-page';
  import GiftsDialog from './gifts-dialog.vue';
  import UpgradeImmediately from './upgrade-immediately.vue';

  export default {
    levelName: 'NormalMember',
    components: {
      GiftsDialog,
      UpgradeImmediately,
      FatTable,
      ListPageLayout,
      ...listPageComponents,
    },
    data() {
      return {
        levelList: [],
        deleteItem: null,
        upgradeRulesVisible: false,
        deleteDialogVisible: false,
        giftsDialogVisible: false,
        upgradeImmediatelyVisible: false,
        deleteText: '有会员权益关联了改等级，请先取消关联的权益在删除。',
        rules: null,
        dayNum: null,
        baseConfig: null,

        level: -1,
      };
    },
    watch: {
      rules: {
        handler(val, oldVal) {
          if (val === '1') {
            this.dayNum = '';
          }
        },
      },
    },
    mounted() {
      memberApi.levelManager.levelList().then(res => {
        this.levelList = res.data;
      });
      this.getBaseConfig();
      if (this.$route.query.id) {
        this.level = this.$route.query.id;
        this.giftsDialogVisible = true;
      }
    },
    methods: {
      onRefresh() {
        this.$refs.table.refresh();
      },
      getRowActionOptions(row) {
        if (this.globalIsUmpPlatformApp) {
          return [
            {
              name: '编辑',
              link: {
                path: '/level-center/level-mgr/add-level',
                query: { status: 1, id: row.id },
              },
            },
          ];
        }

        const options = [
          {
            name: '升级礼包',
            onClick: () => {
              this.level = row.id;
              this.giftsDialogVisible = true;
            },
          },
        ];
        // if (row.directUpgradeRule?.singleDay) {
        //   options.unshift({
        //     name: '会员直升',
        //     onClick: () => {
        //       this.level = row.id;
        //       this.upgradeImmediatelyVisible = true;
        //     },
        //   });
        // }

        return options;
      },
      async handleFetch(args) {
        const params = {};
        params.pageNo = args.pagination.currentPage;
        params.pageSize = args.pagination.pageSize;
        const res = await memberApi.levelManager.getLevelList(params);
        return {
          list: res.data || [],
          total: res.totalCount,
        };
      },
      getBaseConfig() {
        memberApi.baseConfig.getBaseConfig().then(({ data }) => {
          if (data) {
            this.baseConfig = data;
            this.dayNum = data.levelDowngradeRule === 0 ? '' : data.levelDowngradeRule;
            this.rules = data.levelDowngradeRule === 0 ? '1' : '2';
          }
        });
      },
      relegationCondition(e) {
        if (e != null) {
          const item = e;
          return item.relegationCondition;
        } else return '';
      },
      directUpgradeRule(e) {
        if (e != null) {
          const item = e;
          if (item.singleDay != null && item.month == null) {
            return '集团：单日累计' + item.singleDay;
          } else if (item.month != null && item.singleDay == null) {
            return '集团：单月累计' + item.month;
          } else if (item.month != null && item.singleDay != null) {
            return '集团：单日累计' + item.singleDay + '，单月累计' + item.month;
          }
        } else return '';
      },
      upgradeRules() {
        this.rules = this.baseConfig.levelDowngradeRule === 0 ? '1' : '2';
        const num = this.baseConfig.levelDowngradeRule;
        this.dayNum = num === 0 ? '' : num;
        this.upgradeRulesVisible = true;
      },
      newLevel() {
        this.$router.push({
          path: '/level-center/level-mgr/add-level',
          query: { status: 0 },
        });
      },
      edit(item) {
        this.$router.push({
          path: '/level-center/level-mgr/add-level',
          query: { status: 1, id: item.id },
        });
      },
      detail(item) {
        this.$router.push({
          path: '/level-center/level-mgr/add-level',
          query: { status: 2, id: item.id },
        });
      },
      queryLevelName(id) {
        for (let i = 0; i < this.levelList.length; i++) {
          const item = this.levelList[i];
          if (item.code === id) {
            return item.desc;
          }
        }
      },
      deleted(item) {
        this.deleteDialogVisible = true;
        this.deleteItem = item;
      },
      confirmDelete() {
        this.deleteDialogVisible = false;
        memberApi.levelManager.deleteLevel({ id: this.deleteItem.id }).then(res => {
          if (res.success) {
            this.$message.success('删除成功');
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      saveBaseConfig() {
        if (this.rules === '2' && this.dayNum === '') {
          this.$message.error('请输入降级条件');
          return;
        }
        if (this.rules === '2' && this.dayNum <= 1) {
          this.$message.error('降级规则的天数必须大于1');
          return;
        }
        if (this.rules === '2' && this.dayNum > 99999) {
          this.$message.error('降级规则的天数必须小于99999');
          return;
        }
        this.upgradeRulesVisible = false;
        const params = {
          levelDowngradeRule: this.rules === '1' ? 0 : parseInt(this.dayNum),
        };
        memberApi.baseConfig.saveBaseConfig(params).then(res => {
          this.getBaseConfig();
        });
      },
    },
  };
</script>

<style lang="less">
  .cell {
    padding: 0 0;

    .el-button--text:hover,
    .el-button--text:focus {
      color: #333;
    }
  }

  .el-table-column-button-text {
    padding: 0;
    height: 28px;
    text-align: left;
    white-space: normal;
    color: #333;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .el-table-column-button {
    font-size: 14px;
    color: @ui-blue-default;
  }

  .button-box {
    float: right;

    .el-button {
      width: 92px;
      height: 36px;
      padding: 0 10px;
      border-radius: 4px;
      border: solid @ui-theme-color-orange 1px;
    }

    .el-button:last-child {
      margin-right: 20px;
    }
  }

  .el-dialog {
    .dialog-footer-box {
      width: 66px;
      height: 32px;
      border-radius: 4px;
    }

    .title {
      width: 400px;
      height: 26px;
      opacity: 1;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: @ui-font-color-black;
      line-height: 26px;
    }

    .content {
      margin-top: 16px;
      color: @ui-font-color-darkGrey;
    }

    .el-icon-warning {
      color: @ui-function-color-fail;
      font-size: 42px;
    }

    .el-radio-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .el-radio-multi-line {
        color: @ui-font-color-black;
        margin-top: 10px;

        .el-radio__input {
          margin-top: 8px;
          vertical-align: top;
        }

        .el-radio__label {
          text-align: left;
          width: 400px;
          text-overflow: ellipsis;
          white-space: normal;
          line-height: 18px;
          vertical-align: middle;
          display: inline-block;

          .auto-reset {
            color: @ui-theme-color-orange;
          }
        }

        .is-checked {
          color: @ui-font-color-black;
        }
      }

      .el-dialog-radio {
        .el-radio__label {
          width: 540px;
          font-weight: 400;
          color: @ui-font-color-black;
        }
      }
    }

    .el-dialog-input {
      margin: 0 0 0 5px;
      width: 80px;
      height: 25px;

      .el-input__inner {
        height: 25px;
      }
    }
  }
</style>
