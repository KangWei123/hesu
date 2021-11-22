<template>
  <div class="taskcenter">
    <div class="title">
      <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
        <el-breadcrumb-item :to="{ path: '/marketing/task-center/list' }" replace>代言任务</el-breadcrumb-item>
        <el-breadcrumb-item>创建任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <el-form-item label="任务名称：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入" style="width: 380px" :disabled="!canEdit"></el-input>
      </el-form-item>
      <el-form-item label="任务时间：" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="datetimerange"
          placeholder="选择日期时间"
          class="input-left"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
          @change="dateHaldChange"
          size="small"
          style="width: 380px"
          :disabled="!canEdit"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="任务内容：" prop="task">
        <el-select
          v-model="ruleForm.task"
          placeholder="请选择"
          style="width: 380px"
          @change="selectChange"
          :disabled="!canEdit"
        >
          <el-option
            v-for="item in ruleForm.taskOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请页面：" prop="pagePath" v-if="ruleForm.task === 1">
        <div style="width: 380px">
          <el-cascader
            expand-trigger="hover"
            :options="pageOptions"
            placeholder="选择邀请页面"
            v-model="ruleForm.pagePath"
            separator="-"
            :disabled="!canEdit"
          />
        </div>
      </el-form-item>
      <el-form-item label="海报封面：" prop="coverImage">
        <choose-images
          :is-disabled-edit="!canEdit"
          v-model="ruleForm.coverImage"
          @delete="ruleForm.coverImage = null"
          :height="176"
          style="margin-right: 10px"
        />
        <span class="tip">建议尺寸：500*400 活动海报将用于海报生成和小程序卡片</span>
      </el-form-item>
      <el-form-item label="直播ID：" v-if="ruleForm.task === 2" prop="palyId">
        <el-input v-model="ruleForm.palyId" placeholder="请输入" style="width: 250px" :disabled="!canEdit"></el-input>
      </el-form-item>
      <el-form-item
        :label="'选择' + ruleForm.title + '：'"
        prop="groupBooking"
        v-if="(ruleForm.task && ruleForm.task == 3) || ruleForm.task == 4 || ruleForm.task == 5"
      >
        <el-radio-group v-model="ruleForm.groupBooking" :disabled="!canEdit">
          <el-radio label="assign" name="assign">{{ '指定' + ruleForm.title }}</el-radio>
        </el-radio-group>
        <el-button
          size="mini"
          round
          @click="groupHaldChange"
          v-if="ruleForm.groupBooking == 'assign'"
          :disabled="!canEdit"
          >{{ '选择' + ruleForm.title }}</el-button
        >
        <div
          style="max-width: 1000px"
          v-if="this.mShowDialog == false && ruleForm.groupBooking == 'assign' && ruleForm.tableData.length > 0"
        >
          <el-table :data="ruleForm.tableData" class="table">
            <el-table-column
              v-for="(key, val) of ruleForm.TAB_LIST"
              :key="key"
              :prop="val"
              :label="key"
              align="left"
              :width="key.indexOf('时间') != -1 ? 180 : 'auto'"
              :show-overflow-tooltip="true"
            >
              <span slot-scope="scope">{{ scope.row[val] }}</span>
            </el-table-column>
            <el-table-column label="活动时间" align="center" width="320" v-if="ruleForm.task == 3">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.activityStartTime) + '-' + formatDate(scope.row.activityEndTime) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="活动时间" align="center" width="320" v-if="ruleForm.task == 5">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.startTime) + '-' + formatDate(scope.row.endTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="canEdit" align="center" width="250">
              <template slot-scope="scope">
                <a class="table-scope" @click="onClickDelete(scope.row, scope.$index)">删除</a>
              </template>
            </el-table-column>
            <template slot="empty">
              <place-holder></place-holder>
            </template>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="任务目标：" prop="target">
        <div style="display: flex" class="item-target">
          <span>邀请</span>
          <el-input
            type="number"
            :min="0"
            v-model.number="ruleForm.target"
            style="width: 100px"
            :disabled="!canEdit"
          ></el-input>
          <span v-if="ruleForm.task == 1 || !ruleForm.task">名新用户</span>
          <span v-if="ruleForm.task == 2">名新用户观看直播。</span>
          <span v-if="ruleForm.task == 3">名用户参与拼团。</span>
          <span v-if="ruleForm.task == 4">名用户参与秒杀。</span>
          <span v-if="ruleForm.task == 5">名用户参与砍价。</span>
          <span v-if="ruleForm.task == 6">名用户参与购买商品。</span>
          <TipIcon :content="tip" title :flag="true"></TipIcon>
        </div>
      </el-form-item>
      <el-form-item label="达标奖励：" prop="award">
        <el-radio-group v-model="ruleForm.award" :disabled="!canEdit">
          <div class="integral-box">
            <el-radio label="1" name="coupon">优惠券</el-radio>
            <el-button size="mini" round @click="couponHaldChange" v-if="ruleForm.award == 1" :disabled="!canEdit"
              >选择优惠券</el-button
            >
          </div>
          <div
            style="width: 1000px; margin-bottom: 20px"
            v-if="mShowDialog_coupons == false && ruleForm.award == 1 && ruleForm.couponData.length > 0"
          >
            <el-table :data="ruleForm.couponData" class="table">
              <el-table-column label="优惠券名称" width="150px">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column label="劵总量" width="140px">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'couponData.' + scope.$index + '.issueTotal'"
                    :rules="rules.issueTotal"
                    style="margin: 0"
                  >
                    <el-input
                      type="number"
                      :min="0"
                      v-model="scope.row.issueTotal"
                      placeholder="请输入"
                      style="width: 100px"
                      :disabled="!canEdit"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === couponEnum.status.INVALID">无效</span>
                  <span v-if="scope.row.status === couponEnum.status.VALID">有效</span>
                  <span v-if="scope.row.status === couponEnum.status.EXPIRE">过期</span>
                  <span v-if="scope.row.status === couponEnum.status.FINISH">发放完毕</span>
                </template>
              </el-table-column>

              <el-table-column label="最低消费金额" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.row.minimumFee === couponEnum.MINIMUMFEE.UNLIMITED">无门槛</span>
                  <span v-else>￥{{ scope.row.minimumFee | price }}</span>
                </template>
              </el-table-column>

              <el-table-column label="优惠面值">
                <template slot-scope="scope">
                  <span v-if="scope.row.couponCategory === couponEnum.couponCategory.discount" class="orange"
                    >{{ scope.row.discountFee | discount }}折</span
                  >
                  <span v-else class="orange">￥{{ scope.row.discountFee | price }}</span>
                </template>
              </el-table-column>
              <el-table-column label="使用场景">
                <template slot-scope="scope">
                  <span>{{ scope.row.useScopeType | useScope }}</span>
                </template>
              </el-table-column>

              <el-table-column label="有效时间" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.couponType === couponEnum.couponType.default"
                    >领取后{{ scope.row.fixedTerm }}天过期</span
                  >
                  <span v-else>{{ scope.row.beginTime | time }} 至 {{ scope.row.endTime | time }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="canEdit">
                <template slot-scope="scope">
                  <a class="table-scope" @click="couponsOnClickDelete(scope.row, scope.$index)">删除</a>
                </template>
              </el-table-column>
              <template slot="empty">
                <place-holder></place-holder>
              </template>
            </el-table>
          </div>
          <div class="integral-box">
            <div class="nav-radio">
              <el-radio label="2" name="integral">积分</el-radio>
            </div>
            <div class="nav-text" v-show="ruleForm.award == 2">
              <el-form :model="integralForm" class="Form" :rules="integralRules" ref="integralForm">
                <el-form-item label="奖励" :label-width="'80'" prop="low">
                  <el-input
                    type="number"
                    :min="0"
                    v-model="integralForm.low"
                    style="width: 80px"
                    :disabled="!canEdit"
                  ></el-input>
                  <span class="form-name">积分</span>
                </el-form-item>
                <el-form-item label="，积分池" :label-width="'120'" prop="high" class="marginlet">
                  <el-input
                    type="number"
                    :min="0"
                    v-model="integralForm.high"
                    style="width: 80px"
                    :disabled="!canEdit"
                  ></el-input>
                  <span class="form-name">积分</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="integral-box">
            <div class="nav-radio">
              <el-radio label="3" name="cash">现金</el-radio>
            </div>
            <div class="nav-text" v-show="ruleForm.award == 3">
              <el-form :model="cashForm" class="Form" :rules="cashRules" ref="cashForm">
                <el-form-item label="奖励" :label-width="'80'" prop="low">
                  <el-input
                    type="number"
                    :min="0"
                    v-model="cashForm.low"
                    style="width: 80px"
                    :disabled="!canEdit"
                  ></el-input>
                  <span class="form-name">元</span>
                </el-form-item>
                <el-form-item label="，奖金池总" :label-width="'120'" prop="high" class="marginlet">
                  <el-input
                    type="number"
                    :min="0"
                    v-model.number="cashForm.high"
                    style="width: 80px"
                    :disabled="!canEdit"
                  ></el-input>
                  <span class="form-name">元</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="font-size: 12px; color: #999; margin-left: 0px; margin-top: 30px">
            * 奖励池发放完毕，任务自动结束
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分享文案：" prop="text" class="text-input">
        <el-input
          placeholder="建议不超过 15 个字符"
          type="textarea"
          style="width: 400px"
          :maxlength="24"
          :rows="3"
          v-model.trim="ruleForm.text"
          :disabled="!canEdit"
        />
      </el-form-item>
      <div class="bottom-button">
        <div class="save-box" v-if="canEdit">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="saveForm('ruleForm')" :loading="loading_from">保 存</el-button>
        </div>
        <el-button @click="$router.back()" v-if="!canEdit">返回</el-button>
      </div>
    </el-form>

    <TableSelectDialog
      v-model="mShowDialog"
      :enable-multiple="enableMultiple"
      :api-url="api_url"
      :columns="columns"
      @choose="handleChoose"
      :columns-handler="enableMultiple ? null : columnsHandler"
      :query-params="queryParams"
      :union-keys="['id']"
      :selected-list="selectedList"
    ></TableSelectDialog>

    <TableSelectDialog
      v-model="mShowDialog_coupons"
      :enable-multiple="enableMultiple_coupons"
      :api-url="'/wp/coupon/list'"
      :columns="columns_coupons"
      @choose="handleChoose_coupons"
      :columns-handler="enableMultiple_coupons ? null : columnsHandler_coupons"
      :query-params="copons_queryParams"
      :union-keys="['id']"
      :selected-list="selectedList"
      :width="'800px'"
      class="coupons_table"
    ></TableSelectDialog>

    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" class="message-box">
      <span>现金奖励将直接发至用户余额；奖励过高有风险，请谨慎设置</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import TipIcon from '../components/TipIcon';
  import { validator as elValidator, validator } from '@/dss-common/utils/index';
  import tableList from '../components/table-select/index.vue';
  import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index';
  import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin';
  import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
  import API from '@/dss-wechat3rd/src/api/task-center';
  import articleApi from '@/dss-wechat3rd/src/api/market-article';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import regexps from '@/dss-common/utils/regexps';
  import couponEnum from './CouponStatusEnum';
  import dateUtil from '@/dss-common/utils/date';
  import ExpireTimeColumn from './expire-time-column';
  import DiscountColumn from './discount-column';
  import PriceColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/priceColumn';
  import service from '@/dss-wechat3rd/src/api/index';
  import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages';

  const priceHandle = function ({ row, col, column }) {
    if (typeof row[col.prop] === 'number') {
      const val = '￥' + (row[col.prop] / 100).toFixed(2);
      row[col.prop] = val;
    }
    if (row[col.prop] == null) {
      row[col.prop] = '';
    }
  };

  const testNum = function (val) {
    return regexps.positiveInteger.reg.test(val) && val <= 999999;
  };

  // 小程序主页
  const INDEX = 'wxat-common/pages/home/index';

  export default {
    name: 'Taskcenter',
    mixins: [dialogMixin],
    data() {
      return {
        couponEnum,
        loading_from: false,
        activityAwardInfo: '',
        ruleForm: {
          name: '',
          date: [],
          task: '',
          taskOptions: [
            { name: '邀请新用户', id: 1 },
            /* { name: '观看直播', id: 2 }, */
            { name: '参与拼团', id: 3 },
            { name: '参与秒杀', id: 4 },
            { name: '参与砍价', id: 5 },
          ],
          palyId: '',
          title: '',
          palyIdOptions: [],
          options: [],
          groupBooking: '',
          totalAward: '',
          target: '',
          award: '',
          TAB_LIST: {},
          tableData: [],
          couponsTotalAward: '',
          couponData: [],
          coupon_LIST: [],
          issueTotal: '',
          pagePath: [],
          coverImage: null,
          text: '',
        },
        rules: {
          name: [
            {
              pattern: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
              message: '标签名称支持字母、数字、汉字、-、或 _',
              trigger: 'change',
            },
            { required: true, message: '请输入任务名称' },
            {
              min: 1,
              max: 20,
              message: '请输入任务名称，长度在 1 到 20 个字符',
              trigger: 'blur',
            },
            { validator: this.validateName, trigger: 'blur' },
          ],
          date: [{ required: true, message: '请选择任务时间', trigger: 'change' }],
          task: [{ required: true, message: '请选择任务内容', trigger: 'change' }],
          palyId: [
            {
              required: true,
              message: '请输入直播ID',
              trigger: 'blur',
            },
            {
              validator(rule, value, callback) {
                const _val = +value;
                if (Number.isNaN(_val)) {
                  callback(new Error('请正确输入正整数'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
          issueTotal: [
            { required: true, message: '请输入劵总量', trigger: 'blur' },
            {
              validator(rule, value, callback) {
                const _val = +value;
                if (_val <= 0) {
                  callback(new Error('请正确输入正整数'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
          groupBooking: [{ required: true, message: '请选择任务活动' }],
          target: [
            { required: true, message: '请输入任务目标', trigger: 'blur' },
            {
              validator(rule, value, callback) {
                if (typeof value !== 'number' || (Number.isInteger(Number(value)) && Number(value) <= 0)) {
                  callback(new Error('请正确输入用户数量不能小于1'));
                } else if (value.toString().length > 7) {
                  callback(new Error('邀请用户上限9999999人'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
          award: [{ required: true, message: '请输入达标奖励', trigger: 'change' }],
          pagePath: [{ required: true, message: '请选择邀请路径' }],
          coverImage: [{ required: true, message: '请选择海报封面' }],
          text: [{ required: true, message: '请输入分享文案' }],
        },
        tip: [
          {
            title: '目标描述',
            text: '客户通过分享成功授权手机号',
          },
        ],
        integralForm: {
          low: '',
          high: '',
        },
        integralRules: {
          low: [
            {
              validator: (rule, val, cb) => {
                if (!testNum(val)) {
                  cb(new Error('请输入正确的数量（0 ~ 999999）'));
                } else {
                  val = +val;
                  const high = +this.integralForm.high;
                  if (!high || (testNum(high) && val < high)) {
                    this.$refs.integralForm.clearValidate('low');
                    cb();
                  } else {
                    cb(new Error('积分池需要大于奖励积分'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
          high: [
            {
              validator: (rule, val, cb) => {
                if (!testNum(val)) {
                  cb(new Error('请输入正确的数量（0 ~ 999999）'));
                } else {
                  val = +val;
                  const low = +this.integralForm.low;
                  if (!low || (testNum(low) && val >= low)) {
                    this.$refs.integralForm.clearValidate('high');
                    cb();
                  } else {
                    cb(new Error('积分池需要大于奖励积分'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
        },
        cashForm: {
          low: '',
          high: '',
        },
        cashRules: {
          low: [
            {
              trigger: 'blur',
              validator: (rule, val, cb) => {
                const _val = +val;
                if (Number.isNaN(_val)) {
                  cb(new Error('请输入正确的正整数'));
                  return;
                } else if (_val >= 50) {
                  this.dialogVisible = true;
                  cb();
                  return;
                } else if (_val < 0.3) {
                  cb(new Error('请输入不能小于0.3元'));
                  return;
                } else if (_val.toString().split('.')[1].length > 2) {
                  cb(new Error('请输入小数点后两位'));
                  return;
                }
                cb();
              },
            },
            {
              validator: (rule, val, cb) => {
                val = Number.isNaN(+val) ? 0 : +val;
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val < +this.cashForm.high || +this.cashForm.high === '') {
                    this.$refs.cashForm.clearValidate('low');
                    cb();
                  } else {
                    cb(new Error('最低值需要小于最高值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
          high: [
            {
              validator: elValidator.numOrEmptyStr,
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val > this.cashForm.low || this.cashForm.high === '') {
                    this.$refs.cashForm.clearValidate('high');
                    cb();
                  } else {
                    cb(new Error('最高值需要大于最低值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
        },
        editID: null,
        dialogVisible: false,
        groupDialogVisible: false,

        enableMultiple: false,
        mShowDialog: false,
        selectedList: [],
        queryParams: {},
        api_url: null,
        columns: [],
        itemData: [],
        storeList: [
          {
            name: '门店01',
            id: 1,
          },
        ],
        params: {
          storeId: null,
          deviceName: null,
        },
        loading: {
          store: false,
        },
        columnsHandler: cols => {
          return cols.concat({
            label: '操作',
            align: 'left',
            sortable: false,
            component: ChooseColumn,
            listeners: {
              'choose-item': item => {
                this.ruleForm.tableData = [];
                this.ruleForm.totalAward = item.id;
                this.ruleForm.tableData = [item];
                this.mShowDialog = false;
              },
            },
          });
        },
        issueTotal: '',
        copons_queryParams: {},
        columns_coupons: [],
        enableMultiple_coupons: false,
        mShowDialog_coupons: false,
        columnsHandler_coupons: cols => {
          return cols.concat({
            label: '操作',
            align: 'left',
            sortable: false,
            component: ChooseColumn,
            listeners: {
              'choose-item': item => {
                this.ruleForm.couponData = [];
                this.ruleForm.couponsTotalAward = item.id;
                this.activityAwardInfo = item.id;
                this.ruleForm.couponData = [item];
                this.mShowDialog_coupons = false;
              },
            },
          });
        },
        customPages: [],
        status: null,
        categoryList: [],
      };
    },
    components: {
      TipIcon,
      TableSelectDialog,
      PlaceHolder,
      ChooseImages,
    },
    computed: {
      canEdit() {
        return this.status === null || this.status === 1;
      },
      defaultTime() {
        const nowDate = new Date();
        // 默认加 10 分钟
        const hour = nowDate.getHours() + parseInt((nowDate.getMinutes() + 10) / 60);
        const min = (nowDate.getMinutes() + 10) % 60;
        const seconds = nowDate.getSeconds();
        return [`${hour}:${min}:${seconds}`];
      },
      pickerOptions() {
        return {
          disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000, // 只能选择今天以后的日期
        };
      },
      ...mapState({
        curApp: 'curApp',
      }),
      pageOptions() {
        // 兼容家居行业转taro版小程序路径变化
        const isHome = this.curApp && this.curApp.industryKey === 'home';
        const graphUrl = isHome
          ? 'sub-packages/marketing-package/pages/graph/list/index'
          : 'wxat-common/pages/graph/list/index';
        return [
          {
            label: '主页',
            value: INDEX,
          },
          {
            label: '自定义页',
            value: 'custom',
            children: (this.customPages || []).map(p => ({ label: p.name, value: 'wxat-common/' + p.index })),
          },
          {
            label: '营销图文',
            value: graphUrl,
            children: this.categoryList.map(p => ({
              label: p.categoryName,
              value: `${graphUrl}?categroy=${p.id}`,
            })),
          },
        ];
      },
    },
    async mounted() {
      service.getUserTemplate().then(response => {
        if (response.data && response.data.templateId) {
          this.curTemplateId = response.data.id;
          this.getCustomPages();
        }
      });
      const id = this.$router.history.current.query.id;
      if (id) {
        this.editID = parseInt(id);
        this.getEditData();
      }

      // 查询所有图文分类
      let { data, totalCount } = await articleApi.categoryList({ pageSize: 1000 });
      if (data.length < totalCount) {
        data = await articleApi.categoryList({ pageSize: totalCount });
      }
      this.categoryList = data;
    },
    methods: {
      getCustomPages() {
        service
          .getCustomPagesV2({
            sellerTemplateId: this.curTemplateId,
          })
          .then(response => {
            if (response.success === true) {
              this.customPages = response.data;
            }
          });
      },
      // 编辑
      getEditData() {
        const params = {
          taskId: this.editID,
        };
        API.getEditTask(params).then(res => {
          const data = res.data;
          this.ruleForm.name = data.taskName;
          this.ruleForm.date = [data.startTime, data.endTime];
          this.ruleForm.target = data.targetTotal; // 任务目标
          const imgArr = data.taskReferInfo;
          this.status = data.status;
          if (data.taskType === 2) {
            this.ruleForm.palyId = data.taskReferId;
          } else if (data.taskType === 3) {
            this.ruleForm.tableData = [];
            this.ruleForm.title = '拼团';
            if (imgArr != null) {
              this.ruleForm.groupBooking = 'assign';
              this.ruleForm.tableData.push(imgArr);
            }
            this.ruleForm.TAB_LIST = {
              name: '活动名称',
              minPeople: '团购人数',
              priceRange: '团购价格',
              limitItemCount: '原价(￥)',
            };
          } else if (data.taskType === 4) {
            this.ruleForm.title = '秒杀';
            this.ruleForm.tableData = [];
            if (imgArr != null) {
              this.ruleForm.groupBooking = 'assign';
              this.ruleForm.tableData.push(imgArr);
            }
            this.ruleForm.TAB_LIST = {
              name: '活动名称',
              priceRange: '秒杀价',
              peopleLimitAmount: '限购',
              periodStartTime: '开始时间',
              periodEndTime: '结束时间',
            };
          } else {
            this.ruleForm.title = '砍价';
            this.ruleForm.tableData = [];
            if (imgArr != null) {
              this.ruleForm.groupBooking = 'assign';
              this.ruleForm.tableData.push(imgArr);
              this.ruleForm.tableData.forEach(item => {
                item.salePrice = '￥' + (item.salePrice / 100).toFixed(2);
                item.lowestPrice = '￥' + (item.lowestPrice / 100).toFixed(2);
              });
            }
            this.ruleForm.TAB_LIST = {
              activityName: '活动名称',
              salePrice: '售价',
              lowestPrice: '可砍最低价',
              bargainDuration: '发起砍价次数',
            };
          }
          this.ruleForm.task = data.taskType; // 任务内容
          this.ruleForm.award = data.awardType.toString(); // 奖励类型
          this.ruleForm.couponsTotalAward = data.totalAward;
          this.activityAwardInfo = data.awardInfo;
          if (data.awardType === 1) {
            // 优惠券
            const issueTotal = this.ruleForm.couponsTotalAward;

            API.getCouponsList({
              couponInfoId: data.awardInfo,
            }).then(r => {
              const obj = {
                ...r.data,
                issueTotal: issueTotal,
              };
              this.ruleForm.couponData.push(obj);
            });
          } else if (data.awardType === 2) {
            // 积分
            this.integralForm.low = data.awardInfo;
            this.integralForm.high = data.totalAward;
          } else {
            // 现金
            this.cashForm.low = data.awardInfo / 100;
            this.cashForm.high = data.totalAward / 100;
          }
          this.ruleForm.totalAward = data.taskReferId; // 活动ID
          this.ruleForm.coverImage = { imgUrl: data.coverImageUrl };
          let pagePath = [];
          if (this.ruleForm.task !== 1) {
            pagePath = [INDEX];
          } else if (data.pagePath.startsWith('wxat-common/pages/graph/list/index')) {
            pagePath = ['wxat-common/pages/graph/list/index', data.pagePath];
          } else if (data.pagePath.startsWith('sub-packages/marketing-package/pages/graph/list/index')) {
            pagePath = ['sub-packages/marketing-package/pages/graph/list/index', data.pagePath];
          } else {
            pagePath = ['custom', data.pagePath];
          }
          this.ruleForm.pagePath = pagePath;
          this.ruleForm.text = data.text;
        });
      },
      // 保存
      saveForm(ruleForm) {
        if (
          (this.ruleForm.task === 3 || this.ruleForm.task === 4 || this.ruleForm.task === 5) &&
          !this.ruleForm.tableData.length
        ) {
          this.$message({
            showClose: true,
            message: '请选择活动',
            type: 'warning',
          });
          return;
        }
        if (this.ruleForm.award == 1) {
          if (this.ruleForm.couponData < 1) {
            this.$message({
              showClose: true,
              message: '请选择优惠券',
              type: 'warning',
            });
            return;
          }
        }
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            this.loading_from = true;
            this.getAddSave();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 取消
      cancelForm() {
        this.$router.push({
          path: '/marketing/task-center/list',
        });
      },
      // 任务内容触发
      selectChange(val) {
        switch (val) {
          case 1:
            this.ruleForm.totalAward = val;
            this.tip = [
              {
                title: '目标描述',
                text: '客户通过分享成功授权手机号',
              },
            ];
            break;
          case 2:
            this.$refs.ruleForm.clearValidate('groupBooking');
            this.tip = [
              {
                title: '目标描述',
                text: '新客户通过分享者的分享观看直播即算邀约成功',
              },
            ];
            break;
          case 3:
            this.$refs.ruleForm.clearValidate('palyId');
            this.ruleForm.title = '拼团';
            this.ruleForm.groupBooking = '';
            this.ruleForm.tableData = [];
            this.tip = [
              {
                title: '目标描述',
                text: '新客户通过分享者的分享发起或参与参与拼团即算邀约成功',
              },
            ];
            break;
          case 4:
            this.$refs.ruleForm.clearValidate('palyId');
            this.ruleForm.groupBooking = '';
            this.ruleForm.tableData = [];
            this.ruleForm.title = '秒杀';
            this.tip = [
              {
                title: '目标描述',
                text: '新客户通过分享者的分享发起或参与参与秒杀即算邀约成功',
              },
            ];
            break;
          case 5:
            this.$refs.ruleForm.clearValidate('palyId');
            this.ruleForm.groupBooking = '';
            this.ruleForm.title = '砍价';
            this.ruleForm.tableData = [];
            this.tip = [
              {
                title: '目标描述',
                text: '新客户通过分享者的分享发起或参与参与砍价即算邀约成功',
              },
            ];
            break;
        }
      },
      groupHaldChange() {
        if (this.ruleForm.groupBooking && this.ruleForm.groupBooking == 'assign') {
          switch (this.ruleForm.title) {
            case '拼团':
              this.ruleForm.tableData = [];
              this.mShowDialog = true;
              this.queryParams = {
                status: 1,
              };
              this.api_url = '/wp/pt/list';
              this.ruleForm.TAB_LIST = {
                name: '活动名称',
                minPeople: '团购人数',
                priceRange: '团购价格',
                limitItemCount: '原价(￥)',
              };
              this.columns = [
                {
                  prop: 'name',
                  label: '活动名称',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'minPeople',
                  label: '拼团人数',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'priceRange',
                  label: '团购价格',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'labelPrice',
                  label: '原价(￥)',
                  propsHandler: priceHandle,
                },
              ];
              break;
            case '秒杀':
              this.api_url = '/wp/seckill/list';
              // this.mShowDialog_a = true
              this.mShowDialog = true;
              this.ruleForm.tableData = [];
              this.queryParams = {
                statusList: '0,1',
              };
              this.ruleForm.TAB_LIST = {
                name: '活动名称',
                priceRange: '秒杀价',
                peopleLimitAmount: '限购',
                periodStartTime: '开始时间',
                periodEndTime: '结束时间',
              };
              this.columns = [
                {
                  prop: 'name',
                  label: '活动名称',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'priceRange',
                  label: '秒杀价',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'peopleLimitAmount',
                  label: '限购',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'periodStartTime',
                  label: '开始时间',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'periodEndTime',
                  label: '结束时间',
                  propsHandler: Handler.propsHanler,
                },
              ];
              break;
            case '砍价':
              this.ruleForm.tableData = [];
              this.api_url = '/wp/bargain/activity/manage/list';
              this.mShowDialog = true;
              // this.mShowDialog_b = true
              this.queryParams = {
                status: 1,
              };
              this.ruleForm.TAB_LIST = {
                activityName: '活动名称',
                salePrice: '售价',
                lowestPrice: '可砍最低价',
                bargainDuration: '发起砍价次数',
              };
              this.columns = [
                {
                  prop: 'activityName',
                  label: '活动名称',
                  propsHandler: Handler.propsHanler,
                },
                {
                  prop: 'salePrice',
                  label: '售价',
                  propsHandler: priceHandle,
                },
                {
                  prop: 'lowestPrice',
                  label: '可砍最低价',
                  propsHandler: priceHandle,
                },
                {
                  prop: 'bargainDuration',
                  label: '发起砍价次数',
                  propsHandler: Handler.propsHanler,
                },
              ];
              break;
          }
        }
      },
      couponHaldChange() {
        if (this.ruleForm.award == 1 && this.ruleForm.award) {
          this.copons_queryParams = {
            status: 1,
            couponCentreStatus: 0,
          };
          this.mShowDialog_coupons = true;
          this.columns_coupons = [
            {
              prop: 'name',
              label: '名称',
              propsHandler: Handler.propsHanler,
            },
            {
              prop: 'minimumFee',
              label: '最低消费金额',
              component: PriceColumn,
            },
            {
              prop: 'discountFee',
              label: '优惠面值',
              component: DiscountColumn,
            },
            {
              prop: 'fixedTerm',
              label: '有效时间',
              width: '300px',
              // propsHandler: timeHandle
              component: ExpireTimeColumn,
            },
          ];
        }
      },
      handleChoose(rows) {
        console.log(rows, 'rows---->');
        // this.$emit('choose', rows)
      },
      handleChoose_coupons(rows) {
        console.log(rows, 'rows');
        // this.$emit('choose', rows)
      },
      // 保存创建任务
      getAddSave() {
        // 选择达标奖励
        let totalAward = '';
        let awardInfo = '';
        if (this.ruleForm.task === 2) {
          this.ruleForm.totalAward = this.ruleForm.palyId;
        }
        if (this.ruleForm.award === 1) {
          // 优惠券
          awardInfo = this.activityAwardInfo;
          totalAward = parseInt(this.ruleForm.couponData[0].issueTotal);
        } else if (this.ruleForm.award == 2) {
          // 积分
          awardInfo = this.integralForm.low;
          totalAward = this.integralForm.high;
        } else {
          // 现金
          awardInfo = this.cashForm.low * 100;
          totalAward = this.cashForm.high * 100;
        }
        const params = {
          taskName: this.ruleForm.name,
          startTime: this.ruleForm.date[0],
          endTime: this.ruleForm.date[1],
          targetTotal: this.ruleForm.target, // 任务内容
          targetType: 1,
          taskType: this.ruleForm.task, // 任务目标
          awardType: this.ruleForm.award, // 奖励类型
          awardInfo: awardInfo, // 达标奖励
          totalAward: totalAward, // 总奖励池
          taskReferId: this.ruleForm.totalAward, // 活动ID
          coverImageUrl: this.ruleForm.coverImage.imgUrl,
          text: this.ruleForm.text,
        };

        if (this.ruleForm.tableData.length) {
          const { id, itemNo } = this.ruleForm.tableData[0];
          switch (params.taskType) {
            case 3:
              params.pagePath = linkedPages.page.GROUP_DETAIL_PAGE + `?activityId=${id}&itemNo=${itemNo}`;
              break;
            case 4:
              params.pagePath = linkedPages.page.SEC_KILL_DETAIL_PAGE + `?activityId=${id}&itemNo=${itemNo}`;
              break;
            case 5:
              params.pagePath = linkedPages.page.CUT_PRICE_DETAIL_PAGE + `?activityId=${id}`;
              break;
            case 1:
            default:
              params.pagePath = this.ruleForm.pagePath.slice(-1)[0];
              break;
          }
        }

        if (this.editID) {
          params.id = this.editID;
        }
        console.log('创建活动:', params);
        API.getAddTask(params)
          .then(res => {
            if (res.data) {
              this.$router.push({
                path: '/marketing/task-center/list',
              });
              if (this.editID) {
                this.$message({
                  showClose: true,
                  message: '编辑任务成功',
                  type: 'success',
                });
              } else {
                this.$message({
                  showClose: true,
                  message: '创建任务成功',
                  type: 'success',
                });
              }
            } else {
              this.$message({
                showClose: true,
                message: '创建任务失败',
                type: 'danger',
              });
            }
          })
          .finally(() => {
            this.loading_from = false;
          });
      },
      dateHaldChange(val) {
        if (val) {
          this.ruleForm.date[0] = val[0];
          this.ruleForm.date[1] = val[1];
        }
      },
      // form 任务内容删除
      onClickDelete(rows, index) {
        this.ruleForm.tableData.splice(index, 1);
      },
      // form 优惠券删除
      couponsOnClickDelete(index) {
        this.ruleForm.couponData.splice(index, 1);
      },
      formatDate(date) {
        const dat = new Date(date);
        const year = dat.getFullYear();
        const month = dat.getMonth() + 1;
        const day = dat.getDate();
        const hour = dat.getHours();
        const minute = dat.getMinutes();
        const second = dat.getSeconds();
        return (
          year +
          '-' +
          (String(month).length > 1 ? month : '0' + month) +
          '-' +
          (String(day).length > 1 ? day : '0' + day) +
          ' ' +
          (String(hour).length > 1 ? hour : '0' + hour) +
          ':' +
          (String(minute).length > 1 ? minute : '0' + minute) +
          ':' +
          (String(second).length > 1 ? second : '0' + second)
        );
      },
    },
    filters: {
      time(val) {
        return dateUtil.format(new Date(val), 'YYYY-MM-DD HH:mm');
      },
      couponCategory(val) {
        let msg = '';
        switch (val) {
          case couponEnum.couponCategory.default:
            msg = '满减券';
            break;
          case couponEnum.couponCategory.freight:
            msg = '运费券';
            break;
          case couponEnum.couponCategory.discount:
            msg = '折扣券';
            break;
        }
        return msg;
      },
      useScope(val) {
        if (val === couponEnum.useScopeType.online.value) {
          return couponEnum.useScopeType.online.label;
        } else if (val === couponEnum.useScopeType.offline.value) {
          return couponEnum.useScopeType.offline.label;
        } else {
          return couponEnum.useScopeType.common.label;
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .taskcenter {
    .title {
      box-sizing: border-box;
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      font-weight: 600;
      color: #333;
      background: #fff;
      width: 100%;
      height: 50px;
      align-items: center;
      display: inline-block;
      border-bottom: 1px solid #dcdee0;
    }

    .ruleForm {
      background: #fff;
      padding: 20px 0px;
      .item-target {
        display: flex;
        span {
          color: #333333;
        }
        /deep/.el-input {
          padding: 0 5px;
        }
      }
      .integral-box {
        &:first-child {
          line-height: 30px;
        }
        display: flex;
        align-items: center;
        height: 30px;
        margin-bottom: 10px;
        .nav-text {
          width: 100%;
          display: flex;
          align-items: center;
          .Form {
            display: flex;
            .el-form-item {
              display: flex;
            }
            .el-form-item {
              margin-bottom: 0px;
            }
            .form-name {
              color: #333333;
              margin-left: 10px;
            }
          }
        }
      }
    }

    .message-box {
      /deep/.el-dialog__header {
        padding: 20px 20px 10px;
        text-align: center;
        font-weight: bold;
      }
      /deep/.dialog__body {
        padding: 30px 20px;
      }
      /deep/.dialog-footer {
        width: 100%;
        display: flex;
        position: relative;
        left: 42%;
      }
      /deep/.el-dialog__body {
        padding: 30px 20px;
        color: #ccc;
        text-align: center;
        font-size: 14px;
      }
    }

    .marginTop {
      margin-top: 20px;
    }
    .marginlet {
      margin-left: 10px;
    }
    .el-table a {
      cursor: pointer;
    }
    /deep/.el-table__header {
      width: 100%;
    }
    .coupons_table {
      /deep/.el-table .cell {
        font-size: 12px !important;
        padding: 20px 15px;
      }
    }
  }
  .tip {
    left: 378px;
    top: 669.48px;
    width: 326px;
    height: 17px;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    text-align: left;
    font-family: PingFangSC-Regular;
  }

  .text-input {
    /deep/textarea.el-textarea__inner {
      line-height: 30px;
    }
  }

  .taskcenter {
    /deep/.el-form-item__content div.el-form-item__error {
      white-space: nowrap;
      margin: 0;
    }
  }
</style>
