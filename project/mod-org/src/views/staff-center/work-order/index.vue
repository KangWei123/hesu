<template>
  <div v-loading="loading" style="min-height: 500px" class="wo-mgr">
    <div v-if="employee">
      <div class="name">{{ employee.name }}</div>
      <div class="phone">{{ employee.phone }}</div>

      <div class="way">
        <div class="title">排班方式</div>
        <div class="content">
          <el-radio-group v-model="data.workOrderType">
            <el-radio :label="1">默认排班({{ data.defaultOrderInfo }})</el-radio>
            <el-radio :label="2">自定义排班</el-radio>
          </el-radio-group>
          <div class="self-define">
            <div>时间范围</div>
            <work-hour-picker
              v-for="(item, index) in data.workDayOrderInfo"
              :key="index"
              :ref="'work_item' + index"
              :init-value="item"
              :rest-key="RestKey"
              :disabled.sync="isNotSelfDefined"
            ></work-hour-picker>
          </div>
          <div style="margin: 20px 0">
            <el-button :loading="submitting" class="dss-btn-primary dss-btn-middle" type="primary" @click="clickSave"
              >保存
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as staffApi from '@/mod-org/src/api/staffApi';
  import WorkHourPicker from '@/mod-org/src/components/WorkHourPicker/index.vue';

  function createWorkOrderInfo() {
    return [
      { startTime: 0, endTime: 0.5, label: '周一', key: 'Monday' },
      { startTime: 0, endTime: 0.5, label: '周二', key: 'Tuesday' },
      { startTime: 0, endTime: 0.5, label: '周三', key: 'Wednesday' },
      { startTime: 0, endTime: 0.5, label: '周四', key: 'Thursday' },
      { startTime: 0, endTime: 0.5, label: '周五', key: 'Friday' },
      { startTime: 0, endTime: 0.5, label: '周六', key: 'Saturday' },
      { startTime: 0, endTime: 0.5, label: '周日', key: 'Sunday' },
    ];
  }

  export default {
    components: { WorkHourPicker },
    props: {
      /* employee: {
          type: Object,
          default: null
        } */
    },
    data() {
      return {
        RestKey: -1,
        loading: false,
        submitting: false,
        employee: null,
        data: {
          defaultOrderInfo: '周一至周六10：00~22：00',
          employeeId: null,
          workOrderType: 1, // 1: 默认排班 ;2: 自定义排班
          workDayOrderInfo: [],
        },
      };
    },
    computed: {
      isNotSelfDefined() {
        return this.data.workOrderType != 2;
      },
    },
    // disabled
    mounted() {
      this.loading = true;
      staffApi
        .getEmployeeList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          positionId: this.positionId ? this.positionId : undefined,
          keyword: this.keyword ? this.keyword : undefined,
          storeId: this.storeId ? this.storeId : undefined,
          status: 1,
          id: this.$route.query.id,
        })
        .then(res => {
          if (res.data && res.data.length) {
            this.employee = res.data[0];
          }
          if (this.employee) {
            return staffApi.getEmployeeWorkOrder({ employeeId: this.$route.query.id });
          } else {
            return null;
          }
        })
        .then(res => {
          if (res) {
            const data = res.data;
            if (data) {
              for (const key in this.data) {
                if (key == 'workDayOrderInfo') {
                  if (data[key]) {
                    this.data[key] = data[key];
                  }
                } else if (key == 'workOrderType') {
                  this.data[key] = data[key] ? data[key] : 1;
                } else {
                  this.data[key] = data[key];
                }
              }
            }
            // 默认补充
            if (!this.data.workDayOrderInfo.length) {
              this.data.workDayOrderInfo = createWorkOrderInfo();
            }
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    methods: {
      clickSave() {
        const workDayOrderInfo = [];
        if (!this.isNotSelfDefined) {
          for (let i = 0; i < 7; i++) {
            if (this.$refs['work_item' + i]) {
              let item = this.$refs['work_item' + i][0];
              item = item.submit();
              if (item === false) {
                return;
              }
              workDayOrderInfo.push(item);
            }
          }
        }

        this.submitting = true;
        staffApi
          .updateEmployeeWorkOrder({
            employeeId: this.employee.id,
            workOrderType: this.data.workOrderType,
            workDayOrderInfoStr: workDayOrderInfo.length > 0 ? JSON.stringify(workDayOrderInfo) : undefined,
          })
          .then(() => {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
          })
          .always(() => {
            this.submitting = false;
          });
      },
    },
  };
</script>

<style lang="less">
  .wo-mgr {
    padding: 20px;
    font-family: MicrosoftYaHei;
    background-color: #fff;
    color: @black-color;

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

    .way {
      position: relative;
      margin-top: 20px;
    }

    .title {
      width: 100px;
      position: absolute;
      left: 0;
      top: 0;
      line-height: 1;
    }

    .content {
      margin-left: 70px;
      max-width: 350px;
      min-height: 100px;
      overflow: visible;

      .el-radio {
        display: block;
        margin-bottom: 8px;
        font-weight: normal;
      }

      .el-radio + .el-radio {
        margin-left: 0;
      }
    }

    .self-define {
      padding: 10px 0 0 26px;
      font-size: 12px;
      color: rgba(86, 105, 128, 1);

      .time-label {
        margin-right: 12px;
      }

      .el-select,
      .is-disabled {
        width: 95px;
        height: 22px;

        .el-select-dropdown__item {
          font-size: 12px;
        }

        .el-input__inner {
          font-size: 12px;
          height: 22px !important;
          line-height: 22px;
          outline: 0;
          padding: 0 10px;
        }
      }
    }
  }
</style>
