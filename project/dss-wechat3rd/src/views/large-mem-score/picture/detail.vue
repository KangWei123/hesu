<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="110px"
    :title-visible="false"
    :submit-handler="handleSubmit"
    ref="form"
  >
    <div class="flex__box">
      <div class="flex__item img">
        <viewer v-if="form.voucherImg" :options="options" class="image" ref="viewer">
          <img class="image" :src="form.voucherImg" :data-source="form.voucherImg" alt="用户小票图片" />
        </viewer>
        <div v-else class="image">暂无图片</div>
      </div>
      <form-group class="flex__item info">
        <template #title>小票信息</template>
        <el-form-item label="项目名称">{{ form.storeName }}</el-form-item>
        <el-form-item label="状态">{{ PictureStatusMap[lockStatus] }}</el-form-item>
        <el-form-item label="积分单编号">{{ form.scoreNum }}</el-form-item>
        <el-form-item label="提交时间">{{ form.submitTime }}</el-form-item>
        <el-form-item label="审核结果" v-if="isAudit" prop="status">
          <el-radio-group v-model="form.status" @change="$refs.form.clearValidate()">
            <el-radio :label="PictureStatus.SUCCESS">通过</el-radio>
            <el-radio :label="PictureStatus.REJECTED">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.status === PictureStatus.SUCCESS || form.status === PictureStatus.WAIT_CHECK">
          <el-form-item label="商户" prop="storeId">
            <el-select
              v-model="form.storeId"
              placeholder="请选择商户"
              class="w250"
              :disabled="lock"
              @change="computedTheproportion"
              filterable
            >
              <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <br />
            <div class="tips" v-if="consume !== 0 && form.storeId">消费积分比例:{{ consume }}:1</div>
            <div class="tips" v-else>暂无商户消费积分比例</div>
          </el-form-item>
          <el-form-item label="消费时间" prop="consumeTime">
            <el-date-picker
              type="datetime"
              placeholder="选择日期"
              v-model="form.consumeTime"
              :disabled="lock"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="w250"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="金额" prop="consumeAmount">
            <el-input
              placeholder="请输入金额"
              class="w250"
              v-model="form.consumeAmount"
              :disabled="lock"
              @change="computedTheproportion"
            ></el-input>
          </el-form-item>
          <el-form-item label="本次积分">
            <el-input class="w250" :value="form.availableScore || 0" disabled />
            <div class="tips">根据金额，按商户积分比例自动计算</div>
          </el-form-item>
          <el-form-item label="小票号码" prop="orderNum">
            <el-input placeholder="请输入小票号码" class="w250" v-model="form.orderNum" :disabled="lock"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="驳回原因" prop="reason">
            <el-select
              filterable
              allow-create
              placeholder="请选择或输入拒绝原因"
              v-model="form.reason"
              class="w250"
              :disabled="!isAudit"
              clearable
            >
              <el-option
                v-for="item of reasonList"
                :label="item.replyContant"
                :key="item.id"
                :value="item.replyContant"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="备注"
            class="w250"
            v-model="form.remark"
            :disabled="!isAudit"
          ></el-input>
        </el-form-item>
      </form-group>
      <form-group class="flex__item info">
        <template #title>会员信息</template>
        <div class="user__info">
          <div class="item">用户名: {{ form.nickName || '未知' }}</div>
          <div class="item">性别: {{ genderType[form.gender] || '未知' }}</div>
          <div class="item">会员等级: {{ form.memberLevelName || '无' }}</div>
          <div class="item">手机号码: {{ form.phone || '未知' }}</div>
          <div class="item">当前积分: {{ form.score || 0 }}</div>
          <div class="item">上次消费时间: {{ form.lastConsumeTime || '无' }}</div>
          <div class="item">上次消费商户: {{ form.lastSubStoreName || '无' }}</div>
          <div class="item">上次消费金额: {{ (form.lastAmount || 0) | price }} 元</div>
        </div>
      </form-group>
    </div>
    <template #footer>
      <form-button action="cancel" />
      <form-button v-if="isAudit">确定</form-button>
      <el-button type="primary" v-if="isAudit === 'audit'" @click="handleSubmitAndNext">确定并下一条</el-button>
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import 'viewerjs/dist/viewer.css';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import api from '@/dss-wechat3rd/src/api/large-mem-score';
  import { PictureStatus, PictureStatusMap } from './constants.ts';
  import regexps from '@/dss-common/utils/regexps';

  const genderType = ['未知', '男', '女'];

  export default {
    name: 'Detail',
    components: {
      FormGroup,
      FormButton,
      FormPageLayout,
    },
    computed: {
      id() {
        return this.$route.query.id;
      },
      isAudit() {
        return this.$route.query.isAudit;
      },
      ...mapState({
        curStore: 'curStore',
      }),
    },
    data() {
      return {
        options: {
          inline: true,
          button: true,
          navbar: true,
          title: false,
          toolbar: true,
          movable: true,
          zoomable: true,
          rotatable: true,
          scalable: true,
          transition: true,
          keyboard: true,
          url: 'data-source',
        },
        genderType,
        consume: 0,
        // 状态锁死
        lockStatus: undefined,
        // 重新审核禁用状态
        lock: undefined,
        // 表单
        form: {
          voucherImg: '',
          storeName: '-',
          status: 0,
          scoreNum: '-',
          submitTime: '-',
          subStoreName: '',
          storeId: undefined,
          consumeTime: '',
          consumeAmount: undefined,
          availableScore: undefined,
          orderNum: undefined,
          remark: '',
          nickName: '',
          gender: '',
          memberLevelName: '',
          phone: '',
          score: undefined,
          lastConsumeTime: '',
          lastSubStoreName: '',
          lastAmount: undefined,
          uniqueAccountId: undefined,
        },
        // 校验规则
        rules: {
          status: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
          storeId: [{ required: true, message: '请选择商户', trigger: 'blur' }],
          consumeTime: [{ required: true, message: '请选择消费时间', trigger: 'blur' }],
          consumeAmount: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { pattern: regexps.money.reg, message: '请输入正确的金额', trigger: 'blur' },
          ],
          orderNum: [
            { required: true, message: '请输入正确的小票号', pattern: regexps.charAndNum.reg, trigger: 'blur' },
          ],
          reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
        },
        PictureStatus,
        PictureStatusMap,
        storeOptions: [],
        // 驳回原因
        reasonList: [],
        // 限制不能选择当前时刻后面的时间
        pickerOptions: {
          disabledDate: time => {
            return time.getTime() > Date.now();
          },
        },
      };
    },
    beforeMount() {
      this.getStoreList();
    },
    mounted() {
      this.getReasonList();
      this.getDetail(this.id);
    },
    methods: {
      // 获取拍照积分详情
      async getDetail(id) {
        const { data } = await api.picture.getDetail(id);
        this.form = data;
        this.form.storeId = data.subStoreId;
        this.form.consumeAmount = this.form.consumeAmount / 100;
        this.lockStatus = data.status;
        this.lock = !this.isAudit || (!!data.subStoreId && !!data.consumeAmount);
      },
      // 获取商户列表
      async getStoreList() {
        const { data } = await api.customer.queryBusinessList({
          pageNo: 1,
          pageSize: 100,
        });
        this.storeOptions = data.filter(i => !!i.active);
      },
      // 计算积分比例及金额
      computedTheproportion() {
        if (this.form.storeId && this.form.consumeAmount) {
          const params = {
            subStoreId: this.form.storeId,
            consumeAmount: Number(this.form.consumeAmount),
          };
          api.customer
            .queryCalculation(params)
            .done(res => {
              this.consume = res.data.consume;
              this.form.availableScore = res.data.availableScore;
            })
            .catch(e => {
              console.log(e);
            });
        }
      },
      // 审核的数据
      getParams() {
        const formData = this.form;
        const paramsData = {
          auditResult: formData.status === 1,
          availableScore: formData.availableScore,
          consumeAmount: Number(formData.consumeAmount) * 100, // 转换为分
          consumeTime: formData.consumeTime,
          id: Number(this.id),
          orderNum: formData.orderNum,
          reason: formData.status === this.PictureStatus.SUCCESS ? '' : formData.reason,
          remark: formData.remark,
          scoreNum: formData.scoreNum,
          scoreType: 1,
          subStoreId: formData.storeId,
          uniqueAccountId: formData.uniqueAccountId,
          voucherImg: formData.voucherImg,
        };
        return paramsData;
      },
      // 审核
      async handleSubmit() {
        await api.picture.examine(this.getParams());
      },
      // 确认审核并下一条
      async handleSubmitAndNext() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const res = await api.picture.examine(this.getParams()).catch(e => {
              console.log(e);
            });
            if (res.data === 0) {
              this.$message.info('没有待审核数据');
            } else {
              this.form = this.$options.data().form;
              this.$message.success('审核成功');
              await this.getDetail(res.data);
            }
          }
        });
      },
      // 获取驳回原因
      async getReasonList() {
        const payload = {
          // type：1为意见反馈，2为积分快捷回复
          typeStatus: 2,
          pageSize: 100,
          pageNum: 1,
        };
        const { data } = await api.picture.configList(payload);
        this.reasonList = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  .flex__box {
    display: flex;
    width: 100%;

    .el-form-item {
      margin-bottom: 20px !important;
    }
  }

  .flex__item {
    min-width: 350px;

    &.img {
      width: 350px;
      height: 480px;
      position: relative;
    }

    & .image {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      & img {
        visibility: hidden;
      }
    }
  }

  .tips {
    color: #757372;
    font-size: 10px;
  }

  .info {
    margin-left: 40px;
  }

  .user__info {
    width: 350px;
    margin: 0 10px;
    background: #f3fbfe;
    color: #717378;
    padding: 30px;
    box-sizing: border-box;

    .item {
      margin: 16px 0;
    }
  }
</style>
