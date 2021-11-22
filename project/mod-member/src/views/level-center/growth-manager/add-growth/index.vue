<template>
  <div class="container">
    <form-page-layout
      class="form-page-layout-container"
      :model="form"
      :rules="rules"
      label-width="126px"
      :title-visible="false"
      :submit-handler="handleSubmit"
      ref="elForm"
    >
      <form-group>
        <template #title>{{ status === 0 ? '新增' : status === 1 ? '编辑' : '详情' }}</template>
        <el-form-item label="选择应用" prop="appId">
          <app-select
            class="w220"
            v-model="form.appId"
            clearable
            need-all-app
            @allAppData="allAppData"
            @change="appIdChange"
            :disabled="status != 0"
            placeholder="请选择应用"
          ></app-select>
        </el-form-item>
        <el-form-item label="适用项目" prop="storeIds">
          <el-button class="el-button-text" type="text" @click="selectStore">选择项目</el-button>
          <br />
          <el-table class="store-table" v-show="showStore" border :data="currentStoreList">
            <el-table-column prop="name" label="项目名称" align="center"> </el-table-column>
            <el-table-column prop="area" label="项目区域" align="center">
              <template slot-scope="scope">
                <span v-text="scope.row.province + scope.row.city + scope.row.district"></span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="storeDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="获取方式" prop="accessType">
          <el-table class="el-form-item-table" :data="scoreEvent" border>
            <el-table-column prop="eventDesc" label="事件类型" width="200" align="center">
              <template slot-scope="{ row, $index }">
                <el-select v-if="$index === 0" v-model="scoreEvent[0].eventCode" @change="eventCodeChange">
                  <el-option
                    v-for="item in eventList"
                    :key="item.eventCode"
                    :label="item.eventDesc"
                    :value="item.eventCode"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ row.eventDesc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="成长值设置" align="center">
              <template slot-scope="scope">
                <div v-if="scope.$index !== 0">
                  <span class="span" style="margin-right: 10px">增长</span>
                  <el-input
                    type="number"
                    min="0"
                    style="width: 90px"
                    v-model="scope.row.value"
                    @change="changeGrowth(scope.row, scope.$index)"
                  ></el-input>
                  <span class="span" style="margin-left: 10px">成长值</span>
                </div>
                <div v-else>
                  <span class="span" style="margin-right: 10px" v-show="scope.row.eventCode === 2">1次获得</span>
                  <el-input
                    type="number"
                    min="0"
                    style="width: 90px"
                    v-model="scope.row.value"
                    @change="changeGrowth(scope.row, scope.$index)"
                  ></el-input>
                  <span class="span" style="margin-left: 10px">
                    {{ scope.row.eventCode === 2 ? '成长值' : '元获得1成长值' }}
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <span class="tips">填写“0”代表该事件不可增加成长值</span>
        </el-form-item>
        <el-form-item label="月获取上限" prop="limitPerMonth">
          <el-input
            class="w220"
            type="number"
            min="0"
            v-model="form.limitPerMonth"
            placeholder="不填则表示无限制"
          ></el-input
          ><span class="span">&emsp;成长值</span>
          <br />
        </el-form-item>
      </form-group>
      <template #footer>
        <form-button action="cancel" />
        <form-button />
      </template>
    </form-page-layout>
    <store-select-dialog
      ref="storeSelectDialog"
      :select-ids.sync="selected"
      :app-obj="currentApp"
      :select-data.sync="storeList"
      :selected="selected"
      @confirm="confirm"
      @cancel="cancel"
    ></store-select-dialog>
  </div>
</template>

