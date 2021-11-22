<template>
  <div>
    <div class="assets-index assets-border">
      <div class="assets-head">
        <h3 class="assets-title">账户信息</h3>

        <el-row>
          <el-form ref="form" :model="form" :rules="rules" label-width="76px">
            <el-col :span="5">
              <div class="assets-money-box">
                <div class="assets-tip">现金余额</div>
                <strong class="assets-money">￥1809</strong>

                <div class="assets-money-btn">
                  <a href="#/assets/recharge">充值</a>
                  <a href="">提现</a>
                </div>
              </div>
            </el-col>

            <el-col :span="6">
              <el-form-item class="mt20" label="余额预警">
                <el-switch
                  v-model="form.warning"
                  active-color="#20B834"
                  @change="formSubmit(0)"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>

              <el-form-item prop="money" style="margin:0;" label="预警阀值">
                <el-input v-model="form.money" @change="formSubmit(1)" style="width:220px;"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item class="mt70" prop="phone" label-width="100px" label="接收提醒手机">
                <el-input v-model="form.phone" @change="formSubmit(2)" style="width:220px;"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <div class="assets-expense">
        <h3 class="assets-title">消费信息</h3>

        <div class="assets-expense-content">
          <div class="assets-expense-box">
            <div class="assets-img"></div>

            <div class="assets-money">
              <strong>￥1809</strong>
              今日消费金额
            </div>
          </div>

          <div class="assets-expense-box">
            <div class="assets-img"></div>

            <div class="assets-money">
              <strong>￥1809</strong>
              本月消费金额
            </div>
          </div>

          <div class="assets-expense-box">
            <div class="assets-img"></div>

            <div class="assets-money">
              <strong>￥1809</strong>
              历史消费金额
            </div>
          </div>
        </div>
      </div>

      <div class="assets-expense-list">
        <h3 class="assets-title">交易记录</h3>
      </div>
    </div>

    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="date" label="编号" width="180">
        <el-popover slot="header" placement="right" width="150" trigger="hover" content="订单号或支付单号">
          <span slot="reference">
            编号
            <i class="el-icon-question" />
          </span>
        </el-popover>
      </el-table-column>
      <el-table-column prop="name" label="时间" width="180"> </el-table-column>
      <el-table-column prop="address" label="名称"> </el-table-column>
      <el-table-column prop="address" label="金额"> </el-table-column>
      <el-table-column prop="address" label="状态"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import regexps from '@/dss-common/utils/regexps.js';

export default {
  data() {
    const { money, phone } = regexps;

    return {
      form: {
        warning: true,
        money: '',
        phone: ''
      },
      rules: {
        money: [{ pattern: money.reg, message: money.msg }],
        phone: [{ pattern: phone.reg, message: phone.msg }]
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      loading: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  computed: {},
  methods: {
    formSubmit(index) {
      this.$refs.form.validate().then(valid => {
        this.$message({
          message: '修改成功' + index,
          type: 'success'
        });
      });
    }
  }
};
</script>
