<template>
  <list-page-layout>
    <template #main-actions>
      <el-popover
        placement="left-start"
        width="190"
        trigger="hover"
        :disabled="!all"
        content="所有积分消耗动作已被创建，无需重复设置"
      >
        <el-button :class="{ disabled: all }" slot="reference" type="primary" @click="onToAdd"> + 新增规则 </el-button>
      </el-popover>
    </template>
    <template #filters>
      <score-filter :form="filterParams" @submit="$refs.table.search()" />
    </template>
    <fat-table
      ref="table"
      class="wkb-table-border"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      :remove-confirm-message="getRulesRemoveMessage"
      :state="filterParams"
      :row-key="globalIsUmpPlatformApp ? 'id' : 'refId'"
    >
      <el-table-column label="规则名称" prop="refName" v-if="!globalIsUmpPlatformApp"></el-table-column>
      <el-table-column label="积分动作" prop="eventName"></el-table-column>
      <el-table-column label="适用项目" prop="validStore" v-if="!globalIsUmpPlatformApp"></el-table-column>
      <!-- <el-table-column label="备注" prop="scoreDesc" v-if="!globalIsUmpPlatformApp"></el-table-column> -->
      <el-table-column label="有效时间">
        <template slot-scope="scope">
          <span v-if="scope.row.validType === validityType.permanent">永久</span>
          <div v-else>
            <div>{{ scope.row.validStartTime && scope.row.validStartTime.slice(0, -3) }}</div>
            <div>{{ scope.row.validEndTime && scope.row.validEndTime.slice(0, -3) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" v-if="!globalIsUmpPlatformApp">
        <template slot-scope="scope">
          {{ ScoreGiveStatusDesc[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" v-slot="scope">
        <div>
          <div>{{ scope.row.createUserName }}</div>
          <div>{{ scope.row.createUserPhone }}</div>
        </div>
      </el-table-column>

      <el-table-column label="已配置应用" prop="validAppName" v-if="globalIsUmpPlatformApp"></el-table-column>
      <el-table-column label="操作" align="right" v-slot="scope">
        <table-actions :options="operating(scope)" />
      </el-table-column>
    </fat-table>
    <base-dialog ref="dialog">
      <template #content>
        <div class="dialog_content">{{ tipContent }}</div>
        <div class="dialog_content">{{ tipContentSub }}</div>
      </template>
      <template #footer>
        <el-button @click="handleSubmitDialog">删 除</el-button>
        <el-button type="primary" @click="handleHideDialog">取 消</el-button>     
      </template>
    </base-dialog>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import { ScoreType, ScoreGiveStatusDesc } from '@/mod-member/src/enum/index';
  import ScoreFilter from '../components/score-filter.vue';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import { validityType } from '../enum/score';
  import RuleRemoveMixin from '../mixins/rule-remove';
  import { getUrlByEventKey } from '../util';
  import BaseDialog from '@/dss-common/components/base-dialog';

  export default {
    name: 'ConsumeRuleList',
    mixins: [RuleRemoveMixin],
    components: { ScoreFilter, ListPageLayout, FatTable, TableActions, BaseDialog },
    data() {
      return {
        validityType,
        filterParams: {
          refName: '',
          appId: '',
          status: '',
          eventKey: '',
          ruleType: 2,
        },
        ScoreGiveStatusDesc,
        tipContent: '',
        tipContentSub: '',
        currentId: '',
        all: false,
      };
    },
    methods: {
      operating(item) {
        const { eventKey, refId, id, eventName } = item.row;
        if (this.globalIsUmpPlatformApp || eventKey === 'event_consume') {
          return [
            {
              name: '详情',
              link: {
                path: '/score-center/consume-rule/form',
                query: { id: this.globalIsUmpPlatformApp ? id : refId, disabled: 1 },
              },
            },
            {
              name: '编辑',
              link: {
                path: '/score-center/consume-rule/form',
                query: { id: this.globalIsUmpPlatformApp ? id : refId },
              },
            },
            {
              name: '删除',
              onClick: () => {
                if (this.globalIsUmpPlatformApp) {
                  const loading = this.$loading({
                    lock: true,
                    text: '查询中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.3)',
                  });
                  memberApi.scoreCenter
                    .checkDelStatus({ id })
                    .then(({ data }) => {
                      loading.close();
                      if (data.length) {
                        let msg = `涉及到的应用有：`;
                        msg += data.map(i => `【${i.appName || (data.length === 1 ? '全部应用' : '-')} 】`).join('、');
                        this.tipContent = `警告：【${eventName}】积分动作权限下目前有未结束的活动，删除后，适用应用下相关动作下的事件将直接失效，请确认是否删除该积分动作？`;
                        this.tipContentSub = msg;
                      } else {
                        this.tipContent = `警告：删除【${eventName}】积分动作权限，将导致适用应用无法继续创建对应动作下的事件，请确认是否删除该积分动作？`;
                        this.tipContentSub = '';
                      }
                      this.$refs.dialog.show();
                      this.currentId = id;
                    })
                    .catch(() => {
                      loading.close();
                    });
                  return;
                }
                this.$refs.table.remove(refId);
              },
            },
          ];
        } else {
          return [{ name: '详情', link: { path: getUrlByEventKey(item.row) } }];
        }
      },
      async handleSubmitDialog() {
        await this.handleRemove([this.currentId]);
        this.handleHideDialog();
        this.$refs.table.refresh();
      },
      handleHideDialog() {
        this.currentId = '';
        this.$refs.dialog.hide();
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...(this.filterParams || {}),
          ruleType: ScoreType.Consume,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        let list;
        if (this.globalIsUmpPlatformApp) {
          list = await memberApi.scoreCenter.list(payload);
        } else {
          list = await memberApi.scoreCenter.queryAppScoreRuleConsume(payload);
        }
        this.handleCheck();
        return {
          list: list.data || [],
          total: list.totalCount,
        };
      },
      onToAdd() {
        if (!this.all) {
          this.$router.push('/score-center/consume-rule/form');
        }
      },
      handleRemove(ids) {
        return memberApi.scoreCenter.del({ id: ids[0] });
      },
      async handleCheck() {
        if (this.globalIsUmpPlatformApp) {
          const res = await memberApi.scoreCenter.eventList({
            eventType: 2, // 积分消耗
            exist: 1,
          });
          this.all = res.data.every(i => (!i.sysEventStatus ? i.exist === 1 : true));
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  /deep/ .el-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dialog_content {
    text-align: left;
    margin-bottom: 10px;
  }
</style>
