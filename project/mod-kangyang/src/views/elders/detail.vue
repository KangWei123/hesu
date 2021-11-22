<template>
  <div class="customer">
    <template v-if="detail">
      <div class="info">
        <user-info :avatar="elderAvatar" style="width: 64%">
          <template #name>
            {{ detail.name }}
          </template>

          <template #baseInfo>
            <user-info-item>
              <template #name>
                <span style="vertical-align: middle">长者</span>
                <img src="../../images/elder.png" style="height: 22px; width: 22px; vertical-align: middle" alt="" />
              </template>
            </user-info-item>

            <user-info-item>
              <template #name>联系电话: {{ detail.mobile }}</template>
            </user-info-item>
          </template>

          <template #column-1>
            <user-info-item>
              <template #name>证件类型:</template>
              <span>{{ detail.credentialTypeName }}</span>
            </user-info-item>

            <user-info-item>
              <template #name>证件号码:</template>
              <span>{{ detail.credentialNo | formatCardId }}</span>
            </user-info-item>

            <user-info-item>
              <template #name>出生日期: </template>
              {{ detail.birthday }}
            </user-info-item>

            <user-info-item>
              <template #name>所在地:</template>
              <span>{{ detail.areaName }}</span>
            </user-info-item>
          </template>

          <template #column-2>
            <user-info-item>
              <template #name>年龄: </template>
              {{ detail.age ? detail.age : '-' }}
            </user-info-item>

            <user-info-item>
              <template #name>性别: </template>
              {{ SexName[detail.gender] }}
            </user-info-item>

            <user-info-item>
              <template #name>国籍: </template>
              {{ detail.country }}
            </user-info-item>

            <user-info-item>
              <template #name>详细地址: </template>
              {{ detail.address }}
            </user-info-item>
          </template>

          <template #column-3>
            <user-info-item>
              <template #name>民族: </template>
              {{ detail.nation }}
            </user-info-item>

            <user-info-item>
              <template #name>认证状态: </template>
              <span>{{ AuthTypeName[detail.certifyState] }} </span>
            </user-info-item>

            <user-info-item>
              <template #name>信息来源: </template>
              <span>{{ detail.sourceTypeName }} </span>
            </user-info-item>
          </template>
        </user-info>

        <div class="faceId" v-if="detail.orgElder">
          <face-img :data="detail"></face-img>
        </div>
      </div>

      <div class="body">
        <div class="title">长者服务信息</div>

        <el-table :data="detail.elderPrjInfoList">
          <el-table-column label="序号" prop="idx"></el-table-column>
          <el-table-column label="所属项目" prop="prjName" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="房号" prop="roomNo" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="床位号" prop="bedNo" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="是否包房" prop="privateRoom">
            <template slot-scope="scope">
              <span>{{ scope.row.privateRoom == 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="护理等级" prop="nursingGrade" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="入住状态" prop="checkInState" :formatter="formatEmptyText">
            <template slot-scope="scope">
              {{ CheckInStateNameMapping[scope.row.checkInState] }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="body">
        <div class="body-header">
          <div class="title">亲友信息</div>
          <el-button type="primary" @click="handleClickAddMember">新增</el-button>
        </div>

        <el-table :data="detail.relationInfoList">
          <el-table-column label="序号" prop="idx"></el-table-column>
          <el-table-column label="姓名" prop="name" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="性别" prop="sex">
            <template slot-scope="scope">
              <span>{{ SexName[scope.row.gender] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="证件类型" prop="credentialTypeName" :formatter="formatEmptyText"> </el-table-column>
          <el-table-column label="证件号码" prop="credentialNo" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="与长者关系" prop="relationShip" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="家庭住址" prop="address" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="联系电话" prop="mobile" :formatter="formatEmptyText"></el-table-column>
          <el-table-column label="是否监护人" prop="isGuardian">
            <template slot-scope="scope">
              <span>{{ scope.row.isGuardian == 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="right" min-width="100" v-slot="scope">
            <table-actions
              :options="[
                { name: '编辑', onClick: () => handleEdit(scope.row) },
                { name: '解绑', type: 'danger', onClick: () => handleUnbind(scope.row) },
              ]"
            />
          </el-table-column>
        </el-table>
      </div>

      <div class="body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="活动记录" name="1">
            <activity-records v-if="loaded" :value="id"></activity-records>
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
  import UserInfo from '../../components/user-info';
  import UserInfoItem from '../../components/user-info-item';
  import ActivityRecords from '../../components/activity-records';
  import ConsultRecords from '../../components/consult-records';
  import EvaluateRecords from '../../components/evaluate-records';
  import MyInvitaions from '../../components/my-invitations';
  import { UserType, UserTypeName, AuthTypeName, SexName, CheckInStateNameMapping } from './constants';
  import avatorman from '../../images/avatorman.png';
  import avatorlady from '../../images/avatorlady.png';
  import { addIdxToListItem, formatCardId, formatEmptyTextInTable } from '../../utils';
  import FaceImg from './components/faceimg';
  import { elderApi } from '@/mod-kangyang/src/api';
  import { TableActions } from '@/dss-common/components/list-page/index';

  export default {
    name: 'ElderDetail',
    components: {
      UserInfo,
      UserInfoItem,
      FaceImg,
      ConsultRecords,
      EvaluateRecords,
      MyInvitaions,
      TableActions,
      ActivityRecords,
    },
    filters: {
      formatCardId(value) {
        return formatCardId(value);
      },
    },
    data() {
      return {
        SexName,
        UserType,
        AuthTypeName,
        UserTypeName,
        loading: false,
        activeTab: '1',
        detail: null,
        deviceInfoList: [],
        avatorDefault: {
          avatorman,
          avatorlady,
        },
        CheckInStateNameMapping: CheckInStateNameMapping,
        loaded: false,
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
      type() {
        return this.detail.identity;
      },
      isNormalCustomer() {
        return this.type == UserType.NormalCustomer;
      },
      isDependent() {
        return this.type == UserType.Dependent;
      },
      isElder() {
        return this.type == UserType.Elder || this.type == UserType.ElderAndDependent;
      },
      projectLists() {
        return this.projectData;
      },
      elderAvatar() {
        const { avatarUrl, gender } = this.detail;
        const { avatorman: man, avatorlady: lady } = this.avatorDefault;
        return avatarUrl || (gender === 1 ? man : lady);
      },
    },
    mounted() {
      this.getElderDetail(this.id);
    },
    methods: {
      formatEmptyText() {
        const ret = arguments[2];
        return formatEmptyTextInTable(ret);
      },
      async getElderDetail(id) {
        this.loading = true;
        const { data } = await elderApi.getDetail({ id: id });
        data.elderPrjInfoList = addIdxToListItem(data.elderPrjInfoList || [], 1, 100);
        data.relationInfoList = addIdxToListItem(data.relationInfoList || [], 1, 100);
        this.detail = data;
        this.loading = false;
        this.loaded = true;
      },
      handleEdit(row) {
        this.$router.push({
          name: 'elder.member.edit',
          params: {
            elderId: this.id,
            id: row.id,
          },
        });
      },
      handleUnbind(row) {
        try {
          this.$confirm(`确认要解绑吗？`, '', { type: 'warning' })
            .then(async () => {
              await elderApi.unbind({
                elderId: +this.id,
                relationId: row.id,
              });
              this.getElderDetail(this.id);
            })
            .catch(f => {
              console.log(f);
            });
        } catch (err) {
          console.error(err);
        }
      },
      handleClickAddMember() {
        this.$router.push({
          name: 'elder.member.create',
          params: {
            elderId: this.id,
          },
        });
      },
    },
  };
</script>

<style scoped>
  .breadcrumb,
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

  .faceId {
    display: inline-block;
    padding-left: 28px;
    position: absolute;
    border-left: 2px solid #d6d8dd;
  }

  .body-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
  }
</style>
