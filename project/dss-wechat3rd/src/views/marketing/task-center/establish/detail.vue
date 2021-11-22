<template>
  <div class="taskcenter">
    <div class="title">
      <span><span style="cursor:pointer" @click="$router.back()">代言任务</span>/创建任务</span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm" :disabled="!canEdit">
      <el-form-item label="标签名称：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入" style="width: 350px"></el-input>
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
          :picker-options="ruleForm.pickerOptions"
          @change="dateHaldChange"
          size="small"
          style="width: 350px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="任务内容：" prop="task">
        <el-select
          v-model="ruleForm.task"
          placeholder="请选择"
          style="width: 350px"
          @change="selectChange"
        >
          <el-option
            v-for="item in ruleForm.taskOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播ID：" v-if="ruleForm.task===2" prop="palyId">
        <el-input v-model="ruleForm.palyId" placeholder="请输入" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item
        :label="'选择'+ruleForm.title+'：'"
        prop="groupBooking"
        v-if="ruleForm.task&&ruleForm.task==3||ruleForm.task==4||ruleForm.task==5"
      >
        <el-radio-group v-model="ruleForm.groupBooking">
          <el-radio label="assign" name="assign">{{'指定'+ruleForm.title}}</el-radio>
        </el-radio-group>
        <el-button size="mini" round @click="groupHaldChange">{{'选择'+ruleForm.title}}</el-button>
        <el-table
          :disabled="canEdit"
          :data="ruleForm.tableData"
          class="table"
          style="width: 100%"
          v-if="ruleForm.groupBooking=='assign'&&ruleForm.task==3||ruleForm.task==4||ruleForm.task==5"
        >
          <el-table-column prop="name" v-if="ruleForm.task==3||ruleForm.task==4" label="活动名称" show-overflow-tooltip></el-table-column>
          <el-table-column  v-if="ruleForm.task==5" prop="activityName" label="活动名称" show-overflow-tooltip></el-table-column>
          <el-table-column
            v-for="(key, val) of ruleForm.TAB_LIST"
            :key="key"
            :prop="val"
            :label="key"
            align="left"
            :show-overflow-tooltip="true"
          >
            <span slot-scope="scope">{{ scope.row[val] }}</span>
          </el-table-column>
          <el-table-column  label="状态" v-if="ruleForm.task==3||ruleForm.task==4">
              <template slot-scope="scope" >
                <span v-if="scope.row.status===0">无效</span>
                <span v-if="scope.row.status===1">有效</span>
                <span v-if="scope.row.status===2">过期</span>
                <span v-if="scope.row.status===3">发放完毕</span>
              </template>
            </el-table-column>
            <el-table-column  label="状态" v-if="ruleForm.task==5">
              <template slot-scope="scope">
                <span v-if="scope.row.activityStatus===0">无效</span>
                <span v-if="scope.row.activityStatus===1">有效</span>
                <span v-if="scope.row.activityStatus===2">过期</span>
                <span v-if="scope.row.activityStatus===3">发放完毕</span>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" align="center" width="320" v-if="ruleForm.task==3">
              <template slot-scope="scope">
                <span>{{formatDate(scope.row.activityStartTime)+'-'+formatDate(scope.row.activityEndTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" align="center" width="320" v-if="ruleForm.task==5">
              <template slot-scope="scope">
                <span>{{formatDate(scope.row.startTime)+'-'+formatDate(scope.row.endTime)}}</span>
              </template>
            </el-table-column>
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
              <a class="table-scope" @click="onClickDelete(scope.row,scope.$index)">删除</a>
            </template>
          </el-table-column>
          <template slot="empty">
            <place-holder></place-holder>
          </template>
        </el-table>
      </el-form-item>
      <el-form-item label="任务目标：" prop="target">
        <div style="display: flex" class="item-target">
          <span>邀请</span>
          <el-input type="text" v-model="ruleForm.target" style="width:100px"></el-input>
          <span v-if="ruleForm.task==1||!ruleForm.task">名新用户</span>
          <span v-if="ruleForm.task==2">名新用户观看直播。</span>
          <span v-if="ruleForm.task==3">名用户参与拼团。</span>
          <span v-if="ruleForm.task==4">名用户参与秒杀。</span>
          <span v-if="ruleForm.task==5">名用户参与砍价。</span>
          <span v-if="ruleForm.task==6">名用户参与购买商品。</span>
          <TipIcon :content="tip" title :flag="true"></TipIcon>
        </div>
      </el-form-item>
      <el-form-item label="达标奖励：" prop="award">
        <el-radio-group v-model="ruleForm.award">
          <el-radio label="1" name="coupon">优惠券</el-radio>
          <el-button size="mini" round @click="couponHaldChange" v-if="ruleForm.award==1">选择优惠券</el-button>
          <el-table
            :data="ruleForm.couponData"
            class="table"
            style="width: 100%"
            v-if="ruleForm.award==1"
          >
            <el-table-column label="优惠券名称"
                          >
              <template slot-scope="scope">
                <span>{{ scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="planName"  label="劵总量">
              <template slot-scope="scope">
                <el-input v-model="issueTotal" placeholder="请输入" style="width: 150px"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status===couponEnum.status.INVALID">无效</span>
                <span v-if="scope.row.status===couponEnum.status.VALID">有效</span>
                <span v-if="scope.row.status===couponEnum.status.EXPIRE">过期</span>
                <span v-if="scope.row.status===couponEnum.status.FINISH">发放完毕</span>
              </template>
            </el-table-column>

            <el-table-column label="最低消费金额">
              <template slot-scope="scope">
                <span v-if="scope.row.minimumFee===couponEnum.MINIMUMFEE.UNLIMITED">无门槛</span>
                <span v-else>￥{{ scope.row.minimumFee | price}}</span>
              </template>
            </el-table-column>

            <el-table-column label="优惠面值">
              <template slot-scope="scope">
                <span v-if="scope.row.couponCategory === couponEnum.couponCategory.discount"
                      class="orange">{{ scope.row.discountFee | discount}}折</span>
                <span v-else
                      class="orange">￥{{ scope.row.discountFee | price}}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用场景">
              <template slot-scope="scope">
                <span>{{ scope.row.useScopeType | useScope}}</span>
              </template>
            </el-table-column>

            <el-table-column label="有效时间"
                            width="320">
              <template slot-scope="scope">
                <span v-if="scope.row.couponType===couponEnum.couponType.default">领取后{{ scope.row.fixedTerm}}天过期</span>
                <span v-else>{{ scope.row.beginTime |time}} 至 {{ scope.row.endTime |time}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a class="table-scope" @click="couponsOnClickDelete(scope.row,scope.$index)">删除</a>
              </template>
            </el-table-column>
            <template slot="empty">
              <place-holder></place-holder>
            </template>
          </el-table>
          <br />
          <div class="integral-box">
            <div class="nav-radio">
              <el-radio label="2" name="integral">积分</el-radio>
            </div>
            <div class="nav-text" v-show="ruleForm.award==2">
              <el-form :model="integralForm" class="Form" ref="integralForm" :disabled="!canEdit">
                <el-form-item label="奖励" :label-width="'80'" prop="low">
                  <el-input type="text" v-model.number="integralForm.low" style="width:80px"></el-input>
                </el-form-item>
                <el-form-item label="积分，池总" :label-width="'120'" prop="high" class="marginlet">
                  <el-input type="text" v-model.number="integralForm.high" style="width:80px"></el-input>
                  <span class="form-name">积分</span>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <br />
          <div class="integral-box">
            <div class="nav-radio">
              <el-radio label="3" name="cash">现金</el-radio>
            </div>
            <div class="nav-text" v-show="ruleForm.award==3">
              <el-form :model="cashForm" class="Form"  ref="cashForm" :disabled="!canEdit">
                <el-form-item label="奖励" :label-width="'80'" prop="low">
                  <el-input type="text" v-model.number="cashForm.low" style="width:80px"></el-input>
                </el-form-item>
                <el-form-item label="现金，池总" :label-width="'120'" prop="high" class="marginlet">
                  <el-input type="text" v-model.number="cashForm.high" style="width:80px"></el-input>
                  <span class="form-name">元</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="save-box marginTop" v-if="canEdit">
          <el-button type="primary" round @click="saveForm('ruleForm')" :loading="loading_from" >保 存</el-button>
          <!-- <el-button :round="true" @click="cancelForm('ruleForm')">{{canEdit ? '取消' : '返回'}}</el-button> -->
          <el-button :round="true"  @click="cancelForm" >取消</el-button>

        </div>
      </el-form-item>
    </el-form>
    <el-button round @click="$router.back()" v-if="!canEdit" style="margin: 0 0px 20px 135px;">返回</el-button>

    <TableSelectDialog
      v-model="mShowDialog"
      :enable-multiple="enableMultiple"
      :api-url="api_url"
      :columns="columns"
      @choose="handleChoose"
      :columns-handler="enableMultiple ?null  : columnsHandler"
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
      :columns-handler="enableMultiple_coupons ?null  : columnsHandler_coupons"
      :query-params="queryParams"
      :union-keys="['id']"
      :selected-list="selectedList"
    ></TableSelectDialog>

    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" class="message-box">
      <span>现金奖励将直接发至用户余额；奖励多高有风险，请谨慎设置</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TipIcon from '../components/TipIcon';
import { validator as elValidator } from '@/dss-common/utils/index';

import tableList from '../components/table-select/index.vue';
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
import API from '@/dss-wechat3rd/src/api/task-center.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import ImageBox from '../components/image-box/index';
import couponEnum from './CouponStatusEnum.js';
import dateUtil from '@/dss-common/utils/date.js';

const priceHandle = function({ row, col, column }) {
  if (typeof row[col.prop] === 'number') {
    const val = '￥' + (row[col.prop] / 100).toFixed(2);
    row[col.prop] = val;
  }
  if (row[col.prop] == null) {
    row[col.prop] = '';
  }
};
const faomatterHandle = function({ row, col, column }) {
  if (typeof row[col.prop] === 'number') {
    const val = (row[col.prop] / 100).toFixed(2);
    row[col.prop] = val;
  }
  if (row[col.prop] == null) {
    row[col.prop] = '';
  }
};
const timeHandle = function({ row, col, column }) {
  if (typeof row[col.prop] === 'number') {
    const val = '领取后' + row[col.prop] + '天过期';
    row[col.prop] = val;
  }
  if (row[col.prop] == null) {
    row[col.prop] = '';
  }
};
export default {
  name: 'taskcenter',
  mixins: [dialogMixin],
  props: [''],
  // inject: ['canEdit'],
  data() {
    return {
      couponEnum,
      disabled: null,
      canEdit: null,
      loading_from: false,
      ruleForm: {
        name: '',
        date: [],
        pickerOptions: {},
        task: '',
        taskOptions: [
          { name: '邀请新用户', id: 1 },
          // { name: '观看直播', id: 2 },
          { name: '参与拼团', id: 3 },
          { name: '参与秒杀', id: 4 },
          { name: '参与砍价', id: 5 }
        ],
        palyId: '',
        title: null,
        palyIdOptions: [],
        options: [],
        groupBooking: '',
        totalAward: '',
        target: null,
        award: '',
        TAB_LIST: {},
        tableData: [],
        couponsTotalAward: '',
        couponData: [],
        coupon_LIST: []
      },
      rules: {
        name: [
          {
            pattern: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
            message: '标签名称支持字母、数字、汉字、-、或 _',
            trigger: 'change'
          },
          { required: true, message: '请输入标签名称' },
          {
            min: 1,
            max: 20,
            message: '请输入标签名称，长度在 1 到 20 个字符',
            trigger: 'blur'
          },
          { validator: this.validateName, trigger: 'blur' }
        ],
        date: [{ required: true, message: '请选择任务时间', trigger: 'change' }],
        task: [{ required: true, message: '请选择任务内容', trigger: 'change' }],
        palyId: [
          // { required: true, message: '请输入直播ID' },
          {
            min: 1,
            max: 20,
            required: true,
            message: '请输入直播ID，长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        groupBooking: [{ required: true, message: '请选择标签描述' }],
        target: [{ required: true, message: '请输入任务目标', trigger: 'blur' }],
        award: [{ required: true, message: '请输入达标奖励', trigger: 'change' }]
      },
      tip: [
        {
          title: '目标描述',
          text: '客户通过分享成功授权手机号'
        }
      ],
      integralForm: {
        low: '',
        high: ''
      },
      cashForm: {
        low: '',
        high: ''
      },
      editID: '',
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
          id: 1
        }
      ],
      params: {
        storeId: null,
        deviceName: null
      },
      loading: {
        store: false
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
            }
          }
        });
      },
      issueTotal: '',
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
              this.ruleForm.couponData = [item];

              this.mShowDialog_coupons = false;
            }
          }
        });
      }
    };
  },
  components: {
    TipIcon,
    tableList,
    TableSelectDialog,
    PlaceHolder,
    ImageBox
  },
  computed: {},
  watch: {
    'ruleForm.award': function(val) {
      // console.log(typeof(val),'0000')
    }
  },
  mounted() {
    this.editID = this.$router.history.current.query.id;
    if (this.editID) {
      this.getEditData();
    }
  },
  methods: {
    //编辑
    getEditData() {
      let params = {
        taskId: this.editID
      };
      API.getEditTask(params)
        .then(res => {
          let data = res.data;
          this.ruleForm.name = data.taskName;
          this.ruleForm.date = [data.startTime, data.endTime];
          this.ruleForm.tableData = [];
          this.ruleForm.target = data.targetTotal; //任务目标
          let imgArr = data.taskReferInfo;
          if (data.taskType == 1) {
          } else if (data.taskType == 2) {
            this.ruleForm.palyId = data.taskReferId;
          } else if (data.taskType == 3) {
            this.ruleForm.task == 3;
            this.ruleForm.TAB_LIST = {
              // name: '活动名称',
              minPeople: '团购人数',
              priceRange: '团购价格',
              limitItemCount: '原价(￥)'
            };
            this.ruleForm.title = '拼团';
            if (imgArr != null) {
              this.ruleForm.groupBooking = 'assign';
              this.ruleForm.tableData.push(imgArr);
            }
          } else if (data.taskType == 4) {
            this.ruleForm.title = '秒杀';
            this.ruleForm.TAB_LIST = {
              // name: '活动名称',
              priceRange: '秒杀价',
              peopleLimitAmount: '限购',
              periodStartTime: '开始时间',
              periodEndTime: '结束时间'
            };
            if (imgArr != null) {
              this.ruleForm.groupBooking = 'assign';
              this.ruleForm.tableData.push(imgArr);
            }
          } else {
            this.ruleForm.title = '砍价';
            this.ruleForm.TAB_LIST = {
              // activityName: '活动名称',
              salePrice: '售价',
              lowestPrice: '可砍最低价',
              bargainDuration: '发起砍价次数'
            };
            if (imgArr != null) {
              this.ruleForm.groupBooking = 'assign';
              this.ruleForm.tableData.push(imgArr);
              this.ruleForm.tableData.forEach(item => {
                item.salePrice = (item.salePrice / 100).toFixed(2);
                item.lowestPrice = (item.lowestPrice / 100).toFixed(2);
              });
            }
          }
          this.ruleForm.task = data.taskType; // 任务内容
          this.ruleForm.award = data.awardType.toString(); // 奖励类型
          if (data.awardType == 1) {
            //优惠券
            let params = {
              couponInfoId: data.awardInfo
            };
            this.issueTotal = data.totalAward;
            API.getCouponsList(params)
              .then(res => {
                this.ruleForm.couponData.push(res.data);
              })
              .always(() => {});
            // this.ruleForm.couponsTotalAward = data.totalAward
            // this.ruleForm.couponData.push(data.totalAward)
          } else if (data.awardType == 2) {
            //积分
            this.integralForm.low = data.awardInfo;
            this.integralForm.high = data.totalAward;
          } else {
            //现金
            this.cashForm.low = data.awardInfo;
            this.cashForm.high = data.totalAward;
          }
        })
        .always(() => {});
    },
    // 保存
    saveForm(ruleForm) {
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
        path: '/marketing/task-center/list'
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
              text: '客户通过分享成功授权手机号'
            }
          ];
          break;
        case 2:
          this.ruleForm.palyId = this.ruleForm.totalAward;
          this.tip = [
            {
              title: '目标描述',
              text: '新客户通过分享者的分享观看直播即算邀约成功'
            }
          ];
          break;
        case 3:
          this.ruleForm.title = '拼团';
          this.tip = [
            {
              title: '目标描述',
              text: '新客户通过分享者的分享发起或参与拼团即算邀约成功'
            }
          ];
          break;
        case 4:
          this.ruleForm.title = '秒杀';
          this.tip = [
            {
              title: '目标描述',
              text: '新客户通过分享者的分享发起或参与秒杀即算邀约成功'
            }
          ];
          break;
        case 5:
          this.ruleForm.title = '砍价';
          this.tip = [
            {
              title: '目标描述',
              text: '新客户通过分享者的分享发起或参与砍价即算邀约成功'
            }
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
            this.api_url = '/wp/pt/list';
            this.ruleForm.TAB_LIST = {
              name: '用户名称',
              minPeople: '团购人数',
              priceRange: '团购价格',
              limitItemCount: '原价(￥)'
            };
            this.columns = [
              {
                prop: 'name',
                label: '名称',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'minPeople',
                label: '拼团人数',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'priceRange',
                label: '团购价格',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'labelPrice',
                label: '原价(￥)',
                propsHandler: priceHandle
              }
            ];
            break;
          case '秒杀':
            this.api_url = '/wp/seckill/list';
            // this.mShowDialog_a = true
            this.mShowDialog = true;
            this.ruleForm.tableData = [];
            // this.mShowDialog = true
            this.ruleForm.TAB_LIST = {
              name: '名称',
              priceRange: '秒杀价',
              peopleLimitAmount: '限购',
              periodStartTime: '开始时间',
              periodEndTime: '结束时间'
            };
            this.columns = [
              {
                prop: 'name',
                label: '名称',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'priceRange',
                label: '秒杀价',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'peopleLimitAmount',
                label: '限购',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'periodStartTime',
                label: '开始时间',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'periodEndTime',
                label: '结束时间',
                propsHandler: Handler.propsHanler
              }
            ];
            break;
          case '砍价':
            this.api_url = '/wp/bargain/activity/manage/list';
            this.mShowDialog = true;
            // this.mShowDialog_b = true
            this.ruleForm.TAB_LIST = {
              activityName: '名称',
              salePrice: '售价',
              lowestPrice: '可砍最低价',
              bargainDuration: '发起砍价次数'
            };
            this.columns = [
              {
                prop: 'activityName',
                label: '名称',
                propsHandler: Handler.propsHanler
              },
              {
                prop: 'salePrice',
                label: '售价',
                propsHandler: priceHandle
              },
              {
                prop: 'lowestPrice',
                label: '可砍最低价',
                propsHandler: priceHandle
              },
              {
                prop: 'bargainDuration',
                label: '发起砍价次数',
                propsHandler: Handler.propsHanler
              }
            ];
            break;
        }
      }
    },
    couponHaldChange() {
      if (this.ruleForm.award == 1 && this.ruleForm.award) {
        this.mShowDialog_coupons = true;
        this.columns_coupons = [
          {
            prop: 'name',
            label: '名称',
            propsHandler: Handler.propsHanler
          },
          {
            prop: 'minimumFee',
            label: '最低消费金额',
            propsHandler: priceHandle
          },
          {
            prop: 'discountFee',
            label: '优惠面值',
            propsHandler: faomatterHandle
          },
          {
            prop: 'fixedTerm',
            label: '有效时间',
            propsHandler: timeHandle
          }
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
      //选择达标奖励
      let totalAward = '',
        awardInfo = '';
      if (this.ruleForm.award == 1) {
        //优惠券
        totalAward = this.issueTotal;
        awardInfo = this.ruleForm.couponsTotalAward;
      } else if (this.ruleForm.award == 2) {
        //积分
        awardInfo = this.integralForm.low * 100;
        totalAward = this.integralForm.high;
      } else {
        //现金
        awardInfo = this.cashForm.low * 100;
        totalAward = this.cashForm.high;
      }
      let params = {
        taskName: this.ruleForm.name,
        startTime: this.ruleForm.date[0],
        endTime: this.ruleForm.date[1],
        targetTotal: this.ruleForm.target, //任务内容
        targetType: 1,
        taskType: this.ruleForm.task, // 任务目标
        awardType: this.ruleForm.award, //奖励类型
        awardInfo: awardInfo, //达标奖励
        totalAward: totalAward, // 总奖励池
        taskReferId: this.ruleForm.groupBooking == 'all' ? '' : this.ruleForm.totalAward, // 活动ID
        taskId: this.editID ? this.editID : ''
      };
      API.getAddTask(params)
        .then(res => {
          console.log(res);
          if (res.data) {
            this.$router.push({
              path: '/marketing/task-center/list'
            });
            this.$message({
              showClose: true,
              message: '创建任务成功',
              type: 'success'
            });
          } else {
            this.$message({
              showClose: true,
              message: '创建任务失败',
              type: 'danger'
            });
          }
        })
        .always(() => {
          this.loading_from = false;
        });
    },
    dateHaldChange(val) {
      this.ruleForm.date[0] = val[0];
      this.ruleForm.date[1] = val[1];
    },
    //form 任务内容删除
    onClickDelete(rows, index) {
      if (this.canEdit) {
        this.ruleForm.tableData.splice(index, 1);
      }
    },
    //form 优惠券删除
    couponsOnClickDelete(index) {
      if (this.canEdit) {
        this.ruleForm.couponData.splice(index, 1);
      }
    },
    formatDate(date) {
      let dat = new Date(date);
      let year = dat.getFullYear();
      let month = dat.getMonth() + 1;
      let day = dat.getDate();
      let hour = dat.getHours();
      let minute = dat.getMinutes();
      let second = dat.getSeconds();
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
    keepTwoDecimalFull(num) {
      let result = parseFloat(num);
      if (isNaN(result)) {
        return false;
      }
      result = Math.round(num * 100) / 100;
      let s_x = result.toString();
      let pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
      }
      return s_x;
    }
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
    }
  }
};
</script>
<style lang='less' scoped>
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
    padding: 10px 20px;
    border-bottom: 1px solid #dcdee0;
    align-items: center;
    display: inline-block;
  }
  .ruleForm {
    padding: 60px 0px 0 40px;
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
      display: flex;
      .nav-radio {
        margin-top: 15px;
      }
      .nav-text {
        width: 100%;
        display: flex;
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
  .save-box {
    text-align: left;
    padding-bottom: 20px;
  }
  .el-table a {
    cursor: pointer;
  }
  /deep/.el-table__header{
    width: 100%;
  }
}
</style>
