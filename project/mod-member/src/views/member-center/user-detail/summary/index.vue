<template>
  <div class="summary">
    <div class="rw">
      <card title="会员信息" class="aside">
        <!-- <template #extra>
          <i class="icon el-icon-edit" @click="handleUserEdit"></i>
        </template> -->
        <fields
          label-width="7em"
          :options="[
            // { k: '会员卡号', v: info.userNum },
            { k: '会员状态', render: statusRenderer },
            { k: '会员类型', v: '普通会员' },
            //{ k: '付费会员', v: '是' },
            { k: '会员等级', v: info.levelName },
          ]"
        >
        </fields>
      </card>

      <card title="360 洞察" class="stretch tag-card">
        <div class="tag-groups">
          <div class="tag-group">
            <header class="tag-group__header">
              商家标签
              <img :src="EditIcon" class="tag__edit" @click="handleAddTags" />
            </header>
            <div class="tag-group__tags">
              <div v-if="userTags.storeTags.length === 0" class="empty">暂无数据</div>
              <template v-else>
                <el-tooltip v-for="tag in userTags.storeTags" :key="tag.tagId" placement="top" :content="tag.tagValue">
                  <el-tag
                    class="tag-group__tag blue limit-line"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ tag.tagValue }}
                  </el-tag>
                </el-tooltip>
              </template>
            </div>
          </div>
          <div class="tag-group">
            <header class="tag-group__header">自动标签</header>
            <div class="tag-group__tags">
              <div v-if="userTags.autoTags.length === 0" class="empty">暂无数据</div>
              <template v-else>
                <el-tooltip v-for="tag in userTags.autoTags" :key="tag.tagId" placement="top" :content="tag.tagValue">
                  <el-tag class="tag-group__tag limit-line" type="success">
                    {{ tag.tagValue }}
                  </el-tag>
                </el-tooltip>
              </template>
            </div>
          </div>
          <!-- <div class="tag-group">
            <header class="tag-group__header">系统标签</header>
            <div class="tag-group__tags">
              <div v-if="userTags.sysTags.length === 0" class="empty">暂无数据</div>
              <template v-else>
                <div class="tag-group__tag green" v-for="i of userTags.sysTags" :key="i.id">{{ i.tagValue }}</div>
              </template>
            </div>
          </div> -->
        </div>
      </card>
    </div>
    <div class="rw">
      <div class="cl aside">
        <card title="用户价值" class="stretch">
          <fields
            label-width="7em"
            :options="[
              { k: '累计消费', v: userValue.consumeAmount },
              { k: '消费次数', v: `${userValue.consumeCount}次` },
              { k: '最近支付时间', v: $filters.dateTimeFormat(userValue.lastConsumeTime) },
              { k: '客单价', v: userValue.perCustomerTransaction },
            ]"
          >
          </fields>
        </card>
        <card title="生命周期" class="stretch">
          <template #extra>
            <img :src="EditIcon" class="icon tag__edit" @click="handleAddLifecyle" />
          </template>
          <div class="timeline-container">
            <simple-timeline :list="lifeCycleRecords"
              ><template #default="{ item }"
                ><div class="timeline-item">
                  <header v-if="!!item.createTime" class="timeline-item__date">
                    {{ item.createTime.slice(0, -3) }}
                  </header>
                  <main class="timeline-item__label">
                    {{ item.lifecycleName }}{{ item.type === LifeCycleDetectType.Manual ? '(手动变更)' : '' }}
                  </main>
                </div></template
              ></simple-timeline
            >
          </div>
        </card>
      </div>
      <card title="会员等级" class="stretch">
        <level :info="info"></level>
      </card>
    </div>
    <div class="rw">
      <card title="会员账户" class="stretch">
        <account :info="info"></account>
      </card>
    </div>
    <iaddress :info="info" />
    <license-plate :info="info" />
    <user-edit-dialog ref="userEdit" />
    <add-tag-dialog ref="addTags" :fetch-handler="getTagList" />
    <add-lifecycle-dialog ref="addLifecycle" />
    <status-change-dialog ref="statusDialog" @status-change-success="handleChangeStatusSuccess" />
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/memberAPI';
  import Fields from '../fields.vue';
  import Card from '../card.vue';
  import StatusChangeDialog from '../../user-list/status-change-dialog.vue';
  import SimpleTimeline from './simple-timeline.vue';
  import Level from './level/index.vue';
  import Account from './account.vue';
  import Iaddress from './address.vue';
  import LicensePlate from './license-plate.vue';
  import UserEditDialog from './user-edit-dialog.vue';
  import AddTagDialog from './add-tag-dialog.vue';
  import AddLifecycleDialog from './add-lifecycle-dialog.vue';
  import { MemberStatusName, MemberStatusColor, LifeCycleDetectType, MemberStatus } from '@/mod-member/src/enum';
  import EditIcon from '@/mod-member/src/images/icon/icon-edit.png';

  export default {
    name: 'Summary',
    components: {
      StatusChangeDialog,
      Card,
      Fields,
      SimpleTimeline,
      Level,
      Account,
      Iaddress,
      LicensePlate,
      UserEditDialog,
      AddTagDialog,
      AddLifecycleDialog,
    },
    inject: ['refreshUserInfo'],
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        EditIcon,
        MemberStatusColor,
        MemberStatusName,
        LifeCycleDetectType,
        lifeCycleRecords: [],
        userTags: {
          storeTags: [],
          autoTags: [],
          sysTags: [],
        },
        userValue: {
          consumeAmount: 0,
          consumeCount: 0,
          growthValue: 0,
          lastConsumeTime: '',
          lastLoginTime: '',
          lastRefundTime: '',
          perCustomerTransaction: 0,
          refundAmount: 0,
          refundCount: 0,
          registerTime: '',
          score: 0,
        },
      };
    },
    mounted() {
      this.handleFetchLifecycleRecords();
      this.handleFetchUserValues();
      this.getTags();
    },
    methods: {
      /**
       * @param {Vue.RenderContext} context
       */
      statusRenderer(h, context) {
        const status = this.info.status;
        return (
          <div style={{ color: MemberStatusColor[status] }}>
            {MemberStatusName[status]}
            {this.globalIsUmpPlatformApp && (
              <el-switch
                style={{ marginLeft: '5px' }}
                value={this.info.status}
                vOn:change={this.handleStatusChange}
                activeValue={MemberStatus.Active}
                inactiveValue={MemberStatus.Freeze}
              ></el-switch>
            )}
          </div>
        );
      },
      handleStatusChange() {
        this.$refs.statusDialog.show(this.info);
      },
      handleChangeStatusSuccess() {
        this.refreshUserInfo();
      },
      async handleFetchLifecycleRecords() {
        const { data } = await api.memberCenter.getLifecycleRecords({
          uniqueAccountId: this.info.uniqueAccountId,
          pageNo: 1,
          pageSize: 1000,
        });
        this.lifeCycleRecords = data || [];
      },
      async handleFetchUserValues() {
        const { data } = await api.memberCenter.getUserValueStat({
          uniqueAccountId: this.info.uniqueAccountId,
        });
        if (data) {
          this.userValue = data;
        }
      },
      handleAddLifecyle() {
        this.$refs.addLifecycle.show({
          onConfirm: async params => {
            await api.memberCenter.addLifecycleRecords({
              ...params,
              uniqueAccountId: this.info.uniqueAccountId,
            });
            this.handleFetchLifecycleRecords();
          },
        });
      },
      async getTagList() {
        return await api.getUserLabelList({});
      },
      async getTags() {
        if (this.info && this.info.id) {
          const { data } = await api.memberCenter.getUserTags({ userId: this.info.id });
          const tags = (data.tags || []).filter(i => i.tagId && i.tagValue);
          const storeTags = [];
          const autoTags = [];
          const sysTags = [];
          for (let i = 0; i < tags.length; i++) {
            const { tagType } = tags[i];
            switch (tagType) {
              case 1:
                storeTags.push(tags[i]);
                break;
              case 2:
                autoTags.push(tags[i]);
                break;
              case 3:
                sysTags.push(tags[i]);
                break;
            }
          }
          this.userTags = { storeTags, autoTags, sysTags };
        }
      },
      handleUserEdit() {
        this.$refs.userEdit.show({ onConfirm: () => {} });
      },
      handleAddTags() {
        this.$refs.addTags.show({
          onConfirm: async ({ tagId }) => {
            try {
              await api.addUserLabel([
                { userId: this.info.id, tagIdList: typeof tagId === 'number' ? [tagId] : tagId },
              ]);
              this.getTags();
              return true;
            } catch (error) {
              return false;
            }
          },
        });
      },
      async handleClose({ tagId }) {
        try {
          await api.deleteUserLabel([{ userId: this.info.id, tagIdList: [tagId] }]);
          this.getTags();
        } catch (error) {
          this.$message.error(error.msg);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .summary {
    padding: 8px;
  }

  .rw,
  .cl {
    display: flex;
  }

  .rw > .card,
  .rw > .cl {
    margin: 8px;
  }

  .cl > .card {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .cl {
    flex-direction: column;
  }

  .aside {
    width: 360px;
    box-shadow: none;
  }

  .stretch {
    flex: 1;
    box-shadow: none;
  }

  .tag-card /deep/ .el-card__body {
    padding: 8px;
  }

  .tag-groups {
    display: flex;
  }

  .tag-group {
    flex: 1;
    border: 1px solid #dce1e6;
    border-radius: 4px;
    margin-right: 8px;
    height: 132px;
    display: flex;
    flex-direction: column;

    &__header {
      text-align: center;
      font-size: 14px;
      color: #303133;
      font-weight: 600;
      line-height: 38px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      margin: 8px;
      overflow: auto;
    }

    &__tag {
      margin: 0 4px 4px 0;
      border: 0;
      max-width: 160px;

      &.blue {
        color: #1890ff;
        background: #dbeeff;

        & /deep/ .el-tag__close {
          color: #1890ff;
        }

        & /deep/ .el-tag__close:hover {
          color: #fff;
          background: #1890ff;
        }
      }
    }
  }

  .tag__edit {
    width: 14px;
    cursor: pointer;
    margin-left: 6px;
  }

  .timeline-container {
    width: 100%;
    max-height: 356px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .timeline-item {
    &__date {
      color: #717378;
      font-size: 12px;
    }

    &__label {
      color: #303133;
      font-size: 14px;
      max-width: 11em;
    }
  }

  .empty {
    text-align: center;
    width: 100%;
    color: #ccc;
  }
</style>