<script>
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import AppSelect from '@/business-common/components/app-select';
  import StoreSelectDialog from '@/business-common/components/store-select-dialog/index';
  import { scoreEvent, EVENT_LIST } from './score-event';

  export default {
    name: 'AddGrowth',
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
      AppSelect,
      StoreSelectDialog,
    },
    data() {
      return {
        // status  0:新增，1：编辑， 2:查看
        status: 0,
        scoreEvent: JSON.parse(JSON.stringify(scoreEvent)),
        showStore: false,
        selected: [],
        storeList: [],
        currentStoreList: [],
        showProjectDialog: false,
        scoreJson: {},
        appList: [],
        currentApp: {},
        eventList: JSON.parse(JSON.stringify(EVENT_LIST)),
        form: {
          appId: '',
          storeIds: '',
          scoreJson: null,
          amount: '',
          growth: '',
          limitPerMonth: null,
        },

        rules: {
          appId: [{ required: true, message: '请选择应用', trigger: 'blur' }],
          type: [{ required: true, message: '请选择获取方式', trigger: 'blur' }],
          storeIds: [{ required: true, message: '请选择适用项目' }],
        },
      };
    },
    watch: {
      storeList: {
        handler(val, oldVal) {
          if (val.length === 0) {
            this.showStore = false;
          }
        },
      },
    },
    async mounted() {
      // status  0:新增，1：编辑， 2:查看
      this.status = this.$route.query.status;
      if (this.$route.query.id) {
        const id = this.$route.query.id;
        this.growthDetail(id);
      }
    },
    methods: {
      async handleSubmit() {
        const params = { ...this.form };
        params.configs = this.scoreEvent;

        const condition = !(this.form.limitPerMonth === '' || this.form.limitPerMonth === 0);
        const obj = this.scoreEvent[0];
        const illegal = obj.eventCode === 2 && condition && parseInt(obj.value) > this.form.limitPerMonth;

        if (illegal && parseInt(this.form.limitPerMonth) !== 0 && this.form.limitPerMonth !== null) {
          this.$message.error('月获取上限必须大于等于单次消费获取的成长值');
          throw new Error('月获取上限必须大于等于单次消费获取的成长值');
        } else {
          if (this.status === 0 || this.status === '0') {
            await memberApi.growthConfig.addConfig(params);
          } else if (this.status === 1 || this.status === '1') {
            await memberApi.growthConfig.updateConfig(params);
          }
        }
      },
      confirm() {
        this.currentStoreList = this.storeList;
        this.showStore = this.selected.length !== 0;
        this.form.storeIds = this.selected.join(',');
        this.$refs.elForm.validate();
      },
      cancel() {
        this.storeList = this.currentStoreList;
      },
      back() {
        this.$router.back(-1);
      },
      storeDelete(index) {
        this.currentStoreList.splice(index, 1);
        this.form.storeIds = this.currentStoreList.map(v => v.id).join(',');
      },
      changeGrowth(e, row) {
        if (e.value < 0) {
          e.value = 0;
        }
        this.scoreEvent.splice(row, 1, e);
      },
      eventCodeChange(e) {
        this.scoreEvent[0].eventDesc = e === 1 ? '消费金额' : '消费次数';
        this.scoreEvent[0].value = '';
      },
      growthDetail(id) {
        return memberApi.growthConfig.configDetail({ id }).then(res => {
          if (res.success) {
            this.form = res.data;
            res.data.configs.forEach(item => {
              const index = this.scoreEvent.findIndex(it => it.eventCode === item.eventCode);
              if (index >= 0) {
                this.scoreEvent[index].value = item.value;
              } else {
                const event = this.eventList.find(it => it.eventCode === item.eventCode);
                if (event) {
                  this.$set(this.scoreEvent, 0, { ...event });
                  this.scoreEvent[0].value = item.value;
                }
              }
            });
            this.storeList = res.data.storeList || [];
            this.currentStoreList = this.storeList;
            this.showStore = this.storeList.length !== 0;
            this.selected = this.storeList.map(v => v.id);
          }
        });
      },
      selectStore() {
        if (this.form.appId === undefined || this.form.appId === '') {
          this.$message({
            type: 'warning',
            message: '请先选择应用',
          });
          return;
        }
        const appIndex = this.appList.findIndex(it => it.id === this.form.appId);
        this.currentApp = this.appList[appIndex];
        this.selected = this.currentStoreList.map(item => item.id);
        this.$refs.storeSelectDialog.open();
      },
      allAppData(list) {
        this.appList = list;
      },
      appIdChange() {
        this.storeList = [];
        this.selected = [];
        this.form.storeIds = '';
      },
    },
  };
</script>

<style lang="less">
  .container {
    width: 100%;
    background: white;

    .form-page-layout-container {
      .el-form-item__label {
        color: #303133;
      }

      .el-col-2 {
        height: 40px;
      }

      .el-radio__label {
        color: @ui-font-color-black;
        font-weight: 400;
      }

      .tips {
        margin-top: -10px;
        color: #666;
        font-size: 12px;
        margin-bottom: 10px;
      }

      .span {
        color: #606266;
        // font-weight: 500;
      }

      .el-button-text {
        padding: 0 10px;
        height: 30px;
        border: solid @ui-theme-color-orange 1px;
      }

      .el-radio {
        height: 50px;
      }

      .el-form-item-table {
        margin-left: 0;
        margin-bottom: 20px;
        width: 600px;

        td {
          padding: 10px 0;

          .cell {
            padding: 0;
          }
        }
      }

      .store-table {
        width: 800px;

        td,
        th {
          padding: 10px 0;
        }
      }

      .el-form-item-input {
        width: 200px;
      }

      .el-form-item-button {
        height: 40px;
        width: 80px;
      }

      .el-form-item-button:last-child {
        margin-left: 40px;
      }
    }
  }
</style>
