<template>
  <el-dialog :visible.sync="dialogVisible" width="800">
    <div class="title" slot="title">积分规则</div>
    <list-page-layout>
      <template #filters>
        <el-form class="filter" ref="form" :model="form" @submit.prevent.native="$refs.table.search()" inline>
          <el-form-item label="活动名称" prop="ruleName">
            <el-input class="w220" v-model="form.ruleName" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">搜索</el-button>
            <el-button plain @click="$refs.form.resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <fat-table
        class="fat-table"
        ref="table"
        :fetch-handler="handleFetch"
        :state.sync="form"
        row-key="id"
        highlight-current-row
      >
        <el-table-column header-align="center" align="center" prop="ruleName" label="规则名称"> </el-table-column>
        <el-table-column header-align="center" align="center" prop="score" label="积分数量">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="validStartTime" label="有效时间">
          <template slot-scope="scope">
            <span v-if="scope.row.validType === validityType.permanent">永久</span>
            <div v-else>
              <div>{{ scope.row.validStartTime.slice(0, -3) }}</div>
              <div>{{ scope.row.validEndTime.slice(0, -3) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="createBy" label="创建人"> </el-table-column>
        <el-table-column header-align="center" align="center" label="适用范围">
          <template slot-scope="scope">
            <span v-text="scope.row.validAppName ? scope.row.validAppName : '全部'"></span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="prop" label="操作">
          <template slot-scope="scope">
            <!-- <el-checkbox
              v-model="scope.row.checked"
              @change="selectedChange($event, scope.$index, scope.row)"
            ></el-checkbox> -->
            <el-button type="primary" @click="onSelect(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </fat-table>
    </list-page-layout>
    <!-- <div slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div> -->
  </el-dialog>
</template>
<script>
  import { validityType } from '../../views/score-center/enum/score';
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import memberApi from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'ScoreRuleSelect',
    components: {
      ListPageLayout,
      FatTable,
    },
    data() {
      return {
        validityType,
        dialogVisible: false,
        selectItem: null,
        form: {
          ruleName: '',
        },
      };
    },
    mounted() {
      this.form.ruleName = '';
    },
    methods: {
      open() {
        this.dialogVisible = true;
      },
      cancel() {
        this.dialogVisible = false;
      },
      confirm() {
        this.dialogVisible = false;
        this.$emit('selected', this.selectItem);
      },
      dateToString(now) {
        const year = now.getFullYear();
        let month = (now.getMonth() + 1).toString();
        let day = now.getDate().toString();
        let hour = now.getHours().toString();
        let minute = now.getMinutes().toString();
        let second = now.getSeconds().toString();
        if (month.length === 1) {
          month = '0' + month;
        }
        if (day.length === 1) {
          day = '0' + day;
        }
        if (hour.length === 1) {
          hour = '0' + hour;
        }
        if (minute.length === 1) {
          minute = '0' + minute;
        }
        if (second.length === 1) {
          second = '0' + second;
        }
        const dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
      },
      async handleFetch(e) {
        const params = {
          pageSize: e.pagination.pageSize,
          pageNo: e.pagination.currentPage,
          ruleType: '1',
          ...this.form,
          checkTime: this.dateToString(new Date()),
        };
        const result = await memberApi.scoreCenter.list(params);
        const list = result.data || [];
        return {
          list: list.map(item => {
            item.checked = false;
            return item;
          }),
          total: result.totalCount,
        };
      },
      onSelect(item) {
        this.selectedId = item.id;
        // this.$refs.table.updateCheckboxSelected(index);
        this.selectItem = item;
        this.confirm();
      },
      selectedChange(e, index, item) {
        this.selectedId = item.id;
        this.$refs.table.updateCheckboxSelected(index);
        this.selectItem = item;
      },
    },
  };
</script>

<style lang="less">
  .filter {
    margin-left: -25px;
    padding: 0px;
    width: 480px;
  }
  .select {
    color: @ui-theme-color-orange;
  }
</style>
