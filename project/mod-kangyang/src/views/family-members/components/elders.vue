<template>
  <div class="elders">
    <fat-table ref="table" :loading="loading" :fetch-handler="handleFetch">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">
          <span>{{ SexName[scope.row.gender] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" prop="credentialTypeName"></el-table-column>
      <el-table-column label="证件号码" prop="credentialNo">
        <template slot-scope="scope">
          <span>{{ scope.row.credentialNo | formatCardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="与长者关系" prop="relationShip"></el-table-column>
      <el-table-column label="家庭住址" prop="address"></el-table-column>
      <el-table-column label="联系电话" prop="mobile"></el-table-column>
      <el-table-column label="是否监护人">
        <template slot-scope="scope">
          {{ scope.row.isGuardian ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" v-slot="scope">
        <table-actions :options="[{ name: '解绑', type: 'danger', onClick: () => confirm(scope.row.id) }]" />
      </el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import { SexName } from '../constants';
  import { elderApi } from '@/mod-kangyang/src/api/elder';
  import { formatCardId } from '@/mod-kangyang/src/utils';

  /**
   * 亲友详情下的长者列表
   */
  export default {
    components: {
      FatTable,
      TableActions,
    },
    props: {
      list: {
        type: Array,
        required: true,
      },
      memberId: {
        type: Number,
        required: true,
      },
    },
    filters: {
      formatCardId(value) {
        return formatCardId(value);
      },
    },
    data() {
      return {
        SexName: SexName,
      };
    },
    watch: {
      list: {
        handler() {
          this.$refs.table.fetch();
        },
      },
    },
    mounted() {
      setTimeout(() => {
        this.search();
      }, 0);
    },
    methods: {
      search() {
        this.$refs.table.fetch();
      },
      handleFetch() {
        return {
          list: this.list,
          total: this.list.length,
        };
      },
      confirm(id) {
        this.$confirm(`确认要解绑吗？`, '', { type: 'warning' })
          .then(async () => {
            await elderApi.unbind({
              id,
              memberId: this.memberId,
            });
            this.$emit('unbind', {
              id,
            });
            this.$message.success('解绑成功!');
          })
          .catch(f => {
            console.log(f);
          });
      },
    },
  };
</script>

<style scoped>
  .elders {
    padding: 0 24px;
  }
</style>

<style lang="less">
  .confirm-unbind-dialog {
    .el-message-box__title {
      justify-content: flex-start;
    }

    .el-message-box__message {
      padding: 28px 0;
    }
  }
</style>
