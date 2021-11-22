<template>
  <div class="activities">
    <fat-table ref="table" :fetch-handler="handleFetch">
      <el-table-column label="邀请信息" width="240">
        <template slot-scope="scope">
          <div class="info">
            <el-image class="info__avatar" :src="scope.row.avatarUrl" />
            <div class="info__inner">
              <p>{{ scope.row.nickName }}</p>
              <p>{{ scope.row.phone || '未绑定手机号' }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="kinsfolkName"></el-table-column>
      <el-table-column label="亲友与长者关系" prop="relationName"></el-table-column>
      <el-table-column label="认证时间" prop="authTime">
        <template slot-scope="scope">
          <p>{{ scope.row.authTime | dateFormat }}</p>
        </template>
      </el-table-column>
      <el-table-column label="客户来源" prop="channelName"></el-table-column>
      <el-table-column label="项目归属" prop="orgName"></el-table-column>
      <el-table-column label="认证状态">
        <template slot-scope="scope">
          <p>{{ scope.row.inviteStatus ? '已认证' : '未认证' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="审批状态">
        <template slot-scope="scope">
          <p>{{ approveStatusTypesNames[scope.row.approveStatus] }}</p>
        </template>
      </el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import dateUtils from '@/dss-common/utils/date';

  const approveStatusTypes = {
    WAITING: 0,
    SUCCESS: 1,
    REFUSE: 2,
  };

  const approveStatusTypesNames = {
    [approveStatusTypes.WAITING]: '未审批',
    [approveStatusTypes.SUCCESS]: '审核通过',
    [approveStatusTypes.REFUSE]: '审核拒绝',
  };

  /**
   * 我的邀请
   */
  export default {
    filters: {
      dateFormat(date) {
        if (!date) return '';
        return dateUtils.format(new Date(date));
      },
    },
    components: {
      FatTable,
    },
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        approveStatusTypesNames,
      };
    },
    methods: {
      handleSearch() {
        this.$refs.table.search();
      },

      async handleFetch(params) {
        return {
          list: [],
          total: 0,
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  .info {
    display: flex;
    align-items: center;
    white-space: nowrap;

    &__avatar {
      margin-right: 10px;
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    p {
      margin: 0;
    }
  }
</style>
