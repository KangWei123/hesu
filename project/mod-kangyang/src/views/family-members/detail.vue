<template>
  <div class="customer">
    <template v-if="detail">
      <div class="info">
        <user-info :avatar="memberAvatar" style="width: 64%">
          <template #name>
            {{ detail.name }}
          </template>

          <template #baseInfo>
            <user-info-item>
              <template #name>
                <span style="vertical-align: middle">家属</span>
                <img src="../../images/dependent.png" class="user-type-icon" />
              </template>
            </user-info-item>

            <user-info-item>
              <template #name>联系电话： {{ detail.mobile }}</template>
            </user-info-item>
          </template>

          <template #column-1>
            <user-info-item>
              <template #name>证件类型:</template>
              {{ detail.credentialTypeName }}
            </user-info-item>

            <user-info-item>
              <template #name>证件号码:</template>
              {{ detail.credentialNo }}
            </user-info-item>

            <user-info-item>
              <template #name>所在区: </template>
              {{ detail.areaName }}
            </user-info-item>
          </template>

          <template #column-2>
            <user-info-item>
              <template #name>性别: </template>
              {{ SexName[detail.gender] }}
            </user-info-item>

            <user-info-item>
              <template #name>年龄: </template>
              {{ detail.age ? detail.age : '-' }}
            </user-info-item>

            <user-info-item>
              <template #name>详细地址: </template>
              {{ detail.address }}
            </user-info-item>
          </template>
        </user-info>
      </div>

      <div class="body">
        <div class="title">长者信息</div>
        <Elders :list="detail.elderInfoDTOList || []" :member-id="+id" @unbind="onUnbind"></Elders>
      </div>

      <div class="body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="活动记录" name="1">
            <activity-records v-if="loaded" :value="+id"></activity-records>
          </el-tab-pane>

          <el-tab-pane label="咨询记录" name="2">
            <consult-records></consult-records>
          </el-tab-pane>

          <el-tab-pane label="评估记录" name="3">
            <evaluate-records wx-open-id="" :list="[]"></evaluate-records>
          </el-tab-pane>

          <el-tab-pane label="我的邀请" name="4">
            <my-invitaions value=""></my-invitaions>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>

    <template v-else>
      <div class="info" v-loading="loading" style="height: 80vh">加载中</div>
    </template>
  </div>
</template>

<script>
  import Elders from './components/elders';
  import UserInfo from '../../components/user-info';
  import UserInfoItem from '../../components/user-info-item';
  import { elderApi } from '@/mod-kangyang/src/api';
  import { SexName } from './constants';
  import avatorman from '../../images/avatorman.png';
  import avatorlady from '../../images/avatorlady.png';
  import { mapState } from 'vuex';
  import { formatEmptyTextInTable } from '@/mod-kangyang/src/utils';
  import ActivityRecords from '../../components/activity-records';
  import ConsultRecords from '../../components/consult-records';
  import EvaluateRecords from '../../components/evaluate-records';
  import MyInvitaions from '../../components/my-invitations';

  export default {
    name: 'FamilyMemberDetail',
    components: {
      UserInfo,
      UserInfoItem,
      Elders,
      ActivityRecords,
      ConsultRecords,
      EvaluateRecords,
      MyInvitaions,
    },

    data() {
      return {
        SexName,
        loading: false,
        activeTab: '1',
        detail: null,
        avatorDefault: {
          avatorman,
          avatorlady,
        },
        loaded: false,
      };
    },
    computed: {
      ...mapState({
        permissions: 'permissions',
      }),
      id() {
        return this.$route.params.id;
      },
      memberAvatar() {
        const { avatarUrl, gender } = this.detail;
        const { avatorman: man, avatorlady: lady } = this.avatorDefault;
        return avatarUrl || (gender === 1 ? man : lady);
      },
    },
    mounted() {
      this.getFamilyMemberDetail(this.id);
    },
    methods: {
      formatEmptyText() {
        const ret = arguments[2];
        return formatEmptyTextInTable(ret);
      },
      async getFamilyMemberDetail(id) {
        this.loaded = false;
        this.detail = null;
        try {
          this.loading = true;
          const { data } = await elderApi.getMemberDetail({ id });
          this.detail = data;
          this.loaded = true;
          this.loading = false;
        } catch (e) {}
      },
      onUnbind() {
        this.getFamilyMemberDetail(this.id);
      },
    },
  };
</script>

<style scoped>
  .info,
  .body {
    margin: 23px 0;
  }

  .info,
  .body {
    background-color: white;
  }

  .info {
    padding: 30px;
  }

  .body {
    padding-bottom: 24px;
  }

  .title {
    padding: 24px 24px 0;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .user-type-icon {
    height: 22px;
    width: 22px;
    vertical-align: middle;
  }

  .customer >>> .el-tabs__header {
    padding-bottom: 20px;
  }

  .customer >>> .el-tabs__nav-wrap {
    padding-left: 30px;
  }

  .customer >>> .el-tabs__nav-wrap::after {
    height: 1px;
  }

  .customer >>> .el-tabs__item {
    font-size: 18px;
    padding-top: 13px;
    height: 60px !important;
  }

  .customer >>> .el-tabs__active-bar {
    height: 3px;
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
  }

  .empty-text {
    text-align: center;
    color: #909399;
  }
</style>
