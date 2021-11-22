<template>
  <div v-loading="loading" style="min-height: 300px" class="employee-container">
    <div v-if="employee" class="view-employee">
      <div>
        <span class="item-name">员工姓名:</span>
        <span class="item-value">{{ employee.name }}</span>
      </div>
      <div>
        <span class="item-name">员工电话:</span>
        <span class="item-value">{{ employee.phone }}</span>
      </div>

      <div v-for="(key, index) in order" :key="index">
        <span class="item-name">{{ names[index] }}:</span>
        <span class="item-value">{{ employee[key] | empty }}</span>
      </div>

      <div>
        <span class="item-name">组织:</span>
        <el-table :data="employee.employeeStoreRoleList" class="dept-table">
          <el-table-column :label="`所属组织`" width="180">
            <template slot-scope="scope">
              {{ scope.row.deptName || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色" width="180"> </el-table-column>
        </el-table>
      </div>
      <div class="btn-wrap">
        <el-button type="primary" v-if="modifiable" @click="clickEdit">编辑 </el-button>
      </div>
      <div class="" v-if="isVerification">
        <hr class="employee-hr" />
        <div class="op-title">操作记录</div>
        <div class="op-off" v-if="!!env.BEAUTIFUL">
          <span>核销的预约：{{ count.verificationScheduledCount }}</span>
          <a href="javascript:;" class="table-href" @click="handleLoock(employee.id, 'scheduled')">查看</a>
        </div>
        <div class="op-off" v-if="!!env.BEAUTIFUL">
          <span>核销的次数卡：{{ count.verificationCardCount }}</span>
          <a href="javascript:;" class="table-href" @click="handleLoock(employee.id, 'card')">查看</a>
        </div>
        <div class="op-off">
          <span>核销的优惠券：{{ count.verificationCouponCount }}</span>
          <a href="javascript:;" class="table-href" @click="handleLoock(employee.id, 'coupons')">查看</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import dateUtil from '@/dss-common/utils/date';
  import * as staffApi from '@/mod-org/src/api/staffApi';

  export default {
    props: {
      // id: {
      //   type: Number,
      //   default: null
      // }
    },
    filters: {
      empty(val) {
        return val || '-';
      },
    },
    data() {
      return {
        loading: false,
        order: ['sex', 'employeeGroupName', 'createTimeFormat', 'desc'],
        employee: null,
        count: {},
        modifiable: false,
      };
    },

    computed: {
      ...mapState({
        userInfo: 'userInfo',
        env: 'env', // 行业类型
      }),

      storeLabel() {
        return this.env.ESTATE ? '区域' : '门店';
      },

      names() {
        return ['性别', '组别', '添加时间', '备注'];
      },

      // 是否获取操作记录
      isVerification() {
        if (this.employee && this.employee.positionId === 'common_role_verifications') {
          this.getVerificationCount(this.employee.id);
        }

        return this.employee && this.employee.positionId === 'common_role_verifications';
      },
    },

    async mounted() {
      await this.getPositionList();
      this.apiList();
    },
    methods: {
      // 获取角色列表
      getPositionList() {
        return staffApi.getPositionList().then(res => {
          this.positionList = res.data;
        });
      },
      /**
       * 上级可以修改下级，经销商同级可以修改经销商同级
       */
      hasmodifiable(identifier) {
        return !!this.positionList.find(item => item.identifier === identifier);
      },
      /**
       * 自己不能编辑删除自己
       */
      isMyself(perUserId) {
        return perUserId !== this.userInfo.userId;
      },
      // 查询员工列表
      apiList() {
        this.loading = true;
        staffApi
          .getEmployeeListV3({
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            positionId: this.positionId ? this.positionId : undefined,
            keyword: this.keyword ? this.keyword : undefined,
            storeId: this.storeId ? this.storeId : undefined,
            status: 1,
            id: this.$route.query.id,
          })
          .then(res => {
            console.log(res, 'res');
            if (res.data && res.data.length) {
              this.employee = res.data && res.data[0];
              if (this.employee) {
                if (this.employee.createTime) {
                  this.employee.createTimeFormat = dateUtil.format(new Date(this.employee.createTime));
                }
                this.employee.sex = this.employee.sex === '2' ? '男性' : this.employee.sex === '1' ? '女性' : '未知';
              }
              console.log(
                this.hasmodifiable(
                  this.employee.employeeStoreRoleList.length && this.employee.employeeStoreRoleList[0]
                    ? this.employee.employeeStoreRoleList[0].identifier
                    : ''
                ),
                'this.modifiable123'
              );
              this.modifiable =
                this.hasmodifiable(
                  this.employee.employeeStoreRoleList.length && this.employee.employeeStoreRoleList[0]
                    ? this.employee.employeeStoreRoleList[0].identifier
                    : ''
                ) &&
                this.isMyself(this.employee.perUserId) &&
                !this.employee.isSystem;
              console.log(this.modifiable, 'this.modifiable');
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      clickEdit() {
        // this.$emit('toEdit', this.employee);
        this.$router.push({
          path: '/companyManage/staff-center/list/add',
          query: { id: this.employee.id },
        });
      },

      handleLoock(id, type) {
        this.$router.push({
          path: '/companyManage/printer/staff/verification/' + type,
          query: {
            item: JSON.stringify({ id: id }),
          },
        });
      },

      getVerificationCount(id) {
        staffApi.getVerificationCount({ employeeId: id }).then(res => {
          this.count = res.data;
        });
      },
    },
  };
</script>
<style lang="less">
  .employee-container {
    .view-employee {
      padding: 20px;
      font-family: MicrosoftYaHei;
      background-color: #fff;
      overflow-x: hidden;

      .name {
        height: 21px;
        line-height: 21px;
        font-size: 16px;
        font-weight: bold;
        color: @black-color;
        margin-bottom: 5px;
      }

      .phone {
        width: 111px;
        height: 19px;
        font-size: 14px;
        color: @black-color;
        line-height: 19px;
        padding-bottom: 7px;
      }

      .item-name {
        width: 60px;
        height: 19px;
        line-height: 19px;
        color: rgba(86, 105, 128, 1);
        padding: 10px 20px 0 0;
        text-align: right;
        display: inline-block;
        font-size: 14px;
      }

      .item-value {
        display: inline-block;
        height: 19px;
        line-height: 19px;
        font-size: 14px;
        color: rgba(32, 37, 44, 1);
        text-align: left;
      }

      .dept-table {
        margin-left: 80px;
        width: 360px;
      }

      .btn-wrap {
        margin-top: 20px;
        margin-left: 85px;
      }

      .employee-hr {
        border: 0.5px solid #d7e0ea;
        width: 800px;
        margin: 20px 0;
      }

      .op-title {
        height: 21px;
        line-height: 21px;
        font-size: 16px;
        color: #20252c;
        margin-bottom: 5px;
      }

      .op-off {
        margin-top: 20px;
      }
    }

    .pl27 {
      padding-left: 27px;
    }
  }
</style>
